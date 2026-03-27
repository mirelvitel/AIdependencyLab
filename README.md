# AIdependencyLab

A research platform built for a bachelor thesis that measures how AI assistance affects student programming performance. Students complete 8 Java coding exercises — 4 with an AI chat assistant and 4 without — while all interactions are recorded for analysis.

---

## How It Works

1. Student enters their year of study and coding experience
2. Platform presents 8 tasks, alternating between AI-enabled and non-AI tasks
3. Student writes Java code in a Monaco editor and runs it against test cases
4. On AI-enabled tasks, a GPT-4o chat panel is available for assistance
5. After all tasks, a short Likert survey is presented
6. All code runs, chat interactions, and timing data are stored for research analysis

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Monaco Editor, Axios, Tailwind CSS    |
| Backend   | Java 17, Spring Boot 3.4, Spring Data JPA       |
| Database  | PostgreSQL 14                                   |
| AI Chat   | OpenAI GPT-4o                                   |
| Code Exec | Judge0 CE (via RapidAPI)                        |
| Deploy    | Railway (backend + DB), Vercel (frontend)       |

---

## Project Structure

```
AIdependencyLab/
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── App.jsx            # Root component — session, tasks, timer
│   │   └── components/
│   │       ├── intro/         # Onboarding form
│   │       ├── editor/        # Monaco code editor + run button
│   │       ├── chat/          # AI chat panel
│   │       ├── test/          # Task description + test cases panel
│   │       └── survey/        # Post-test survey
│   └── vercel.json
│
├── backend/
│   └── src/main/java/org/example/backend/
│       ├── controller/        # REST endpoints
│       ├── service/           # OpenAI + Judge0 integrations
│       ├── entity/            # JPA entities
│       ├── persistence/       # Spring Data repositories
│       └── config/            # CORS, task seeding
│   └── railway.toml
│
└── docker-compose.yml         # Local dev: frontend + backend + postgres + pgadmin
```

---

## Running Locally

### Prerequisites
- Docker + Docker Compose
- API keys (see below)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/AIdependencyLab.git
cd AIdependencyLab

# 2. Create your env file
cp frontend/.env.example frontend/.env
# Fill in your API keys in frontend/.env

# 3. Start everything
docker-compose up
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8080        |
| pgAdmin  | http://localhost:5050        |

pgAdmin credentials: `admin@admin.com` / `admin`

---

## Environment Variables

Create `frontend/.env` (never commit this file):

```env
OPENAI_API_KEY=
JUDGE0_API_KEY=
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
```

Database variables are set automatically by Docker Compose. For production, set all of the above plus:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<db>
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Deployment

### Backend — Railway
1. Connect your GitHub repo in Railway
2. Set the service root to `/backend`
3. Add all environment variables in the Railway dashboard
4. Railway uses `backend/railway.toml` and `backend/Dockerfile` automatically

### Frontend — Vercel
1. Connect your GitHub repo in Vercel
2. Set the framework preset to **Create React App**
3. Set the root directory to `frontend`
4. Add `REACT_APP_API_URL=https://your-backend.railway.app` as an environment variable

---

## Database Schema

| Table          | Key Fields                                                             |
|----------------|------------------------------------------------------------------------|
| `users`        | `user_id`, `year_of_study`, `coding_experience`                       |
| `session`      | `session_id`, `user_id`, `started_at`, `ended_at`                     |
| `task`         | `task_id`, `title`, `description`, `test_cases`, `is_ai_enabled`      |
| `exercise`     | `exercise_id`, `session_id`, `task_id`, `completion_time`, `is_success` |
| `interaction`  | `interaction_id`, `exercise_id`, `action_type`, `details`             |
| `chat_message` | `message_id`, `session_id`, `role`, `content`, `created_at`           |
| `survey`       | `survey_id`, `session_id`, `q1`–`q5`                                  |

Schema is managed by Hibernate (`ddl-auto=update`) and tasks are seeded automatically on first startup.

---

## Tasks

| #  | Title                            | AI Enabled |
|----|----------------------------------|------------|
| 1  | Check Even/Odd                   | Yes        |
| 2  | Add Two Numbers                  | No         |
| 3  | Count Vowels in a String         | Yes        |
| 4  | Check Prime                      | No         |
| 5  | Check Palindrome                 | Yes        |
| 6  | Reverse a String                 | No         |
| 7  | Remove Duplicates from Sorted Array | Yes     |
| 8  | Find Minimum in an Array         | No         |
