const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
// Use puppeteer-core for better compatibility on cloud platforms
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  puppeteer = require('puppeteer');
}
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Render.com sets PORT automatically, but we need to handle it
if (process.env.RENDER) {
  console.log('🌐 Running on Render.com');
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuration
const CONFIG = {
  universeId: process.env.UNIVERSE_ID || '7281007509',
  robloxCookie: process.env.ROBLOX_COOKIE || '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhACIhwKBGR1aWQSFDE2MTIwNDQ3NDY0Mjk2NDMxNzY4KAM.hgYyupduR7wHtXddNfKaO8d8-otDfEhlNBIBpymMr3DTBPSjAfxLMJLrwKK9iy_uwImEmO5M37vtM4EoJyNIdyFuTJAkBGW-wxuFbppAhzIBWWP5E8OBBdwNJduydm3PzycBeBhXlhhCUZN6n8RoQ6qru5lTG8lqLGZ3cG-S5ux2ereOvVGRz-En3AiNNl49Znf22S9eSaPeBjTf8lqJW_VWgbpBnmRfhhHSzLaj04XX39dF8mSfrHhWln2wc3NTFG9DRuANe7MZbTRsJ__LzGgpDJjE2FlPiN2ofN4zU1iJvrWjSQYEPtVQajC5Oes6e-gsbs63izLGFOQHK9_VoaQt9_uh_EBrFfH3KqjuMfbYbk7cr-XqnN3MlA04qnkqmbLWOt84M4shTduDtcPOkNYg_O_WUzpEEyFm8_X1uB2z2kVkzKoo_0t8J7mKGKysvP5BPyBdDVuml9_Kk8DWC5wEpfJlBh5LVhgM5nVt2eJTcJjBTfOxCt-Bzetl0Ajj2i5NdDLYbStx0DXGJz_vpvb9WoBh3HgB1qGH-fBkyHutpZuvuKWmvgBGfhIQpeneibi5OTjw3czY8TL3QDnUOpkJ0ceXmqSC_qWis5zqLE2ZIwOKy4PqPgOTyQW2lZH8MzD02crpcwMrFlYnL_Nv1revUeIw0PphoTRS6aTYyPqvwU8qzkc1FgC3l3AImuXuUMmM-f5Mup4CL0VfuXwrEY9M0XPixxBrGl-r_LFf1YGdijoBv00n6t2DMQ0sRQ6Ov72Umbsex4ngtHDmX2w-Nytgxwfaj37TNIBF349lcieCqxlsYzUcSx0XHOpLAVy49BTfjjzf-WOI5RUdMfhnar8OU2jC7mTeJWjdh9_trSTpwK3-xDeLHdHiJNDuqukexEC_qPjuKn3xwXd32liV1l2wtTots3N9u3MbP5RZ6EDq8RLF_Fzf3-TEaJLsFScH7rs2DXRiWLDJKPQYT4wAKhDbzscrxRrXdVVjFKsWvUJIx5ItVbR-P3cICaLSZlFK-J7BQItqrs7DEA6NFJ7IVAFRwhvLSMN_1-0nG4NMHU3cELw8bmtkU044gBilVI6hT7aByuQzLR2xIbDYJL059RPU9TitOvpuED5iOjeGqWDxSHBOjFaaEO7wZQcoXVYy6EWwWw'
};

// Cache
let dataCache = {
  timestamp: null,
  data: null,
  ttl: 25000
};

// Browser instance (reused for efficiency)
let browser = null;

// Initialize browser
async function initBrowser() {
  if (browser) return browser;
  
  try {
    // Optimize for cloud platforms like Render
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--single-process'
      ]
    };

    // Try to use system Chrome on Render
    if (process.env.RENDER || process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD) {
      // On Render, try to find Chrome in common locations
      const chromePaths = [
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      ];
      
      for (const chromePath of chromePaths) {
        try {
          const fs = require('fs');
          if (fs.existsSync(chromePath)) {
            launchOptions.executablePath = chromePath;
            console.log(`✅ Using system Chrome at: ${chromePath}`);
            break;
          }
        } catch (e) {
          // Continue to next path
        }
      }
    }

    browser = await puppeteer.launch(launchOptions);
    console.log('✅ Browser initialized');
    return browser;
  } catch (error) {
    console.error('❌ Failed to initialize browser:', error.message);
    // Fallback: try with default puppeteer (will download Chromium)
    try {
      const puppeteerFull = require('puppeteer');
      browser = await puppeteerFull.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
      console.log('✅ Browser initialized (fallback)');
      return browser;
    } catch (fallbackError) {
      throw new Error(`Browser initialization failed: ${error.message}`);
    }
  }
}

// Fetch analytics using browser automation (like the dashboard does)
async function fetchAnalyticsWithBrowser() {
  if (!CONFIG.robloxCookie) {
    throw new Error('Roblox cookie required for browser automation');
  }

  let page = null;
  try {
    browser = await initBrowser();
    page = await browser.newPage();

    // Set cookie and navigate
    await page.setCookie({
      name: '.ROBLOSECURITY',
      value: CONFIG.robloxCookie,
      domain: '.roblox.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });

    // Intercept network requests to find API calls
    const apiResponses = [];
    page.on('response', async (response) => {
      const url = response.url();
      // Look for API endpoints that might contain revenue data
      if (url.includes('/v1/') || url.includes('/v2/') || url.includes('/api/') || 
          url.includes('revenue') || url.includes('monetization') || url.includes('analytics') ||
          url.includes('developer-stats') || url.includes('economy')) {
        try {
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('application/json')) {
            const data = await response.json();
            apiResponses.push({ url, data });
          }
        } catch (e) {
          // Not JSON, skip
        }
      }
    });

    // Navigate to monetization page
    const monetizationUrl = `https://create.roblox.com/dashboard/creations/experiences/${CONFIG.universeId}/monetization/overview`;
    console.log('🌐 Navigating to monetization page...');
    
    await page.goto(monetizationUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a bit for API calls to complete
    await page.waitForTimeout(3000);

    // Try to extract data from page
    const pageData = await page.evaluate(() => {
      // Look for data in window objects
      const data = {};
      
      // Check for common data patterns
      if (window.__INITIAL_STATE__) {
        data.initialState = window.__INITIAL_STATE__;
      }
      if (window.__APOLLO_STATE__) {
        data.apolloState = window.__APOLLO_STATE__;
      }
      if (window.__NEXT_DATA__) {
        data.nextData = window.__NEXT_DATA__;
      }
      
      // Look for revenue data in the DOM
      const revenueElements = document.querySelectorAll('[class*="revenue"], [class*="Revenue"], [data-revenue], [data-robux]');
      revenueElements.forEach(el => {
        const text = el.textContent || el.innerText || '';
        const match = text.match(/(\d{1,3}(?:,\d{3})*)/);
        if (match) {
          data.revenueText = match[1];
        }
      });
      
      return data;
    });

    // Check API responses for revenue data
    for (const response of apiResponses) {
      const revenue = extractRevenueFromResponse(response.data);
      if (revenue && revenue.robux > 0) {
        console.log('✅ Found revenue data from API:', response.url);
        return revenue;
      }
    }

    // Try to extract from page data
    if (pageData.initialState || pageData.apolloState || pageData.nextData) {
      const revenue = extractRevenueFromPageData(pageData);
      if (revenue && revenue.robux > 0) {
        console.log('✅ Found revenue data from page state');
        return revenue;
      }
    }

    // Try direct API calls with intercepted endpoints
    const apiEndpoints = [
      `https://develop.roblox.com/v1/universes/${CONFIG.universeId}/developer-stats`,
      `https://economy.roblox.com/v1/developers/${CONFIG.universeId}/revenue`,
      `https://analytics.roblox.com/v1/universes/${CONFIG.universeId}/revenue`
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.evaluate(async (url, cookie) => {
          const res = await fetch(url, {
            headers: {
              'Cookie': `.ROBLOSECURITY=${cookie}`,
              'Accept': 'application/json'
            }
          });
          return res.json();
        }, endpoint, CONFIG.robloxCookie);

        const revenue = extractRevenueFromResponse(response);
        if (revenue && revenue.robux > 0) {
          console.log('✅ Found revenue data from direct API call:', endpoint);
          return revenue;
        }
      } catch (e) {
        // Try next endpoint
      }
    }

    throw new Error('Could not extract revenue data from page');

  } catch (error) {
    console.error('Browser automation error:', error.message);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

// Extract revenue from API response
function extractRevenueFromResponse(data) {
  if (!data) return null;

  let revenue = 0;
  let visits = 0;
  let favorites = 0;
  let players = 0;

  // Recursive search for revenue data
  const search = (obj, depth = 0) => {
    if (depth > 5 || !obj || typeof obj !== 'object') return;
    
    for (const key in obj) {
      const value = obj[key];
      const keyLower = key.toLowerCase();
      
      if (keyLower.includes('revenue') || keyLower.includes('robux') || keyLower.includes('earnings')) {
        if (typeof value === 'number' && value > revenue) {
          revenue = value;
        } else if (typeof value === 'object' && value !== null) {
          if (value.robux || value.revenue || value.totalRevenue) {
            revenue = Math.max(revenue, value.robux || value.revenue || value.totalRevenue || 0);
          }
        }
      }
      
      if (keyLower.includes('visit') && typeof value === 'number') {
        visits = Math.max(visits, value);
      }
      if (keyLower.includes('favorite') && typeof value === 'number') {
        favorites = Math.max(favorites, value);
      }
      if ((keyLower.includes('player') || keyLower.includes('playing')) && typeof value === 'number') {
        players = Math.max(players, value);
      }
      
      if (typeof value === 'object' && value !== null) {
        search(value, depth + 1);
      }
    }
  };

  search(data);

  if (revenue > 0) {
    return {
      revenue: {
        robux: Math.round(revenue),
        usd: Math.round(revenue * 0.0035 * 100) / 100
      },
      visits: visits,
      favorites: favorites,
      players: players,
      timestamp: new Date().toISOString(),
      source: 'browser_automation'
    };
  }

  return null;
}

// Extract revenue from page data
function extractRevenueFromPageData(pageData) {
  const data = pageData.initialState || pageData.apolloState || pageData.nextData || {};
  return extractRevenueFromResponse(data);
}

// Main fetch function
async function fetchGameAnalytics() {
  // Method 1: Browser automation (most reliable, like the dashboard)
  if (CONFIG.robloxCookie) {
    try {
      console.log('🤖 Attempting browser automation...');
      const data = await fetchAnalyticsWithBrowser();
      if (data) return data;
    } catch (e) {
      console.log('Browser automation failed, trying API methods...');
    }
  }

  // Method 2: Direct API calls (fallback)
  const universeId = CONFIG.universeId;
  const apiEndpoints = [
    `https://develop.roblox.com/v1/universes/${universeId}/developer-stats`,
    `https://economy.roblox.com/v1/developers/${universeId}/revenue`,
    `https://analytics.roblox.com/v1/universes/${universeId}/revenue`
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Cookie': `.ROBLOSECURITY=${CONFIG.robloxCookie}`,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const revenue = extractRevenueFromResponse(response.data);
      if (revenue) {
        console.log('✅ API call successful:', endpoint);
        return revenue;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('All methods failed to fetch revenue data');
}

// API endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const now = Date.now();
    if (dataCache.data && dataCache.timestamp && (now - dataCache.timestamp) < dataCache.ttl) {
      return res.json({
        success: true,
        data: dataCache.data,
        cached: true
      });
    }

    const analytics = await fetchGameAnalytics();

    dataCache = {
      timestamp: now,
      data: analytics,
      ttl: 25000
    };

    res.json({
      success: true,
      data: analytics,
      cached: false
    });
  } catch (error) {
    console.error('API Error:', error);
    
    if (dataCache.data) {
      return res.json({
        success: true,
        data: {
          ...dataCache.data,
          error: 'Using cached data due to fetch error',
          stale: true
        },
        cached: true
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch analytics'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Roblox Analytics Dashboard running on http://localhost:${PORT}`);
  console.log(`📊 Using browser automation to fetch revenue data (like databots.super02.me)`);
});

