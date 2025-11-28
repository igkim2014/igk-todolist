# igk-TodoList End-to-End Tests

This directory contains Playwright end-to-end tests for the igk-TodoList application, based on the user scenarios documented in `docs/4-user-scenarios.md`.

## Test Coverage

The tests cover the following user scenarios from the documentation:

### Core Functionality
- User registration and login
- Todo creation, completion, and management
- Navigation between different sections
- Filtering and search functionality
- Todo deletion and restoration

### User Personas Tested
- Kim Chulsoo (working professional scenarios)
- Karina (student scenarios)

### Cross-Platform Testing
- Desktop browser functionality
- Responsive design elements

## Test Structure

- `igk-todolist-integration.spec.js`: Main integration tests covering user workflows

## Running Tests

To run the tests, make sure both frontend and backend servers are running, then execute:

```bash
cd frontend
npx playwright test
```

To run tests with UI mode:
```bash
npx playwright test --ui
```

To run a specific test file:
```bash
npx playwright test test/e2e/igk-todolist-integration.spec.js
```

## Test Environment

The tests expect:
- Frontend server running on http://localhost:5173
- Backend API accessible to the frontend
- A clean test database (tests may create and delete test data)

## Reporting

Test reports are generated in HTML format and can be viewed with:
```bash
npx playwright show-report
```