# Task Management System

A Task Management System built with **Angular** (frontend) and a **Node.js + MongoDB** backend.

> Note: The backend code is not present in this repository snapshot, so backend setup details are provided as generic guidance. The frontend expects specific REST endpoints (listed below).

---

## Live Backend (base URLs used by the frontend)

The Angular services call these deployed endpoints:

- **Auth**: `https://taskmanagement-backend-xjzw.onrender.com/auth`
  - `POST /register`
  - `POST /login`
  - `GET /me`

- **Tasks**: `https://taskmanagement-backend-xjzw.onrender.com/tasks`
  - `POST /tasks` (create)
  - `GET /tasks` (list)
  - `GET /tasks/:id` (get by id)
  - `PUT /tasks/:id` (update)
  - `DELETE /tasks/:id` (delete)
  - `PATCH /tasks/:id/status` (update status)

- **Users (admin)**: `https://taskmanagement-backend-xjzw.onrender.com/users`
  - `GET /users` (list users)
  - `GET /users/:userId/tasks` (load tasks by user)
  - `PATCH /users/:id/status` (status update by user id if supported by backend)
  - `DELETE /users/:userId` (delete user if supported by backend)

---

## Roles & Access Control

### Authentication

- Login/signup are handled in the Angular UI.
- After login, the frontend stores:
  - `token` in **localStorage**
  - `user` in **localStorage**

### Authorization

- `authGuard` allows access only if `localStorage.getItem('token')` exists.
- `authInterceptor` automatically attaches:
  - `Authorization: Bearer <token>`

### Role-based routing

- On successful login:
  - if `res.user.role === "admin"` → navigates to **/adminpanel**
  - otherwise → navigates to **/taskview**

---

## Frontend Architecture (Angular)

### Key files/folders

- **Routing**: `src/app/app.routes.ts`
  - `/login` and `/signup` under `AuthLayoutComponent`
  - `/taskview` and `/adminpanel` under `MainLayoutComponent` (protected by `authGuard`)
  - `**` → `AccessDeniedPageComponent`

- **Guards & Interceptors**
  - `src/app/core/guards/auth.guard.ts`
  - `src/app/core/interceptors/auth.interceptor.ts`

- **Services**
  - `src/app/core/services/auth.service.ts`
  - `src/app/core/services/task.service.ts`
  - `src/app/core/services/usertask.service.ts`

- **Models**
  - `src/app/core/models/taskmodel.ts`
    - `TaskStatus = 'Todo' | 'In Progress' | 'Completed'`
    - `TaskPriority = 'Low' | 'Medium' | 'High'`

- **UI Features**
  - Login: `src/app/features/login/loginform/loginform.component.ts`
  - Signup: `src/app/features/login/signup/signup.component.ts`
  - Task List/CRUD: `src/app/features/home/taskview/taskview.component.ts`
  - Admin Panel: `src/app/features/home/admin-panel/admin-panel.component.ts`

---

## User Features (What the app does)

### User (Taskview)

- Fetch and display all tasks.
- Create task, edit task, delete task.
- Update task status via `PATCH /tasks/:id/status`.
- Filter tasks by:
  - search text (title/description)
  - status
  - priority
- Theme toggle (sets `data-theme` attribute on `<html>`).

### Admin (Admin Panel)

- Load users from the backend and filters to `role === 'user'`.
- Select a user to load that user’s tasks.
- Theme toggle support.

---

## Backend Contract (Expected Response Shape)

The frontend code expects responses like:

- Login: `{ token: string, user: { role: string, name?: string, ... } }`
- Signup: typically `{ message: string, ... }`
- Tasks/Users endpoints commonly accessed as:
  - `res.data` for arrays/objects
  - `res.message` for success messages

When implementing the backend, ensure your controller responses include these fields (`data`, `message`, etc.) as used by the Angular components/services.

---

## Local Setup (Frontend)

### 1) Install dependencies

```bash
npm install
```

### 2) Run Angular

```bash
npm start
```

### 3) Configure backend base URLs (if running locally)

The frontend services currently use the deployed Render URLs.
If you run your backend locally, update these in:

- `src/app/core/services/auth.service.ts`
- `src/app/core/services/task.service.ts`
- `src/app/core/services/usertask.service.ts`

---

## Backend Setup (Generic Node.js + MongoDB Guidance)

Because backend code is not present in this repo snapshot, follow this checklist:

1. Create an Express server.
2. Connect to MongoDB using Mongoose.
3. Implement JWT authentication:
   - `POST /auth/register`
   - `POST /auth/login`
   - `GET /auth/me`
4. Implement role-based access (admin vs user) for user/task admin operations.
5. Implement task routes:
   - CRUD under `/tasks`
   - status update under `/tasks/:id/status`
6. Implement user routes for admin:
   - list users under `/users`
   - fetch user tasks under `/users/:userId/tasks`
7. Enable CORS and ensure protected routes validate the `Authorization: Bearer <token>` header.

---

## Testing

Frontend scripts:

- `npm test`
- `npm run build`

---

## Notes / Known Improvements

- Backend URL strings are hardcoded in Angular services; consider moving them to environment files (e.g., `environment.ts`).
- Token and user are stored in localStorage; consider refresh token strategy and/or more secure storage depending on requirements.
