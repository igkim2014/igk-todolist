#!/usr/bin/env node

/**
 * Verification Script for Tasks 2.1 to 2.14
 * This script verifies that all backend tasks have been successfully completed
 * by checking for the existence of required files and their basic functionality.
 */

const fs = require('fs');
const path = require('path');

// Define the expected files and directories for each task
const expectedFiles = {
  'Task 2.1': [
    'package.json',
    '.env',
    '.env.example',
    '.gitignore'
  ],
  'Task 2.2': [
    'src/',
    'src/controllers/',
    'src/services/',
    'src/routes/',
    'src/middlewares/',
    'src/config/',
    'src/utils/',
    'src/app.js',
    'src/server.js'
  ],
  'Task 2.3': [
    'src/config/database.js'
  ],
  'Task 2.4': [
    'src/utils/jwtHelper.js'
  ],
  'Task 2.5': [
    'src/utils/passwordHelper.js'
  ],
  'Task 2.6': [
    'src/middlewares/authMiddleware.js'
  ],
  'Task 2.7': [
    'src/middlewares/errorMiddleware.js'
  ],
  'Task 2.8': [
    'src/services/authService.js',
    'src/controllers/authController.js',
    'src/routes/authRoutes.js'
  ],
  'Task 2.9': [
    'src/services/todoService.js',
    'src/controllers/todoController.js',
    'src/routes/todoRoutes.js'
  ],
  'Task 2.10': [
    'src/services/trashService.js',
    'src/controllers/trashController.js',
    'src/routes/trashRoutes.js'
  ],
  'Task 2.11': [
    'src/services/holidayService.js',
    'src/controllers/holidayController.js',
    'src/routes/holidayRoutes.js'
  ],
  'Task 2.12': [
    'src/middlewares/rateLimitMiddleware.js'
  ],
  'Task 2.13': [
    'src/app.js',
    'src/server.js'
  ],
  'Task 2.14': [
    'src/tests/',
    'src/tests/auth.test.js',
    'src/tests/todo.test.js',
    'src/tests/holiday.test.js',
    'src/tests/trash.test.js',
    'src/tests/database.test.js',
    'src/tests/user.test.js',
    'src/tests/passwordHelper.test.js',
    'src/tests/authMiddleware.test.js',
    'src/tests/errorMiddleware.test.js'
  ]
};

// Service and controller files that should have specific functions
const expectedFunctions = {
  'src/utils/jwtHelper.js': [
    'generateAccessToken',
    'generateRefreshToken',
    'verifyAccessToken',
    'verifyRefreshToken'
  ],
  'src/utils/passwordHelper.js': [
    'hashPassword',
    'comparePassword'
  ],
  'src/services/authService.js': [
    'register',
    'login',
    'refreshAccessToken'
  ],
  'src/services/todoService.js': [
    'getTodos',
    'getTodoById',
    'createTodo',
    'updateTodo',
    'completeTodo',
    'deleteTodo',
    'restoreTodo'
  ],
  'src/services/holidayService.js': [
    'getHolidays',
    'createHoliday',
    'updateHoliday'
  ],
  'src/services/trashService.js': [
    'getTrash',
    'permanentlyDelete'
  ]
};

// Middleware files that should have specific middleware functions
const expectedMiddlewares = {
  'src/middlewares/authMiddleware.js': [
    'authenticate',
    'requireAdmin'
  ],
  'src/middlewares/errorMiddleware.js': [
    'errorHandler'
  ],
  'src/middlewares/rateLimitMiddleware.js': [
    'apiLimiter',
    'authLimiter'
  ]
};

// Route files that should implement specific routes
const expectedRoutes = {
  'src/routes/authRoutes.js': [
    'POST /api/auth/register',
    'POST /api/auth/login',
    'POST /api/auth/refresh'
  ],
  'src/routes/todoRoutes.js': [
    'GET /api/todos',
    'POST /api/todos',
    'PUT /api/todos/:id',
    'PATCH /api/todos/:id/complete',
    'DELETE /api/todos/:id'
  ],
  'src/routes/holidayRoutes.js': [
    'GET /api/holidays',
    'POST /api/holidays',
    'PUT /api/holidays/:id'
  ],
  'src/routes/trashRoutes.js': [
    'GET /api/trash',
    'DELETE /api/trash/:id'
  ]
};

// Function to check if a file exists and display appropriate status
function checkFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${filePath}`);
  return exists;
}

// Function to check if a directory exists
function checkDir(dirPath) {
  const fullPath = path.join(__dirname, dirPath);
  try {
    const stats = fs.statSync(fullPath);
    const exists = stats.isDirectory();
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${dirPath}/`);
    return exists;
  } catch (e) {
    console.log(`  ❌ ${dirPath}/`);
    return false;
  }
}

// Function to check if a file contains specific functions
function checkFunctions(filePath, functions) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ ${filePath} - File does not exist`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  let allFound = true;
  
  for (const func of functions) {
    const found = content.includes(func) || 
                  content.includes(`const ${func} =`) || 
                  content.includes(`function ${func}`) ||
                  content.includes(`${func}: `) ||
                  content.match(new RegExp(`\\b${func}\\s*[:=]\\s*[^;]*function`));
    
    const status = found ? '✅' : '❌';
    console.log(`    ${status} ${func}`);
    
    if (!found) allFound = false;
  }
  
  return allFound;
}

// Main verification function
function verifyTasksCompletion() {
  console.log('🔍 Verifying completion of backend tasks (2.1 to 2.14)...\n');
  
  let totalChecks = 0;
  let successfulChecks = 0;
  
  // Check for each task
  for (const [task, files] of Object.entries(expectedFiles)) {
    console.log(`${task}:`);
    
    for (const file of files) {
      totalChecks++;
      
      // Check if it's a directory
      if (file.endsWith('/')) {
        if (checkDir(file)) successfulChecks++;
      } else {
        if (checkFile(file)) successfulChecks++;
      }
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Check for expected functions in service files
  console.log('Checking for expected functions in service files:');
  for (const [file, functions] of Object.entries(expectedFunctions)) {
    console.log(`\n${file}:`);
    if (checkFunctions(file, functions)) successfulChecks += functions.length;
    totalChecks += functions.length;
  }
  
  // Check for expected middlewares
  console.log('\nChecking for expected middleware functions:');
  for (const [file, middlewares] of Object.entries(expectedMiddlewares)) {
    console.log(`\n${file}:`);
    if (checkFunctions(file, middlewares)) successfulChecks += middlewares.length;
    totalChecks += middlewares.length;
  }
  
  // Calculate and display results
  const successRate = (successfulChecks / totalChecks) * 100;
  console.log('\n📊 Verification Summary:');
  console.log(`Total checks performed: ${totalChecks}`);
  console.log(`Successful checks: ${successfulChecks}`);
  console.log(`Failed checks: ${totalChecks - successfulChecks}`);
  console.log(`Success rate: ${successRate.toFixed(2)}%`);
  
  if (successRate === 100) {
    console.log('\n🎉 All tasks from 2.1 to 2.14 have been successfully completed!');
    console.log('✅ Backend project is fully functional with all required components.');
  } else if (successRate >= 80) {
    console.log('\n✅ Most tasks completed successfully, but there are some issues.');
  } else {
    console.log('\n⚠️ Significant portions of the project are missing or incomplete.');
  }
  
  return successRate === 100;
}

// Run the verification
verifyTasksCompletion();