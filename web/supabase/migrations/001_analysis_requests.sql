-- Analysis Requests Table for Clip-to-Coach AI System
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS analysis_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  clip_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'error')),
  
  -- Context inputs from user
  inputs_json JSONB NOT NULL DEFAULT '{}',
  -- Example: { "formation": "4-3-3", "playstyle": "press", "intent": "...", "mistake_timestamp": "00:12" }
  
  -- AI processing outputs
  frames_urls TEXT[],
  observations_json JSONB,
  report_json JSONB,
  error_message TEXT,
  
  -- User feedback (for Level 2 data collection)
  feedback_correct BOOLEAN,
  feedback_helpful INTEGER CHECK (feedback_helpful BETWEEN 1 AND 5),
  feedback_tags TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE analysis_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
  ON analysis_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can insert own requests"
  ON analysis_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own requests
CREATE POLICY "Users can update own requests"
  ON analysis_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Also allow service role full access (for API routes)
CREATE POLICY "Service role full access"
  ON analysis_requests FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create clips storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('clips', 'clips', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for clips bucket
CREATE POLICY "Anyone can upload clips"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'clips');

CREATE POLICY "Anyone can read clips"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clips');

-- Create frames storage bucket (for extracted frames)
INSERT INTO storage.buckets (id, name, public)
VALUES ('frames', 'frames', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload frames"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'frames');

CREATE POLICY "Anyone can read frames"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'frames');
