const CONFIG = {
    updateInterval: 30000,
    apiEndpoint: '/api/analytics',
    retryDelay: 5000,
    maxRetries: 3
};

let state = {
    currentData: null,
    previousData: null,
    updateCount: 0,
    errorCount: 0,
    isConnected: false,
    retryCount: 0
};

const elements = {
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    lastUpdate: document.getElementById('lastUpdate'),
    revenueRobux: document.getElementById('revenueRobux'),
    revenueUSD: document.getElementById('revenueUSD'),
    revenueChange: document.getElementById('revenueChange'),
    playersCount: document.getElementById('playersCount'),
    playersChange: document.getElementById('playersChange'),
    visitsCount: document.getElementById('visitsCount'),
    visitsChange: document.getElementById('visitsChange'),
    favoritesCount: document.getElementById('favoritesCount'),
    favoritesChange: document.getElementById('favoritesChange'),
    infoBanner: document.getElementById('infoBanner'),
    infoText: document.getElementById('infoText')
};

function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Math.floor(num).toLocaleString('en-US');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function calculateChange(current, previous) {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
}

function formatChange(change) {
    if (change === null) return '';
    const sign = change >= 0 ? '+' : '';
    const className = change >= 0 ? 'positive' : 'negative';
    return `<span class="${className}">${sign}${change.toFixed(1)}%</span>`;
}

function updateUI(data) {
    if (!data) return;

    if (data.revenue) {
        const robux = data.revenue.robux || 0;
        const usd = data.revenue.usd || 0;
        
        updateMetric(elements.revenueRobux, formatNumber(robux));
        updateMetric(elements.revenueUSD, formatCurrency(usd));
        
        if (state.previousData && state.previousData.revenue) {
            const change = calculateChange(robux, state.previousData.revenue.robux);
            elements.revenueChange.innerHTML = formatChange(change);
        }
    }

    if (data.players !== undefined) {
        updateMetric(elements.playersCount, formatNumber(data.players));
        if (state.previousData && state.previousData.players !== undefined) {
            const change = calculateChange(data.players, state.previousData.players);
            elements.playersChange.innerHTML = formatChange(change);
        }
    }

    if (data.visits !== undefined) {
        updateMetric(elements.visitsCount, formatNumber(data.visits));
        if (state.previousData && state.previousData.visits !== undefined) {
            const change = calculateChange(data.visits, state.previousData.visits);
            elements.visitsChange.innerHTML = formatChange(change);
        }
    }

    if (data.favorites !== undefined) {
        updateMetric(elements.favoritesCount, formatNumber(data.favorites));
        if (state.previousData && state.previousData.favorites !== undefined) {
            const change = calculateChange(data.favorites, state.previousData.favorites);
            elements.favoritesChange.innerHTML = formatChange(change);
        }
    }

    if (data.timestamp) {
        const date = new Date(data.timestamp);
        elements.lastUpdate.textContent = `Last updated: ${date.toLocaleTimeString()}`;
    }

    updateStatus('connected', 'Live');
    hideInfoBanner();
}

function updateMetric(element, value) {
    if (element.textContent !== value) {
        element.classList.add('updated');
        element.textContent = value;
        setTimeout(() => {
            element.classList.remove('updated');
        }, 500);
    } else {
        element.textContent = value;
    }
}

function updateStatus(status, text) {
    elements.statusDot.className = `status-dot ${status}`;
    elements.statusText.textContent = text;
    state.isConnected = status === 'connected';
}

function showInfoBanner(message, type = 'info') {
    elements.infoBanner.style.display = 'block';
    elements.infoBanner.className = `info-banner ${type}`;
    elements.infoText.textContent = message;
}

function hideInfoBanner() {
    elements.infoBanner.style.display = 'none';
}

async function fetchAnalytics() {
    try {
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
            state.previousData = state.currentData;
            state.currentData = result.data;
            state.updateCount++;
            state.errorCount = 0;
            state.retryCount = 0;

            if (result.cached && result.data.stale) {
                showInfoBanner('⚠️ Using cached data - API temporarily unavailable', 'warning');
            }

            updateUI(result.data);
            return true;
        } else {
            throw new Error(result.error || 'Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching analytics:', error);
        state.errorCount++;
        state.retryCount++;

        updateStatus('error', 'Connection Error');

        if (state.currentData) {
            showInfoBanner(`⚠️ Update failed: ${error.message}. Retrying... (${state.retryCount}/${CONFIG.maxRetries})`, 'error');
        } else {
            showInfoBanner(`❌ Failed to load data: ${error.message}. Retrying...`, 'error');
        }

        if (state.retryCount < CONFIG.maxRetries) {
            setTimeout(fetchAnalytics, CONFIG.retryDelay);
        } else {
            state.retryCount = 0;
        }

        return false;
    }
}

function startPolling() {
    fetchAnalytics();
    setInterval(() => {
        fetchAnalytics();
    }, CONFIG.updateInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Roblox Analytics Dashboard initialized');
    console.log(`📊 Update interval: ${CONFIG.updateInterval / 1000} seconds`);
    
    updateStatus('connecting', 'Connecting...');
    startPolling();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        fetchAnalytics();
    }
});

window.addEventListener('online', () => {
    updateStatus('connecting', 'Reconnecting...');
    fetchAnalytics();
});

window.addEventListener('offline', () => {
    updateStatus('error', 'Offline');
    showInfoBanner('❌ No internet connection', 'error');
});

