import axios from 'axios';

const BASE_URL = 'http://gateway.local';

// --- Test Configuration ---
const CONFIG = {
  VIRTUAL_USERS: 1,        // Number of concurrent user loops running simultaneously
  ITERATIONS_PER_VU: 1,   // How many full cycles each VU completes
  DELAY_BETWEEN_STEPS: 100 // Think-time delay (ms) between subsequent endpoint calls
};

// --- Global Metrics Collector ---
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  endpoints: {}
};

function logMetric(endpoint, method, status, duration) {
  metrics.totalRequests++;
  if (status >= 200 && status < 300) metrics.successfulRequests++;
  else metrics.failedRequests++;

  const key = `[${method}] ${endpoint}`;
  if (!metrics.endpoints[key]) {
    metrics.endpoints[key] = { count: 0, totalDuration: 0, min: Infinity, max: 0, errors: 0 };
  }
  
  const metric = metrics.endpoints[key];
  metric.count++;
  if (status >= 400) metric.errors++;
  else {
    metric.totalDuration += duration;
    if (duration < metric.min) metric.min = duration;
    if (duration > metric.max) metric.max = duration;
  }
}

// Helper wrapper to easily track HTTP calls
// Optimized helper wrapper with strict, runtime-safe payload extraction
async function request(method, path, data = null, token = null) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const start = performance.now();
  try {
    const response = await axios({ 
      method, 
      url, 
      data, 
      headers, 
      timeout: 5000,
      // Forces axios to treat strings smoothly if JSON formatting parsing natively crashes
      transformResponse: [Symbol.hasInstance ? (res) => {
        try { return JSON.parse(res); } 
        catch (e) { return res; } // Fall back to raw content if text string or empty/null
      } : (res) => res] 
    });

    const duration = performance.now() - start;
    logMetric(path.replace(/\/[a-f0-9]{24}/g, '/:id'), method, response.status, duration);
    
    // Safely structure variations of returns (empty strings, literal raw MongoDB IDs, objects)
    if (!response.data) return {};
    if (typeof response.data === 'string') {
      // If the backend returned a bare string ID instead of an object, normalize it
      if (response.data.match(/^[a-f0-9]{24}$/)) {
        return { id: response.data, _id: response.data };
      }
      return { message: response.data };
    }
    
    return response.data;
  } catch (error) {
    const duration = performance.now() - start;
    const status = error.response ? error.response.status : 500;
    logMetric(path.replace(/\/[a-f0-9]{24}/g, '/:id'), method, status, duration);
    return null;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomString = () => Math.random().toString(36).substring(2, 7);

// --- Complete Stateful User Journey Loop ---
async function runVirtualUser(vuId) {
  // console.log(`VU-${vuId} started. Iterations: ${CONFIG.ITERATIONS_PER_VU}`);
  for (let i = 1; i <= CONFIG.ITERATIONS_PER_VU; i++) {
    const randomEmail = `user_${vuId}_${randomString()}_${Date.now()}@test.com`;
    const password = "Osman@#1";
    let token = null;
    let userId = null;
    let bookId = null;
    let orderId = null;

    // 1. Health Checks
    // await request('GET', '/auth/health/live');
    // await request('GET', '/auth/health/ready');
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    // 2. Auth Flow: Register -> Login -> Profile
    await request('POST', '/auth/register', { email: randomEmail, password });
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    const loginRes = await request('POST', '/auth/login', { email: randomEmail, password });

    if (loginRes && loginRes?.data?.tokens?.accessToken) {
      token = loginRes?.data?.tokens?.accessToken;
    } else {
      console.error(`VU-${vuId} failed to authenticate.`);
      continue; // Skip cycle if auth failed
    }
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    const profileRes = await request('GET', '/auth/profile', {name: "osman"}, token);
    // console.log(`token: ${token}`);
    // console.log(`profileRes: ${JSON.stringify(profileRes)}`);
   
    if (profileRes) userId = profileRes?.data?.data?.sub || profileRes?.id || profileRes?.userId;
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    // 3. Books Flow: Create -> List -> Get Single -> Update -> Delete
    const bookPayload = {
      title: `Book ${randomString()}`,
      author: "Osman Goni",
      description: "Automated load-test book description entry.",
      price: Math.floor(Math.random() * 100) + 1,
      quantity: 250,
      isPublished: false
    };

    const createBookRes = await request('POST', '/books', bookPayload, token);
    console.log(createBookRes);
    console.log(createBookRes?.data?._id);
   
    if (createBookRes) bookId = createBookRes?.data?._id || createBookRes?.id || createBookRes?._id;
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    await request('GET', '/books', {name: "osman"}, token);
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    if (bookId) {
      await request('GET', `/books/${bookId}`,{name: "osman"}, token);
      await request('PUT', `/books/${bookId}`, { ...bookPayload, title: "Updated Title" }, token);
    }

    // 4. Orders Flow
    if (userId && bookId) {
      const orderPayload = { userId, bookId, price: 150, quantity: 1 };
      const createOrderRes = await request('POST', '/orders', orderPayload, token);
      if (createOrderRes) orderId = createOrderRes.id || createOrderRes._id;
      await sleep(CONFIG.DELAY_BETWEEN_STEPS);
    }

    await request('GET', '/orders', {name: "osman"}, token);
    if (orderId) {
      await request('GET', `/orders/${orderId}`, {name: "osman"}, token);
      await request('PUT', `/orders/${orderId}`, { price: 99 }, token);
    }
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    // 5. Users Meta Service
    if (bookId) {
      await request('POST', '/users', { email: randomEmail, password: randomString(), userId: userId || "mock-id", bookId, price: 100 }, token);
    }
    await request('GET', '/users', {name: "osman"}, token);
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    // 6. Review Service
    if (bookId) {
      await request('POST', '/review', { userId: userId || "mock-id", bookId, price: 100 }, token);
    }
    await request('GET', '/review', {name: "osman"}, token);
    await sleep(CONFIG.DELAY_BETWEEN_STEPS);

    // 7. Cleanup & Teardown
    // if (orderId) await request('DELETE', `/orders/${orderId}`, {name: "osman"}, token);
    // if (bookId) await request('DELETE', `/books/${bookId}`, {name: "osman"}, token);
    // await request('POST', '/auth/logout', {name: "osman"}, token);
  }
}

// --- Execution Engine ---
async function startLoadTest() {
  // console.clear();
  console.log(`================================================================`);
  console.log(`🚀 STARTING MICROSERVICES LIFECYCLE LOAD TEST`);
  console.log(`   Config: ${CONFIG.VIRTUAL_USERS} Concurrent VUs | ${CONFIG.ITERATIONS_PER_VU} Iterations Each`);
  console.log(`================================================================\n`);

  const startTime = performance.now();
  const vuPromises = [];

  for (let i = 0; i < CONFIG.VIRTUAL_USERS; i++) {
    vuPromises.push(runVirtualUser(i));
  }

  // Live reporting heartbeat loop
  const interval = setInterval(() => {
    console.log(` Progress: ${metrics.successfulRequests + metrics.failedRequests} / ~${CONFIG.VIRTUAL_USERS * CONFIG.ITERATIONS_PER_VU * 19} requests hit.`);
  }, 2000);

  await Promise.all(vuPromises);
  clearInterval(interval);

  const totalTimeSeconds = ((performance.now() - startTime) / 1000).toFixed(2);

  // --- Print Final Tabular Metrics Summary ---
  // console.clear();
  console.log(`================================================================`);
  console.log(`🏁 LOAD TEST COMPLETE IN ${totalTimeSeconds}s`);
  console.log(` Total Requests Executed: ${metrics.totalRequests}`);
  console.log(` Success rate: ${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}% (${metrics.successfulRequests} OK / ${metrics.failedRequests} Errors)`);
  console.log(`================================================================\n`);

  console.log(String.prototype.padEnd ? "Endpoint".padEnd(40) + "Hits".padEnd(8) + "Avg (ms)".padEnd(12) + "Min (ms)".padEnd(10) + "Max (ms)".padEnd(10) + "Errors" : "Summary:");
  console.log("-".repeat(86));

  for (const [endpoint, data] of Object.entries(metrics.endpoints)) {
    const avg = data.count - data.errors > 0 ? (data.totalDuration / (data.count - data.errors)).toFixed(1) : '0';
    const min = data.min === Infinity ? '0' : data.min.toFixed(1);
    const max = data.max.toFixed(1);
    
    console.log(
      `${endpoint.substring(0, 38).padEnd(40)}` +
      `${data.count.toString().padEnd(8)}` +
      `${avg.padEnd(12)}` +
      `${min.padEnd(10)}` +
      `${max.padEnd(10)}` +
      `${data.errors}`
    );
  }
}

// Add package type support assurance
if (!process.versions.node) {
  console.error("Please run this script inside Node.js environment.");
} else {
  startLoadTest().catch(console.error);
}