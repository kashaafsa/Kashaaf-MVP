import os, time, tempfile
import requests
import cv2
from dotenv import load_dotenv
from supabase import create_client

import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
POLL = int(os.getenv("POLL_SECONDS", "3"))

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

def download(url: str, path: str):
    r = requests.get(url, stream=True, timeout=180)
    r.raise_for_status()
    with open(path, "wb") as f:
        for chunk in r.iter_content(chunk_size=1024 * 1024):
            if chunk:
                f.write(chunk)

def video_basic_metrics(video_path: str):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError("Cannot open video (cv2)")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration = (frames / fps) if frames else 0.0
    cap.release()
    return {"fps": float(fps), "frames": frames, "duration_sec": float(duration)}

def run_once():
    # 1) claim job_id (uuid)
    job_id = sb.rpc("claim_next_analysis_request_id", {}).execute().data
    if not job_id:
        return False

    # 2) fetch job row
    rows = sb.table("analysis_requests").select("*").eq("id", job_id).execute().data
    if not rows:
        return False

    job = rows[0]
    req_id = job.get("id")
    video_url = job.get("video_url")

    if not req_id or not video_url or str(video_url).lower().strip() == "none":
        return False

    try:
        with tempfile.TemporaryDirectory() as td:
            path = os.path.join(td, "clip.mp4")
            download(video_url, path)
            metrics = video_basic_metrics(path)

            sb.table("analysis_reports").upsert({
                "request_id": req_id,
                "summary": "Pipeline OK (Level-0). Next: FIFA Match Facts OCR.",
                "overall_score": 50,
                "metrics": metrics,
                "recommendations": {"top_3": ["Next: add OCR for Match Facts screen."]}
            }).execute()

            sb.table("analysis_requests").update({"status": "done"}).eq("id", req_id).execute()

    except Exception as e:
        if req_id:
            sb.table("analysis_requests").update({"status": "failed", "error": str(e)}).eq("id", req_id).execute()

    return True

def main():
    print("Worker running…")
    while True:
        did = run_once()
        time.sleep(1 if did else POLL)
print(".", end="", flush=True)

if __name__ == "__main__":
    main()

