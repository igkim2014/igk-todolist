# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**igk-TodoList** is an authentication-based personal todo list application that integrates user-specific todo management with shared national holiday calendars. This is a learning/portfolio project designed to demonstrate full-stack development capabilities using modern web technologies.

## Important Project Guidelines

⚠️ **Critical**: Always follow the domain definition and architectural principles in `docs/0-domain-definition-request.md` when implementing features. This document serves as the primary guidance for all development work.

Key reference documents (in priority order):
1. `docs/0-domain-definition-request.md` - Primary guidance and requirements
2. `docs/1-domain-definition.md` - Domain model and business rules
3. `docs/3-prd.md` - Product requirements and technical specifications
4. `docs/4-user-scenarios.md` - User journey and use cases
5. `docs/5-project-structure.md` - Architectural principles and coding standards

## Technology Stack

### Frontend
- **Framework**: React 18 (function components with hooks)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Build Tool**: Vite
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken) with access + refresh tokens
- **Password Security**: bcrypt
- **Validation**: express-validator
- **ORM**: Prisma
- **Database**: PostgreSQL 15+ (hosted on Supabase)

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase PostgreSQL

## Core Architecture Patterns

### Layered Architecture (Backend)

Follow strict separation of concerns:
```
Routes → Controllers → Services → Repositories → Database
```

- **Routes**: Define API endpoints and attach middlewares
- **Controllers**: Handle HTTP request/response, minimal logic
- **Services**: Business logic and validation rules
- **Repositories**: Database access layer (Prisma queries)

**Critical Rules**:
- Dependencies flow downward only (never reverse)
- No circular dependencies
- Each layer has single responsibility
- Repository layer only accessed by Service layer

### Frontend Architecture

```
Pages → Components → Hooks/Stores → Services → API
```

- **Pages**: Route-level components
- **Components**: Reusable UI components (presentation only)
- **Hooks**: Custom React hooks for logic reuse
- **Stores**: Zustand stores for global state
- **Services**: API communication layer

## Project Structure

### When Frontend/Backend Folders Don't Exist Yet

If starting from scratch, create this structure:

```
igk-todolist/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── common/   # Buttons, Inputs, Modals
│   │   │   ├── todo/     # Todo-specific components
│   │   │   └── layout/   # Header, Sidebar, Layouts
│   │   ├── pages/        # Route-level pages
│   │   ├── stores/       # Zustand stores
│   │   ├── services/     # API services (axios)
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   ├── constants/    # Constants (API endpoints, status)
│   │   └── App.jsx
│   ├── .env
│   ├── .env.example
│   └── package.json
├── backend/               # Express application
│   ├── src/
│   │   ├── controllers/  # Request/response handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Database access
│   │   ├── middlewares/  # Auth, validation, error handling
│   │   ├── routes/       # API route definitions
│   │   ├── utils/        # Helper functions
│   │   ├── config/       # Configuration files
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── .env
│   ├── .env.example
│   └── package.json
├── docs/                  # Project documentation
└── README.md
```

## Key Business Rules (from Domain Definition)

### Authentication & Authorization
- **[BR-01]**: All features except login/register require authentication
- **[BR-02]**: Users can only access their own todos
- **[BR-03]**: All authenticated users can view holidays
- **[BR-04]**: Only admins (role='admin') can add/modify holidays

### Todo Management
- **[BR-05]**: Deletes are soft deletes (move to trash)
- **[BR-06]**: Trash items can be restored
- **[BR-07]**: Permanent deletion removes from database
- **[BR-08]**: Completion sets `isCompleted=true` and `status='completed'`
- **[BR-12]**: `dueDate >= startDate` validation required
- **[BR-13]**: Overdue todos need visual distinction in UI

### Holidays
- **[BR-09]**: Only admins can add/modify holidays
- **[BR-10]**: Holidays cannot be deleted
- **[BR-11]**: Support recurring yearly holidays

## Common Development Tasks

### Backend Development

#### Setting up the backend
```bash
cd backend
npm install
# Configure .env with DATABASE_URL, JWT_SECRET, etc.
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### Creating a new API endpoint
1. Define route in `routes/{entity}Routes.js`
2. Create controller in `controllers/{entity}Controller.js`
3. Implement business logic in `services/{entity}Service.js`
4. Add database queries in `repositories/{entity}Repository.js`
5. Add validation middleware if needed

#### Database changes
```bash
# Modify prisma/schema.prisma
npx prisma migrate dev --name describe_change
npx prisma generate
```

### Frontend Development

#### Setting up the frontend
```bash
cd frontend
npm install
# Configure .env with REACT_APP_API_BASE_URL
npm run dev
```

#### Creating a new feature
1. Define API service in `services/{entity}Service.js`
2. Create Zustand store if needed in `stores/{entity}Store.js`
3. Create custom hook if complex logic in `hooks/use{Entity}.js`
4. Build UI components in `components/{entity}/`
5. Create page component in `pages/`

### Running tests
```bash
# Backend
cd backend
npm test                    # Run all tests
npm test -- --coverage     # With coverage

# Frontend
cd frontend
npm test
```

## Coding Standards

### Naming Conventions

**Files**:
- Components: `PascalCase.jsx` (TodoCard.jsx, LoginPage.jsx)
- Services: `camelCase.js` (todoService.js, authService.js)
- Stores: `camelCase.js` (todoStore.js, authStore.js)
- Constants: `UPPER_SNAKE_CASE.js` (API_ENDPOINTS.js)

**Variables/Functions**:
- Variables: `camelCase` (userName, todoList)
- Functions: `camelCase` with verb prefix (getTodos, createTodo, deleteTodo)
- Constants: `UPPER_SNAKE_CASE` (MAX_TODO_LENGTH, API_BASE_URL)
- Booleans: `is/has/can` prefix (isCompleted, hasPermission, canEdit)

**React Components**:
- Always use function components (not classes)
- Use destructured props
- Export as default from component files

### Key Principles

1. **Single Responsibility**: Each file/function has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Extract repeated logic into utilities/hooks
3. **KISS (Keep It Simple)**: Avoid over-engineering, focus on MVP requirements
4. **YAGNI (You Aren't Gonna Need It)**: Don't implement features not in PRD

### Security Rules

**Critical - Never commit**:
- `.env` files (use `.env.example` instead)
- JWT secrets
- Database credentials
- API keys

**Always validate**:
- User input on both frontend and backend
- `dueDate >= startDate` constraint
- User ownership of todos before modifications
- JWT token validity and expiration

**Required security measures**:
- bcrypt for password hashing (salt rounds: 10)
- JWT with Access Token (15min) + Refresh Token (7 days)
- CORS configuration for allowed origins only
- Rate limiting on authentication endpoints
- Prepared statements via Prisma (prevents SQL injection)

## Data Model Quick Reference

### User
```prisma
model User {
  userId    String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  username  String
  role      Role     @default(USER)  // USER | ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}
```

### Todo
```prisma
model Todo {
  todoId      String     @id @default(uuid())
  userId      String
  user        User       @relation(fields: [userId], references: [userId], onDelete: Cascade)
  title       String     // Required
  content     String?
  startDate   DateTime?
  dueDate     DateTime?
  status      TodoStatus @default(ACTIVE)  // ACTIVE | COMPLETED | DELETED
  isCompleted Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?  // For soft delete
}
```

### Holiday
```prisma
model Holiday {
  holidayId   String   @id @default(uuid())
  title       String
  date        DateTime
  description String?
  isRecurring Boolean  @default(true)  // Repeats yearly
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Patterns

### Standard Response Format
```javascript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Authentication
All protected routes require:
```
Authorization: Bearer {accessToken}
```

### Common Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns tokens)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/todos` - Get user's todos (query: status, search, sortBy)
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/complete` - Mark complete
- `DELETE /api/todos/:id` - Soft delete (to trash)
- `GET /api/trash` - Get deleted todos
- `DELETE /api/trash/:id` - Permanent delete
- `PATCH /api/todos/:id/restore` - Restore from trash
- `GET /api/holidays` - Get holidays (query: year, month)

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=                    # Generate with crypto.randomBytes(64).toString('hex')
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```bash
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_ENV=development
```

## MVP Scope & Priority

**P0 (Must Have - MVP)**:
- User authentication (register, login, logout, token refresh)
- Todo CRUD operations
- Todo completion toggle
- Soft delete (trash) and restore
- Holiday viewing
- Basic responsive UI

**P1 (Should Have - Post-MVP)**:
- Todo search and filtering
- Profile management
- Admin holiday management
- Dark mode
- Advanced sorting

**P2 (Nice to Have - Future)**:
- Todo categories/tags
- Notifications
- Collaboration features
- Calendar view
- Analytics/statistics

## Testing Guidelines

### Test Coverage Priorities
1. **P0**: Business logic in services (70%+ coverage)
2. **P1**: API endpoints - controllers (key CRUD operations)
3. **P2**: Utility functions (80%+ coverage)
4. **P3**: React components (optional for MVP)

### Test Structure (Jest)
```javascript
describe('ServiceOrComponent', () => {
  describe('functionName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Common Gotchas

1. **Token Management**: Use axios interceptors to auto-refresh expired tokens
2. **CORS**: Ensure backend allows frontend origin
3. **Soft Delete**: Filter out `status='deleted'` in default queries
4. **Date Validation**: Always validate `dueDate >= startDate` on both frontend and backend
5. **Authorization**: Verify user ownership before any todo modification
6. **Prisma Client**: Initialize once and reuse (don't create new instances per request)

## Development Workflow

1. **Before starting**: Read relevant docs (domain definition, PRD, user scenarios)
2. **Plan first**: Understand requirements before coding
3. **Follow architecture**: Respect layer boundaries
4. **Test as you go**: Write tests for business logic
5. **Security first**: Validate all inputs, protect all routes
6. **Keep it simple**: Focus on MVP scope, avoid over-engineering

## Resources

- Domain Definition: `docs/1-domain-definition.md`
- Full PRD: `docs/3-prd.md`
- User Scenarios: `docs/4-user-scenarios.md`
- Architecture Principles: `docs/5-project-structure.md`
- React 18: https://react.dev/
- Zustand: https://zustand-demo.pmnd.rs/
- Prisma: https://www.prisma.io/
- Express: https://expressjs.com/
- Tailwind: https://tailwindcss.com/
