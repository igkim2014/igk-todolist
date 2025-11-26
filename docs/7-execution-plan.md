# IGK-TodoList Execution Plan

This document outlines the detailed execution plan for the IGK-TodoList project, based on the PRD and Architecture documents.

**Date**: 2025-11-26
**Status**: Completed

---

## Phase 1: Project Initialization & Database Infrastructure
**Goal**: Set up the project structure, development environment, and database schema.

- [x] **1.1 Project Scaffolding** `(Project Manager)`
    - **Description**: Initialize git, create `backend` and `frontend` directories, set up `.gitignore`, and initialize `package.json` for both.
    - **Tech**: npm, git
    - **Completion Condition**: Clean directory structure matching `docs/5-project-structure.md`.
    - **Dependencies**: None

- [x] **1.2 Database Setup & Schema** `(Architect)`
    - **Description**: Initialize Prisma, define `User`, `Todo`, `Holiday` models in `schema.prisma` according to `docs/3-prd.md`. Run initial migration.
    - **Tech**: Prisma, PostgreSQL (Supabase)
    - **Completion Condition**: Database tables created, Prisma Client generated.
    - **Dependencies**: 1.1

---

## Phase 2: Backend Development
**Goal**: Implement the RESTful API with authentication and business logic.

- [x] **2.1 Backend Configuration & Common Utils** `(Backend Dev)`
    - **Description**: Setup Express server, cors, helmet, body-parser. Implement `logger`, `AppError` class, and `asyncHandler`.
    - **Tech**: Express, Winston
    - **Completion Condition**: Server starts on port 3000, global error handling works.
    - **Dependencies**: 1.1

- [x] **2.2 Authentication Module** `(Backend Dev)`
    - **Description**: Implement `User` model repository, `AuthService` (login, register, refresh), `AuthController`, and `AuthMiddleware` (JWT verification).
    - **Tech**: JWT, bcrypt, express-validator
    - **Completion Condition**: Can register and login via Postman, receiving valid JWTs.
    - **Dependencies**: 1.2, 2.1

- [x] **2.3 Todo Management Module** `(Backend Dev)`
    - **Description**: Implement `Todo` repository, `TodoService` (CRUD), `TodoController`. Include logic for soft delete and restore.
    - **Tech**: Prisma Client
    - **Completion Condition**: Full CRUD operations for Todos working for authenticated users.
    - **Dependencies**: 2.2

- [x] **2.4 Holiday & Trash Modules** `(Backend Dev)`
    - **Description**: Implement `Holiday` read-only APIs (and admin write APIs), and `Trash` management APIs (list deleted, permanent delete).
    - **Tech**: Prisma Client
    - **Completion Condition**: Can fetch holidays and manage trash items.
    - **Dependencies**: 2.3

---

## Phase 3: Frontend Development
**Goal**: Build the React UI and integrate with Backend API.

- [x] **3.1 Frontend Setup & Infrastructure** `(Frontend Dev)`
    - **Description**: Initialize Vite + React project. Install Tailwind CSS, Axios, Zustand, React Router. Setup `api.js` with interceptors.
    - **Tech**: Vite, React, Tailwind
    - **Completion Condition**: "Hello World" runs with Tailwind styles, Axios instance configured.
    - **Dependencies**: 2.1

- [x] **3.2 State Management & Services** `(Frontend Dev)`
    - **Description**: Create `authStore`, `todoStore` using Zustand. Implement `authService`, `todoService` modules calling the API.
    - **Tech**: Zustand, Axios
    - **Completion Condition**: Stores track state correctly, Services handle API errors.
    - **Dependencies**: 3.1

- [x] **3.3 Authentication UI** `(Frontend Dev)`
    - **Description**: Create `LoginPage`, `RegisterPage`. Implement form validation and connection to `authStore`.
    - **Tech**: React Hook Form, Zod (optional)
    - **Completion Condition**: User can sign up and log in from the UI.
    - **Dependencies**: 3.2

- [x] **3.4 Main Todo Feature UI** `(Frontend Dev)`
    - **Description**: Implement `TodoListPage`, `TodoCard`, `TodoForm` (Modal). Handle create, update, delete, complete actions.
    - **Tech**: React Components
    - **Completion Condition**: User can manage their todos visually.
    - **Dependencies**: 3.3

- [x] **3.5 Trash & Holiday UI** `(Frontend Dev)`
    - **Description**: Implement `TrashPage` and `Holiday` display section. Add Dark Mode support.
    - **Tech**: React Components
    - **Completion Condition**: Can restore items from trash, view holidays.
    - **Dependencies**: 3.4

---

## Phase 4: Integration & Finalization
**Goal**: Ensure quality and prepare for release.

- [x] **4.1 Integration Testing** `(Tester)`
    - **Description**: Test complete user flows (Sign up -> Create Todo -> Delete -> Restore). Fix bugs.
    - **Tech**: Manual Testing / Cypress (optional)
    - **Completion Condition**: All P0 requirements from PRD pass.
    - **Dependencies**: 3.5

- [x] **4.2 Final Polish & Build** `(DevOps)`
    - **Description**: Optimize build, clean up logs, ensure README is up to date.
    - **Tech**: Vite build
    - **Completion Condition**: Production build passes and runs locally.
    - **Dependencies**: 4.1
