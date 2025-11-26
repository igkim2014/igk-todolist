# IGK-TodoList Integration Test Scenarios

**Version**: 1.0
**Date**: 2025-11-26
**Status**: Draft
**Reference**: [User Scenarios](./4-user-scenarios.md), [Wireframes](./8-wireframes.md)

---

This document provides manual test scenarios to verify the core functionality of the IGK-TodoList application.

## 1. Test Environment Setup

Before starting the tests, ensure both the backend and frontend servers are running.

### Backend
1. Open a terminal.
2. Navigate to the backend directory: `cd backend`
3. Start the server: `npm run dev` (or `node src/server.js`)
4. Verify it's running at `http://localhost:3000`.

### Frontend
1. Open a new terminal.
2. Navigate to the frontend directory: `cd frontend`
3. Start the development server: `npm run dev`
4. Verify it's accessible at `http://localhost:5173`.

---

## 2. Test Scenario 1: Authentication (Sign Up & Login)

**Objective**: Verify a new user can register and log in.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Open browser to `http://localhost:5173`. | Redirected to `/login` page. Login form displayed. | |
| 2 | Click "Register" link. | Redirected to `/register` page. Registration form displayed. | |
| 3 | Enter valid details:<br>- Username: `TestUser`<br>- Email: `test@example.com`<br>- Password: `password123` | Form fields accept input. | |
| 4 | Click "Register" button. | Alert "Registration successful!". Redirected to `/login`. | |
| 5 | Enter invalid credentials:<br>- Email: `test@example.com`<br>- Password: `wrongpass` | Error message "Invalid email or password". | |
| 6 | Enter valid credentials:<br>- Email: `test@example.com`<br>- Password: `password123` | Redirected to `/` (Home). Header shows "Hello, TestUser". | |

---

## 3. Test Scenario 2: Todo Management (CRUD)

**Objective**: Verify full lifecycle of a Todo item.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Click "+ Add New Todo" button (or similar). | "Add New Todo" modal opens. | |
| 2 | Fill form:<br>- Title: `Test Task`<br>- Content: `Testing...`<br>- Due Date: (Select tomorrow) | Form validates input. | |
| 3 | Click "Add Todo" (or "Save"). | Modal closes. New todo `Test Task` appears at the top of the list. | |
| 4 | Click "Edit" button on `Test Task`. | "Edit Todo" modal opens with pre-filled data. | |
| 5 | Change Title to `Updated Task` and save. | Modal closes. Todo card updates to `Updated Task`. | |
| 6 | Click checkbox on `Updated Task`. | Todo style changes (strikethrough/green). Status becomes 'Completed'. | |
| 7 | Click "Delete" button on `Updated Task`. | Todo is removed from the main list. | |

---

## 4. Test Scenario 3: Trash & Restoration

**Objective**: Verify soft delete and restore functionality.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to "Trash" via Sidebar. | `Updated Task` (from Scenario 2) is visible in the Trash list. | |
| 2 | Click "Restore" button on `Updated Task`. | Confirm dialog (if any). Todo disappears from Trash. | |
| 3 | Navigate back to "Todos" (Home). | `Updated Task` reappears in the main list. | |
| 4 | Click "Delete" on `Updated Task` again. | Todo removed from Home. | |
| 5 | Go to "Trash". Click "Permanently Delete". | Confirm dialog appears. Click OK. Todo disappears. | |
| 6 | Refresh "Trash" page. | Trash list is empty (or doesn't show that item). | |

---

## 5. Test Scenario 4: Holiday & Profile

**Objective**: Verify read-only holiday data and profile updates.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to "Holidays" via Sidebar. | List of holidays for current month/year is displayed. | |
| 2 | Change Year/Month dropdowns. | Holiday list updates accordingly. | |
| 3 | Navigate to "Profile" via Sidebar. | Profile page shows Username and read-only Email. | |
| 4 | Change Username to `NewName` and click "Update". | Success message. Header now shows "Hello, NewName". | |
| 5 | Click "Logout" in Header. | Redirected to `/login`. Access token removed from storage. | |

---

**End of Test Scenarios**
