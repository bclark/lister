#!/usr/bin/env node

/**
 * Simple API testing script for the Lister API
 * Run with: node scripts/test-api.js
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`\n🔄 ${options.method || 'GET'} ${endpoint}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${response.status} - Success`);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ ${response.status} - Error`);
      console.log(JSON.stringify(data, null, 2));
    }
    
    return { response, data };
  } catch (error) {
    console.log(`💥 Request failed: ${error.message}`);
    return { error };
  }
}

async function testAPI() {
  console.log('🚀 Testing Lister API');
  console.log(`📍 Base URL: ${BASE_URL}`);
  
  // Test health endpoint
  await makeRequest('/health');
  
  // Test categories
  await makeRequest('/categories');
  
  // Test authentication
  const authResult = await makeRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
    }),
  });
  
  if (authResult.data?.session?.access_token) {
    const token = authResult.data.session.access_token;
    
    // Test authenticated endpoints
    await makeRequest('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Test lists
    await makeRequest('/lists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Create a test list
    const listResult = await makeRequest('/lists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_id: 'cat-1',
        year: 2023,
        title: 'Test Movies List',
      }),
    });
    
    if (listResult.data?.list?.id) {
      const listId = listResult.data.list.id;
      
      // Add an item to the list
      await makeRequest(`/lists/${listId}/items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Test Movie',
          description: 'A test movie for the API',
          position: 1,
        }),
      });
      
      // Get the updated list
      await makeRequest(`/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    
    // Test sign out
    await makeRequest('/auth/signout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  console.log('\n🏁 API testing complete');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ for fetch support');
  console.log('💡 Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

testAPI().catch(console.error);
