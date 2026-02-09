# Kashaaf MVP Database Schema

## profiles

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | NOT NULL (PLAYER/ORG) |
| display_name | VARCHAR(255) | |
| profile_photo_url | VARCHAR(500) | |
| visibility | VARCHAR(20) | DEFAULT 'public' |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

## player_profiles

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| profile_id | UUID | FOREIGN KEY (profiles.id), UNIQUE, NOT NULL |
| age | INTEGER | |
| position | VARCHAR(50) | |
| bio | TEXT | |
| skills | TEXT[] | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

## posts

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| author_id | UUID | FOREIGN KEY (profiles.id), NOT NULL |
| title | VARCHAR(255) | |
| description | TEXT | |
| tags | TEXT[] | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

## post_media

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| post_id | UUID | FOREIGN KEY (posts.id), NOT NULL |
| media_type | VARCHAR(20) | NOT NULL (video/image) |
| media_url | VARCHAR(500) | NOT NULL |
| file_size | BIGINT | |
| duration | INTEGER | |
| order_index | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | NOT NULL |

## analysis_requests

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| post_media_id | UUID | FOREIGN KEY (post_media.id), NOT NULL |
| status | VARCHAR(20) | NOT NULL (pending/processing/completed/failed) |
| requested_at | TIMESTAMP | NOT NULL |
| completed_at | TIMESTAMP | |

## analysis_reports

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| analysis_request_id | UUID | FOREIGN KEY (analysis_requests.id), UNIQUE, NOT NULL |
| metrics | JSONB | NOT NULL |
| insights | TEXT | |
| recommendations | TEXT | |
| created_at | TIMESTAMP | NOT NULL |

## shortlists

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| org_id | UUID | FOREIGN KEY (profiles.id), NOT NULL |
| player_id | UUID | FOREIGN KEY (profiles.id), NOT NULL |
| notes | TEXT | |
| created_at | TIMESTAMP | NOT NULL |
| UNIQUE(org_id, player_id) | | |
