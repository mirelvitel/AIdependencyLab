# AIdependencyLab — CLAUDE.md

## Project Overview

A research platform (bachelor thesis) that measures how AI assistance affects student programming performance. Students complete 8 Java coding exercises — 4 with an AI chat assistant and 4 without — while all interactions are logged for research analysis.

**User flow:**
1. Intro screen: student enters year of study + coding experience
2. Backend creates a `Session` + `User` record
3. Frontend fetches 8 tasks and interleaves AI-enabled/disabled ones
4. Student writes Java code in Monaco Editor, runs it against test cases
5. For AI-enabled tasks, student can use the embedded ChatGPT panel
6. After all tasks, a 5-question Likert survey is presented
7. Session ends, data is ready for research analysis

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Monaco Editor, Axios, Tailwind CSS |
| Backend    | Java 17, Spring Boot 3.4.0, Spring Data JPA |
| Database   | PostgreSQL 14                           |
| Build tool | Maven (backend), npm / react-scripts (frontend) |
| Container  | Docker + Docker Compose (dev setup)     |

---

## Project Structure

```
AIdependencyLab/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── App.jsx              # Root: session, task ordering, timer, panel toggle
│   │   ├── components/
│   │   │   ├── intro/IntroScreen.jsx     # Onboarding form
│   │   │   ├── editor/CodeEditor.jsx     # Monaco editor + run/test button
│   │   │   ├── editor/LanguageSelector.jsx
│   │   │   ├── chat/ChatPanel.jsx        # AI chat (action type selector + messages)
│   │   │   ├── chat/ChatMessage.jsx
│   │   │   ├── chat/FormattedMessage.jsx
│   │   │   ├── test/TestTasksPanel.jsx   # Task description + test case viewer
│   │   │   ├── test/TaskView.jsx
│   │   │   ├── test/TestSession.jsx
│   │   │   ├── survey/SurveyForm.jsx     # Post-test 5-question survey
│   │   │   └── skeletons.js             # Java code stubs per task (student starting point)
│   ├── package.json             # proxy: http://backend:8080 (Docker dev)
│   ├── Dockerfile               # Dev mode only (npm start)
│   └── .env                     # !! API keys — DO NOT COMMIT (see Security section)
│
├── backend/
│   └── src/main/java/org/example/backend/
│       ├── BackendApplication.java
│       ├── controller/
│       │   ├── ChatController.java          # POST /api/chat
│       │   ├── CodeRunnerController.java    # POST /api/run, /api/exercise/start, /api/exercise/complete
│       │   ├── TaskController.java          # GET /api/tasks
│       │   ├── SessionController.java       # POST /api/start-session, /api/end-session
│       │   ├── SurveyController.java        # POST /api/save-survey
│       │   └── InteractionController.java   # POST /api/log-interaction
│       ├── service/
│       │   ├── ChatService.java         # OpenAI GPT-4o integration
│       │   ├── CodeRunnerService.java   # JDoodle (syntax) + Judge0 (test execution)
│       │   └── SessionService.java      # Session CRUD + stale session cleanup
│       ├── entity/                      # JPA entities: User, Session, Task, Exercise, Interaction, ChatMessage, Survey
│       ├── persistence/                 # Spring Data JPA repositories
│       └── config/
│           ├── TaskDataInitializer.java # Seeds 8 tasks on first startup
│           └── WebSecurityConfig.java
│   └── src/main/resources/application.properties
│
└── docker-compose.yml           # 4 services: frontend, backend, db (postgres:14), pgadmin
```

---

## The 3 External APIs

### 1. OpenAI (GPT-4o)
- **Purpose:** AI chat assistant for AI-enabled tasks
- **Integration:** `backend/src/main/java/org/example/backend/service/ChatService.java`
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Required env var:** `OPENAI_API_KEY`

### 2. JDoodle
- **Purpose:** First-pass syntax/compilation check before running test cases
- **Integration:** `CodeRunnerService.java` (lines 44–67)
- **Endpoint:** `https://api.jdoodle.com/v1/execute`
- **Required env vars:** `JDOODLE_CLIENT_ID`, `JDOODLE_CLIENT_SECRET`

### 3. Judge0 CE (via RapidAPI)
- **Purpose:** Execute student code against test cases (stdin/stdout comparison)
- **Integration:** `CodeRunnerService.java` (lines 81–134)
- **Base URL:** `https://judge0-ce.p.rapidapi.com`
- **Required env vars:** `JUDGE0_API_KEY`, `JUDGE0_API_URL`

---

## Environment Variables

All API keys live in environment variables. The backend reads them via Spring's `${VAR_NAME}` syntax in `application.properties`.

**For local development (Docker Compose):** copy `.env.example` → `.env` in the `frontend/` directory and fill in your keys. Docker Compose passes this file to the backend via `env_file`.

**For production (Railway / Vercel):** set these in the platform's environment variable dashboard — never commit real keys.

```
OPENAI_API_KEY=
JDOODLE_CLIENT_ID=
JDOODLE_CLIENT_SECRET=
JUDGE0_API_KEY=
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
```

Database (set automatically by Railway or Docker Compose):
```
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<db>
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
```

---

## Running Locally (Docker Compose)

```bash
# 1. Copy env example and fill in API keys
cp frontend/.env.example frontend/.env

# 2. Start all services
docker-compose up

# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
# pgAdmin:  http://localhost:5050  (admin@admin.com / admin)
```

The `package.json` proxy (`"proxy": "http://backend:8080"`) routes `/api/*` calls to the backend inside Docker. This only works when running inside Docker Compose — for standalone local dev outside Docker, change proxy to `http://localhost:8080`.

---

## Known Bugs & Issues (to fix)

### Bugs
1. **Duplicate `setCompleted(true)` call** — `CodeRunnerController.java:131` calls `exercise.setCompleted(true)` twice (lines 129 and 131). Redundant, remove line 131.
2. **Inconsistent task field access in App.jsx:58** — `task.id || task.taskId` suggests the backend sometimes returns `id` and sometimes `taskId`. Should be consistent.
3. **Timer useEffect missing `handleTestSubmitAndRedirect` dependency** — `App.jsx:52` has `[timeLeft, hasStarted, testSubmitted]` but calls `handleTestSubmitAndRedirect` (defined in component scope). Should use `useCallback` or restructure to avoid stale closure.

### Code Quality Issues
4. **CORS hardcoded to `http://localhost:3000`** in every controller — blocks production. Needs to read from an env var.
5. **Dev-mode Dockerfiles** — both Dockerfiles run in development mode (`npm start`, `mvn spring-boot:run`). Need production builds for deployment.
6. **`RestTemplate` instantiated inside method** in `ChatService.java:59` — should be a bean or field.
7. **No error boundary** in the React app — any uncaught render error crashes the entire app with a blank screen.

### Security
8. **`frontend/.env` committed to git with real API keys** — keys must be rotated after fixing. Add `.env` to `.gitignore` (it may already be listed but the file was tracked). Create `frontend/.env.example` with empty values.

---

## Deployment Plan

### Target Architecture
- **Backend + PostgreSQL:** Railway (supports Java + managed Postgres)
- **Frontend:** Vercel (static build) or Railway (serve built React via nginx)

### What needs to change for production
1. Backend CORS must allow the production frontend URL (env var `FRONTEND_URL`)
2. Frontend `package.json` proxy won't work in production; Axios `baseURL` must be set via `REACT_APP_API_URL` env var
3. Backend Dockerfile must build a JAR and run it (not `mvn spring-boot:run`)
4. Frontend Dockerfile must build static files and serve via nginx (not `npm start`)
5. `SPRING_DATASOURCE_URL` must point to Railway's managed Postgres

---

## Database Schema (JPA / Hibernate auto-DDL)

| Table          | Key Fields |
|----------------|-----------|
| `users`        | `user_id`, `year_of_study`, `coding_experience` |
| `session`      | `session_id`, `user` (FK), `started_at`, `ended_at` |
| `task`         | `task_id`, `title`, `description`, `test_cases`, `complexity`, `is_ai_enabled` |
| `exercise`     | `exercise_id`, `session` (FK), `task` (FK), `started_at`, `completion_time`, `is_completed`, `is_success`, `is_ai_enabled`, `complexity` |
| `interaction`  | `interaction_id`, `exercise` (FK), `action_type`, `details`, `passed_count`, `total_count` |
| `chat_message` | `message_id`, `session` (FK), `role`, `content`, `created_at` |
| `survey`       | `survey_id`, `session_id`, `q1`–`q5` (int responses) |

Task test cases are stored as a pipe-delimited string: `Input: X → Y|Input: A → B`

---

## Task Seeding

`TaskDataInitializer.java` runs on startup and seeds 8 tasks only if the table is empty:
- 4 AI-enabled tasks: Even/Odd, Count Vowels, Palindrome, Remove Duplicates
- 4 non-AI tasks: Add Two Numbers, Check Prime, Reverse String, Find Minimum

Student code stubs (skeletons) are defined in `frontend/src/components/skeletons.js` and mapped to task titles via `TASK_FN_MAP`.