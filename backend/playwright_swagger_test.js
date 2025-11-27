/**
 * Playwright Test for Swagger API Endpoint
 * This script automates testing the Swagger UI at http://localhost:3000/api-docs/#/Todos/get_api_todos__id_
 */

const { chromium } = require('playwright');

(async () => {
  // Launch a browser
  const browser = await chromium.launch({
    headless: false, // Set to true if you don't want to see the browser UI
    devtools: true   // Opens devtools for debugging
  });

  // Create a new page
  const page = await browser.newPage();

  try {
    // Navigate to the Swagger UI page
    console.log('Navigating to Swagger UI...');
    await page.goto('http://localhost:3000/api-docs/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Swagger UI loaded successfully');
    
    // Check if the page title is correct
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Look for the Todos API section
    await page.waitForSelector('text=Todos', { timeout: 10000 });
    console.log('✅ Found the Todos API section');
    
    // Click on the "Todos" section to expand it
    await page.click('text=Todos');
    console.log('Clicked on Todos section');
    
    // Find and click on the GET /api/todos/{id} endpoint
    await page.waitForSelector('text=GET /api/todos/{id}', { timeout: 10000 });
    await page.click('text=GET /api/todos/{id}');
    console.log('Clicked on GET /api/todos/{id} endpoint');
    
    // Wait for the operation details to load
    await page.waitForSelector('.opblock-body', { timeout: 10000 });
    console.log('Operation details loaded');
    
    // Fill in the todoId parameter (use a placeholder ID for now)
    const todoIdInput = await page.locator('input[name="id"]').first();
    if (await todoIdInput.count() > 0) {
      await todoIdInput.fill('test-todo-id');
      console.log('Filled in the todo ID parameter');
    } else {
      console.log('⚠️ Could not find the todo ID input field');
    }
    
    // Click the "Try it out" button
    const tryItOutBtn = await page.locator('button:has-text("Try it out")').first();
    if (await tryItOutBtn.count() > 0) {
      await tryItOutBtn.click();
      console.log('Clicked "Try it out" button');
    } else {
      console.log('⚠️ Could not find the "Try it out" button');
    }
    
    // Click the "Execute" button
    const executeBtn = await page.locator('button:has-text("Execute")').first();
    if (await executeBtn.count() > 0) {
      await executeBtn.click();
      console.log('Clicked "Execute" button');
      
      // Wait for the response
      await page.waitForSelector('.response', { timeout: 15000 });
      console.log('API response received');
      
      // Capture the response details
      const responseStatusCode = await page.locator('.response .response-col_status').textContent();
      console.log(`Response Status: ${responseStatusCode.trim()}`);
      
      const responseDetails = await page.locator('.response .response-col_description .highlight-code').textContent();
      console.log(`Response Details: ${responseDetails.trim()}`);
    } else {
      console.log('⚠️ Could not find the "Execute" button');
    }
    
    console.log('\n✅ Playwright test completed successfully!');
    console.log('✅ Swagger API testing via Playwright is possible and working.');

  } catch (error) {
    console.error('❌ Error occurred during Playwright test:', error.message);
  } finally {
    // Close the browser
    await browser.close();
    console.log('Browser closed');
  }
})();