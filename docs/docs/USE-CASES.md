# Kashaaf MVP Use Cases

## 1. Auth

**Actors:** PLAYER, ORG

**Preconditions:** User has valid account credentials

**Main Steps:**
1. User navigates to login page
2. User enters email/username and password
3. System validates credentials
4. System assigns role (PLAYER or ORG)
5. User is redirected to dashboard

**Success Criteria:** User is authenticated and redirected to appropriate dashboard based on role

---

## 2. Player Profile

**Actors:** PLAYER

**Preconditions:** User is authenticated as PLAYER

**Main Steps:**
1. PLAYER navigates to profile section
2. PLAYER enters/updates personal information (name, age, position, bio)
3. PLAYER uploads profile photo
4. PLAYER sets visibility preferences
5. System saves profile data

**Success Criteria:** Profile is created/updated and visible according to privacy settings

---

## 3. Feed Post

**Actors:** PLAYER, ORG

**Preconditions:** User is authenticated

**Main Steps:**
1. User navigates to feed
2. User views posts from followed accounts
3. User can like, comment, or share posts
4. Feed updates in real-time

**Success Criteria:** User can view and interact with feed content

---

## 4. Upload Video

**Actors:** PLAYER

**Preconditions:** PLAYER is authenticated and has video file ready

**Main Steps:**
1. PLAYER navigates to upload section
2. PLAYER selects video file
3. PLAYER adds title, description, and tags
4. System validates video format
5. System uploads video and triggers AI analysis
6. Video appears in PLAYER's profile

**Success Criteria:** Video is uploaded successfully and AI analysis is queued

---

## 5. View Report

**Actors:** PLAYER, ORG

**Preconditions:** Video analysis is complete, user has access to video

**Main Steps:**
1. User navigates to video details page
2. User clicks "View Analysis Report"
3. System displays AI-generated performance metrics
4. User can view insights, statistics, and recommendations
5. User can export/share report

**Success Criteria:** Analysis report is displayed with all metrics and insights

---

## 6. ORG Search + Shortlist

**Actors:** ORG

**Preconditions:** ORG is authenticated

**Main Steps:**
1. ORG navigates to search page
2. ORG enters search criteria (position, skills, metrics)
3. System displays matching PLAYER profiles
4. ORG reviews player profiles and analysis reports
5. ORG adds players to shortlist
6. ORG can organize and manage shortlist

**Success Criteria:** ORG finds relevant players and successfully adds them to shortlist
