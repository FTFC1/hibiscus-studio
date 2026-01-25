/**
 * HB Booking Backend - Cloudflare Worker
 * Hibiscus Studio booking system with bank transfer confirmation
 */

import { Router } from 'itty-router';

const router = Router();

// ============================================
// CORS & Helpers
// ============================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'text/html' },
  });
}

// Handle CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

// ============================================
// Google Calendar Auth (Service Account)
// ============================================

async function getAccessToken(env) {
  const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);

  // Create JWT
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '');
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  // Sign with private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(serviceAccount.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = arrayBufferToBase64Url(signature);
  const jwt = `${signatureInput}.${encodedSignature}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ============================================
// Calendar Operations
// ============================================

const TIME_SLOTS = [
  { id: 'morning', label: '12:00 PM - 6:00 PM', start: '12:00', end: '18:00', surcharge: 0 },
  { id: 'afternoon', label: '2:00 PM - 8:00 PM', start: '14:00', end: '20:00', surcharge: 0 },
  { id: 'evening', label: '4:00 PM - 10:00 PM', start: '16:00', end: '22:00', surcharge: 0 },
  { id: 'latenight', label: '6:00 PM - 12:00 AM', start: '18:00', end: '00:00', surcharge: 50 },
];

async function checkAvailability(date, env) {
  const accessToken = await getAccessToken(env);

  // Query both calendars for busy times
  const timeMin = `${date}T00:00:00Z`;
  const timeMax = `${date}T23:59:59Z`;

  const freeBusyResponse = await fetch(
    'https://www.googleapis.com/calendar/v3/freeBusy',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [
          { id: env.GOOGLE_CALENDAR_ID_WRITE },
          { id: env.GOOGLE_CALENDAR_ID_READ },
        ],
      }),
    }
  );

  const freeBusyData = await freeBusyResponse.json();

  // Combine busy periods from both calendars
  const busyPeriods = [
    ...(freeBusyData.calendars?.[env.GOOGLE_CALENDAR_ID_WRITE]?.busy || []),
    ...(freeBusyData.calendars?.[env.GOOGLE_CALENDAR_ID_READ]?.busy || []),
  ];

  // Check which slots are available
  const availableSlots = TIME_SLOTS.map(slot => {
    const slotStart = new Date(`${date}T${slot.start}:00`);
    let slotEnd;
    if (slot.end === '00:00') {
      // Next day midnight
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      slotEnd = new Date(`${nextDay.toISOString().split('T')[0]}T00:00:00`);
    } else {
      slotEnd = new Date(`${date}T${slot.end}:00`);
    }

    const isAvailable = !busyPeriods.some(busy => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return slotStart < busyEnd && slotEnd > busyStart;
    });

    return { ...slot, available: isAvailable };
  });

  return availableSlots;
}

async function createProvisionalEvent(booking, env) {
  const accessToken = await getAccessToken(env);

  const slot = TIME_SLOTS.find(s => s.id === booking.timeSlot);
  const startDateTime = `${booking.date}T${slot.start}:00`;
  let endDateTime;
  if (slot.end === '00:00') {
    const nextDay = new Date(booking.date);
    nextDay.setDate(nextDay.getDate() + 1);
    endDateTime = `${nextDay.toISOString().split('T')[0]}T00:00:00`;
  } else {
    endDateTime = `${booking.date}T${slot.end}:00`;
  }

  const event = {
    summary: `🟡 PENDING: ${booking.eventType} - ${booking.name}`,
    description: `
PROVISIONAL BOOKING - AWAITING PAYMENT

Customer: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Event Type: ${booking.eventType}
Guests: ${booking.guestCount}
Total: £${booking.total}
Deposit Due: £${booking.deposit}

Booking ID: ${booking.id}
    `.trim(),
    start: {
      dateTime: startDateTime,
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Europe/London',
    },
    colorId: '5', // Yellow for pending
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID_WRITE)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  return response.json();
}

async function confirmEvent(calendarEventId, booking, env) {
  const accessToken = await getAccessToken(env);

  const event = {
    summary: `✅ CONFIRMED: ${booking.eventType} - ${booking.name}`,
    colorId: '2', // Green for confirmed
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID_WRITE)}/events/${calendarEventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  return response.json();
}

async function deleteCalendarEvent(calendarEventId, env) {
  const accessToken = await getAccessToken(env);

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID_WRITE)}/events/${calendarEventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.ok;
}

// Fetch all events from both calendars (for admin dashboard)
async function getAllCalendarEvents(env) {
  const accessToken = await getAccessToken(env);
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAhead = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

  const timeMin = threeMonthsAgo.toISOString();
  const timeMax = sixMonthsAhead.toISOString();

  const allEvents = [];
  const calendarIds = [env.GOOGLE_CALENDAR_ID_WRITE, env.GOOGLE_CALENDAR_ID_READ].filter(Boolean);

  for (const calendarId of calendarIds) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=250`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const source = calendarId === env.GOOGLE_CALENDAR_ID_WRITE ? 'new' : 'legacy';

        for (const event of (data.items || [])) {
          // Skip cancelled events
          if (event.status === 'cancelled') continue;

          // Parse event to booking-like structure
          const startDate = event.start?.dateTime || event.start?.date;
          const endDate = event.end?.dateTime || event.end?.date;

          allEvents.push({
            id: event.id,
            calendarEventId: event.id,
            source,
            name: event.summary || 'Calendar Event',
            eventType: parseEventType(event.summary || ''),
            date: startDate ? startDate.split('T')[0] : null,
            startTime: startDate,
            endTime: endDate,
            status: event.description?.includes('CONFIRMED') ? 'confirmed' :
                    event.description?.includes('PROVISIONAL') ? 'pending' : 'confirmed',
            guestCount: parseGuestCount(event.description || ''),
            email: parseEmail(event.description || ''),
            phone: parsePhone(event.description || ''),
            total: parseTotal(event.description || ''),
            deposit: parseDeposit(event.description || ''),
            fromCalendar: true,
            calendarSource: source === 'new' ? 'contacthibiscusstudio' : 'hibiscusstudiouk',
          });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch events from ${calendarId}:`, error);
    }
  }

  return allEvents;
}

// Helper parsers for calendar event descriptions
function parseEventType(summary) {
  // Try to extract event type from summary like "Birthday Party - John" or just use summary
  const types = ['birthday', 'bridal', 'baby shower', 'photoshoot', 'content', 'party', 'event'];
  const lower = summary.toLowerCase();
  for (const type of types) {
    if (lower.includes(type)) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  return summary.split(' - ')[0] || 'Event';
}

function parseGuestCount(description) {
  const match = description.match(/(\d+)\s*guests?/i);
  return match ? parseInt(match[1]) : null;
}

function parseEmail(description) {
  const match = description.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match ? match[0] : null;
}

function parsePhone(description) {
  const match = description.match(/(?:\+44|0)\s*\d[\d\s-]{8,}/);
  return match ? match[0].trim() : null;
}

function parseTotal(description) {
  const match = description.match(/total[:\s]*£?(\d+)/i);
  return match ? parseInt(match[1]) : 300;
}

function parseDeposit(description) {
  const match = description.match(/deposit[:\s]*£?(\d+)/i);
  return match ? parseInt(match[1]) : 150;
}

// ============================================
// Pricing
// ============================================

function calculatePrice(booking) {
  const BASE_PRICE = 300;
  const slot = TIME_SLOTS.find(s => s.id === booking.timeSlot);
  const surcharge = slot?.surcharge || 0;

  let addons = 0;
  if (booking.extras?.catering) addons += 150;
  if (booking.extras?.dj) addons += 100;
  if (booking.extras?.photographer) addons += 200;

  const total = BASE_PRICE + surcharge + addons;
  const deposit = Math.ceil(total * 0.5);

  return { total, deposit, surcharge, addons };
}

// ============================================
// Apps Script Webhook
// ============================================

async function triggerAppsScript(action, data, env, options = {}) {
  // Skip email in test mode
  if (options.testMode) {
    console.log(`[TEST MODE] Skipping email: ${action}`);
    return { skipped: true, action };
  }

  if (!env.APPS_SCRIPT_WEBHOOK) {
    console.log('Apps Script webhook not configured, skipping email');
    return;
  }

  try {
    await fetch(env.APPS_SCRIPT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data }),
    });
  } catch (error) {
    console.error('Apps Script trigger failed:', error);
  }
}

// Helper to detect test mode from request
function isTestMode(request) {
  const url = new URL(request.url);
  return url.searchParams.get('test') === '1' || url.searchParams.get('test') === 'true';
}

// ============================================
// Integration Script (served to frontend)
// ============================================

function getIntegrationScript() {
  return `
/**
 * HB Booking Frontend Integration
 * Auto-loaded from API server
 */

(function() {
  const API_BASE = 'https://hb-booking.nicholasfcoker.workers.dev';
  const TEST_MODE = new URLSearchParams(window.location.search).get('test') === '1';

  // Show test mode banner
  if (TEST_MODE) {
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.createElement('div');
      banner.innerHTML = '<div style="background: #f59e0b; color: #000; padding: 8px 16px; text-align: center; font-weight: 600; font-size: 14px;">🧪 TEST MODE - Emails will NOT be sent</div>';
      document.body.insertBefore(banner.firstChild, document.body.firstChild);
    });
  }

  // Override functions that set button text and change button text on load
  document.addEventListener('DOMContentLoaded', () => {
    // Initial button text change
    const payBtn = document.querySelector('.btn-primary[onclick="showConfirmation()"]');
    if (payBtn) {
      payBtn.textContent = 'Submit Booking Request';
    }

    // Store original functions
    const originalUpdateDeposit = window.updateDepositAmount;
    const originalResetDemo = window.resetDemo;

    // Override updateDepositAmount to keep "Submit Booking Request"
    if (originalUpdateDeposit) {
      window.updateDepositAmount = function() {
        originalUpdateDeposit();
        const btn = document.querySelector('.btn-primary[onclick="showConfirmation()"]');
        if (btn) btn.textContent = 'Submit Booking Request';
      };
    }

    // Override resetDemo to keep "Submit Booking Request"
    if (originalResetDemo) {
      window.resetDemo = function() {
        originalResetDemo();
        const btn = document.querySelector('.btn-primary[onclick="showConfirmation()"]');
        if (btn) btn.textContent = 'Submit Booking Request';
      };
    }
  });

  // Helper: get time slot ID from start time
  function getTimeSlotId(startTime) {
    const slotMap = { '12:00': 'morning', '14:00': 'afternoon', '16:00': 'evening', '18:00': 'latenight' };
    return slotMap[startTime] || 'afternoon';
  }

  // Helper: get selected extras
  function getSelectedExtras() {
    const extras = {};
    const cateringCb = document.getElementById('extraCatering');
    const djCb = document.getElementById('extraDJ');
    const photographerCb = document.getElementById('extraPhotographer');
    if (cateringCb?.checked) extras.catering = true;
    if (djCb?.checked) extras.dj = true;
    if (photographerCb?.checked) extras.photographer = true;
    return extras;
  }

  // Override showConfirmation to submit to API
  window.showConfirmation = async function() {
    const submitBtn = document.querySelector('.btn-primary[onclick="showConfirmation()"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const bookingData = {
        eventType: window.eventTypeLabels?.[window.selectedEventType] || window.selectedEventType,
        date: window.selectedDate,
        timeSlot: getTimeSlotId(window.selectedTimeStart),
        guestCount: window.selectedGuests,
        name: document.getElementById('inputName').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        phone: document.getElementById('inputPhone').value.trim(),
        extras: getSelectedExtras(),
      };

      const apiUrl = TEST_MODE ? API_BASE + '/api/bookings?test=1' : API_BASE + '/api/bookings';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === 'slot_taken') {
          showSlotTakenModal(result.alternatives);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }
        throw new Error(result.error || 'Booking failed');
      }

      showBookingSuccess(result);

    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Sorry, something went wrong. Please try again or contact us directly.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  };

  // Success screen
  function showBookingSuccess(result) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('progressBar').style.display = 'none';

    const step9 = document.getElementById('step9');
    step9.innerHTML = \`
      <div class="success-screen">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke="#10b981"/>
            <path d="M8 12l3 3 5-5" stroke="#10b981" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h2 style="color: #10b981; margin: 16px 0 8px;">Booking Request Received!</h2>
        <p style="color: #888; margin-bottom: 24px;">Complete your payment to confirm</p>

        <div class="booking-reference" style="background: #1a1a2e; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
          <div style="color: #666; font-size: 12px; margin-bottom: 4px;">Booking Reference</div>
          <div style="font-family: monospace; font-size: 20px; color: #fff;">\${result.bookingId}</div>
          \${result.testMode ? '<div style="color: #f59e0b; font-size: 11px; margin-top: 8px;">🧪 Test booking - no email sent</div>' : ''}
        </div>

        <div class="payment-box" style="background: linear-gradient(135deg, #7c3aed22, #c084fc22); border: 1px solid #7c3aed44; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <div style="font-size: 14px; color: #c084fc; margin-bottom: 12px;">Transfer to confirm your booking</div>

          <div style="display: grid; gap: 12px; text-align: left;">
            <div>
              <div style="color: #666; font-size: 11px;">Account Name</div>
              <div style="color: #fff; font-family: monospace;">\${result.bankDetails.accountName}</div>
            </div>
            <div>
              <div style="color: #666; font-size: 11px;">Sort Code</div>
              <div style="color: #fff; font-family: monospace;">\${result.bankDetails.sortCode}</div>
            </div>
            <div>
              <div style="color: #666; font-size: 11px;">Account Number</div>
              <div style="color: #fff; font-family: monospace;">\${result.bankDetails.accountNumber}</div>
            </div>
            <div>
              <div style="color: #666; font-size: 11px;">Reference (important!)</div>
              <div style="color: #10b981; font-family: monospace; font-weight: 600;">\${result.bookingId}</div>
            </div>
          </div>

          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #7c3aed44;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #888;">Deposit due now</span>
              <span style="color: #10b981; font-weight: 600; font-size: 18px;">£\${result.deposit}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-size: 12px;">Total</span>
              <span style="color: #666; font-size: 12px;">£\${result.total}</span>
            </div>
          </div>
        </div>

        <div class="next-steps" style="background: #252542; padding: 16px; border-radius: 12px; text-align: left;">
          <div style="color: #fff; font-weight: 500; margin-bottom: 12px;">What happens next?</div>
          <ul style="color: #888; padding-left: 20px; line-height: 1.8; margin: 0;">
            <li>Check your email for the invoice</li>
            <li>Transfer the deposit using the reference above</li>
            <li>We'll confirm within 4 hours of payment clearing</li>
            <li>Weekend transfers confirmed by Monday 10am</li>
          </ul>
        </div>

        <button class="btn btn-secondary" style="margin-top: 24px;" onclick="location.reload()">
          Book Another Event
        </button>
      </div>
    \`;

    step9.classList.add('active');
  }

  // Slot taken modal
  function showSlotTakenModal(alternatives) {
    const existing = document.getElementById('slotTakenModal');
    if (existing) existing.remove();

    const alternativesHtml = alternatives.length > 0
      ? alternatives.map(slot => \`
          <button class="alt-slot-btn" onclick="window._selectAlternativeSlot('\${slot.id}', '\${slot.label}')">
            <span class="slot-time">\${slot.label}</span>
            \${slot.surcharge > 0 ? \`<span class="slot-surcharge">+£\${slot.surcharge}</span>\` : ''}
          </button>
        \`).join('')
      : '<p style="color: #888;">No other slots available for this date. Please try another date.</p>';

    const modal = document.createElement('div');
    modal.id = 'slotTakenModal';
    modal.innerHTML = \`
      <div class="modal-backdrop" onclick="window._closeSlotTakenModal()"></div>
      <div class="modal-content">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#f59e0b" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 style="color: #fff; margin: 16px 0 8px;">This slot was just booked</h3>
        <p style="color: #888; margin-bottom: 20px;">Someone else completed their booking while you were filling out the form.</p>
        <div class="alternatives-section">
          <div style="color: #c084fc; font-size: 14px; margin-bottom: 12px;">Available times for this date:</div>
          <div class="alternatives-list">\${alternativesHtml}</div>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="window._closeSlotTakenModal(); goToStep(4);">
            Choose Different Date
          </button>
        </div>
      </div>
    \`;

    if (!document.getElementById('modalStyles')) {
      const styles = document.createElement('style');
      styles.id = 'modalStyles';
      styles.textContent = \`
        #slotTakenModal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.8); }
        .modal-content { position: relative; background: #1a1a2e; border-radius: 16px; padding: 24px; max-width: 400px; width: 100%; text-align: center; border: 1px solid #333; }
        .alternatives-list { display: flex; flex-direction: column; gap: 8px; }
        .alt-slot-btn { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #252542; border: 1px solid #333; border-radius: 8px; color: #fff; cursor: pointer; transition: all 0.2s; }
        .alt-slot-btn:hover { background: #333; border-color: #7c3aed; }
        .slot-surcharge { color: #f59e0b; font-size: 12px; }
      \`;
      document.head.appendChild(styles);
    }

    document.body.appendChild(modal);
  }

  window._closeSlotTakenModal = function() {
    const modal = document.getElementById('slotTakenModal');
    if (modal) modal.remove();
  };

  window._selectAlternativeSlot = function(slotId, slotLabel) {
    const slotTimes = {
      'morning': { start: '12:00', end: '18:00' },
      'afternoon': { start: '14:00', end: '20:00' },
      'evening': { start: '16:00', end: '22:00' },
      'latenight': { start: '18:00', end: '00:00' },
    };
    const times = slotTimes[slotId];
    if (times) {
      window.selectedTimeStart = times.start;
      window.selectedTimeEnd = times.end;
      window.selectedTimeLabel = slotLabel;
      document.getElementById('summaryTime').textContent = slotLabel;
    }
    window._closeSlotTakenModal();
    window.showConfirmation();
  };

  // ============================================
  // Live Availability Checking
  // ============================================

  async function fetchAvailability(date) {
    try {
      const response = await fetch(API_BASE + '/api/availability?date=' + date);
      if (!response.ok) throw new Error('Failed to fetch availability');
      return await response.json();
    } catch (error) {
      console.error('Availability check failed:', error);
      return null;
    }
  }

  function updateTimeSlotAvailability(slots) {
    // Find time slot elements and update availability
    document.querySelectorAll('.time-option, .time-slot').forEach(card => {
      const startTime = card.dataset?.start || card.getAttribute('data-start');
      if (!startTime) return;

      const slot = slots.find(s => s.start === startTime);

      if (slot && !slot.available) {
        card.classList.add('unavailable');
        card.style.opacity = '0.4';
        card.style.pointerEvents = 'none';

        // Add "Booked" label if not already present
        if (!card.querySelector('.booked-label')) {
          const label = document.createElement('span');
          label.className = 'booked-label';
          label.textContent = 'Booked';
          label.style.cssText = 'position: absolute; top: 8px; right: 8px; background: #ef4444; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px;';
          card.style.position = 'relative';
          card.appendChild(label);
        }
      } else {
        card.classList.remove('unavailable');
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        const label = card.querySelector('.booked-label');
        if (label) label.remove();
      }
    });
  }

  // Override selectDate to fetch live availability
  document.addEventListener('DOMContentLoaded', () => {
    const originalSelectDate = window.selectDate;
    if (typeof originalSelectDate === 'function') {
      window.selectDate = async function(dateStr, dateObj, element) {
        // Call original selection logic
        originalSelectDate(dateStr, dateObj, element);

        // Show loading state on time slots
        document.querySelectorAll('.time-option, .time-slot').forEach(card => {
          card.style.opacity = '0.6';
        });

        // Fetch live availability
        const availability = await fetchAvailability(dateStr);
        if (availability && availability.slots) {
          updateTimeSlotAvailability(availability.slots);
        } else {
          // Reset all slots to available if fetch fails
          document.querySelectorAll('.time-option, .time-slot').forEach(card => {
            card.style.opacity = '1';
          });
        }
      };
    }
  });

  console.log('HB Booking Integration loaded. API:', API_BASE, TEST_MODE ? '(TEST MODE)' : '');
})();
`;
}

// ============================================
// API Routes
// ============================================

// Health check
router.get('/api/health', () => json({ status: 'ok', service: 'hb-booking' }));

// Serve integration script
router.get('/integration.js', () => {
  const script = getIntegrationScript();
  return new Response(script, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=300', // 5 min cache
    },
  });
});

// Get availability for a date
router.get('/api/availability', async (request, env) => {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ error: 'Invalid date format. Use YYYY-MM-DD' }, 400);
  }

  try {
    const slots = await checkAvailability(date, env);
    return json({ date, slots });
  } catch (error) {
    console.error('Availability check failed:', error);
    return json({ error: 'Failed to check availability' }, 500);
  }
});

// Create a booking
router.post('/api/bookings', async (request, env) => {
  try {
    const body = await request.json();
    const testMode = isTestMode(request) || body.test === true;

    // Validate required fields
    const required = ['name', 'email', 'phone', 'date', 'timeSlot', 'eventType', 'guestCount'];
    for (const field of required) {
      if (!body[field]) {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    // Re-check availability (collision protection)
    const slots = await checkAvailability(body.date, env);
    const selectedSlot = slots.find(s => s.id === body.timeSlot);

    if (!selectedSlot?.available) {
      // Slot no longer available - return alternatives
      const alternatives = slots.filter(s => s.available).slice(0, 3);
      return json({
        error: 'slot_taken',
        message: 'This slot was just booked by another customer.',
        alternatives,
      }, 409);
    }

    // Calculate pricing
    const pricing = calculatePrice(body);

    // Generate booking ID
    const bookingId = `HB-${Date.now().toString(36).toUpperCase()}`;

    const booking = {
      id: bookingId,
      ...body,
      ...pricing,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Create calendar event
    const calendarEvent = await createProvisionalEvent(booking, env);
    booking.calendarEventId = calendarEvent.id;

    // Store in KV
    await env.BOOKINGS.put(bookingId, JSON.stringify(booking), {
      expirationTtl: 60 * 60 * 24 * 90, // 90 days
    });

    // Trigger invoice email via Apps Script (skipped in test mode)
    await triggerAppsScript('invoice', {
      bookingId: booking.id,
      clientName: booking.name,
      clientEmail: booking.email,
      clientPhone: booking.phone,
      eventType: booking.eventType,
      eventDate: booking.date,
      timeSlot: selectedSlot.label,
      guestCount: booking.guestCount,
      total: booking.total,
      deposit: booking.deposit,
    }, env, { testMode });

    return json({
      success: true,
      bookingId: booking.id,
      total: booking.total,
      deposit: booking.deposit,
      testMode, // Include test mode flag in response
      bankDetails: {
        accountName: 'Hibiscus Studio Limited',
        sortCode: '04-06-05',
        accountNumber: '26606862',
        reference: booking.id,
      },
    });

  } catch (error) {
    console.error('Booking creation failed:', error);
    return json({ error: 'Failed to create booking' }, 500);
  }
});

// Get booking status
router.get('/api/bookings/:id', async (request, env) => {
  const { id } = request.params;

  const bookingData = await env.BOOKINGS.get(id);
  if (!bookingData) {
    return json({ error: 'Booking not found' }, 404);
  }

  const booking = JSON.parse(bookingData);
  return json({
    id: booking.id,
    status: booking.status,
    eventType: booking.eventType,
    date: booking.date,
    total: booking.total,
    deposit: booking.deposit,
  });
});

// Confirm a booking (called from admin dashboard)
router.post('/api/bookings/:id/confirm', async (request, env) => {
  const { id } = request.params;
  const testMode = isTestMode(request);

  // Check admin auth (cookie or header)
  const authCookie = request.headers.get('Cookie')?.match(/hb_admin_key=([^;]+)/)?.[1];
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (authCookie !== env.ADMIN_KEY && authHeader !== env.ADMIN_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const bookingData = await env.BOOKINGS.get(id);
  if (!bookingData) {
    return json({ error: 'Booking not found' }, 404);
  }

  const booking = JSON.parse(bookingData);

  if (booking.status === 'confirmed') {
    return json({ error: 'Booking already confirmed' }, 400);
  }

  // Update calendar event
  await confirmEvent(booking.calendarEventId, booking, env);

  // Update booking status
  booking.status = 'confirmed';
  booking.confirmedAt = new Date().toISOString();
  await env.BOOKINGS.put(id, JSON.stringify(booking));

  // Send confirmation email (skipped in test mode)
  await triggerAppsScript('confirmation', {
    bookingId: booking.id,
    clientName: booking.name,
    clientEmail: booking.email,
    eventType: booking.eventType,
    eventDate: booking.date,
  }, env, { testMode });

  return json({ success: true, message: 'Booking confirmed', testMode });
});

// Cancel a booking (policy-aware)
router.post('/api/bookings/:id/cancel', async (request, env) => {
  const { id } = request.params;
  const testMode = isTestMode(request);

  // Check admin auth
  const authCookie = request.headers.get('Cookie')?.match(/hb_admin_key=([^;]+)/)?.[1];
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (authCookie !== env.ADMIN_KEY && authHeader !== env.ADMIN_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const bookingData = await env.BOOKINGS.get(id);
  if (!bookingData) {
    return json({ error: 'Booking not found' }, 404);
  }

  const booking = JSON.parse(bookingData);

  // Calculate days until event
  const eventDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  // Determine refund based on policy
  let refundAmount = 0;
  let refundType = 'none';
  let policyMessage = '';

  if (daysUntil >= 7) {
    // 7+ days: deposit forfeited, balance refunded
    if (booking.status === 'confirmed' && booking.balancePaid) {
      refundAmount = booking.total - booking.deposit;
      refundType = 'balance';
      policyMessage = `Cancelled with ${daysUntil} days notice. Deposit (£${booking.deposit}) forfeited. Balance (£${refundAmount}) to be refunded.`;
    } else {
      policyMessage = `Cancelled with ${daysUntil} days notice. Deposit (£${booking.deposit}) forfeited. No additional refund due.`;
    }
  } else {
    // <7 days: everything forfeited
    policyMessage = `Cancelled with ${daysUntil} days notice. Per our policy, no refund is available for cancellations with less than 7 days notice.`;
  }

  // Delete calendar event
  try {
    await deleteCalendarEvent(booking.calendarEventId, env);
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
  }

  // Update booking status
  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  booking.cancellationPolicy = { daysUntil, refundAmount, refundType };
  await env.BOOKINGS.put(id, JSON.stringify(booking));

  // Send cancellation email (skipped in test mode)
  await triggerAppsScript('cancellation', {
    bookingId: booking.id,
    clientName: booking.name,
    clientEmail: booking.email,
    eventType: booking.eventType,
    eventDate: booking.date,
    refundAmount,
    refundType,
    policyMessage,
    requestBankDetails: refundAmount > 0,
  }, env, { testMode });

  return json({
    success: true,
    message: 'Booking cancelled',
    testMode,
    policy: { daysUntil, refundAmount, refundType, policyMessage },
  });
});

// Change booking date (policy-aware)
router.post('/api/bookings/:id/change-date', async (request, env) => {
  const { id } = request.params;
  const testMode = isTestMode(request);

  // Check admin auth
  const authCookie = request.headers.get('Cookie')?.match(/hb_admin_key=([^;]+)/)?.[1];
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (authCookie !== env.ADMIN_KEY && authHeader !== env.ADMIN_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const body = await request.json();
  const { newDate, newTimeSlot } = body;

  if (!newDate || !newTimeSlot) {
    return json({ error: 'newDate and newTimeSlot are required' }, 400);
  }

  const bookingData = await env.BOOKINGS.get(id);
  if (!bookingData) {
    return json({ error: 'Booking not found' }, 404);
  }

  const booking = JSON.parse(bookingData);

  // Check if this is the second change (treat as cancellation)
  if (booking.dateChangeCount >= 1) {
    return json({
      error: 'second_change',
      message: 'This is the second date change request. Per policy, this should be treated as a cancellation.',
    }, 400);
  }

  // Calculate days until original event
  const eventDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  // Determine fee
  let changeFee = 0;
  let feeMessage = '';

  if (daysUntil >= 7) {
    feeMessage = 'Free date change (7+ days notice).';
  } else {
    changeFee = 50;
    feeMessage = `£50 rebooking fee applies (${daysUntil} days notice).`;
  }

  // Check new slot availability
  const slots = await checkAvailability(newDate, env);
  const selectedSlot = slots.find(s => s.id === newTimeSlot);

  if (!selectedSlot?.available) {
    const alternatives = slots.filter(s => s.available).slice(0, 3);
    return json({
      error: 'slot_unavailable',
      message: 'The requested slot is not available.',
      alternatives,
    }, 409);
  }

  // Delete old calendar event
  try {
    await deleteCalendarEvent(booking.calendarEventId, env);
  } catch (error) {
    console.error('Failed to delete old calendar event:', error);
  }

  // Update booking with new date
  const oldDate = booking.date;
  booking.date = newDate;
  booking.timeSlot = newTimeSlot;
  booking.dateChangeCount = (booking.dateChangeCount || 0) + 1;
  booking.dateChangeHistory = booking.dateChangeHistory || [];
  booking.dateChangeHistory.push({
    from: oldDate,
    to: newDate,
    fee: changeFee,
    changedAt: new Date().toISOString(),
  });

  // Create new calendar event
  const calendarEvent = await createProvisionalEvent({
    ...booking,
    id: booking.id,
  }, env);
  booking.calendarEventId = calendarEvent.id;

  // If booking was confirmed, update new event to confirmed
  if (booking.status === 'confirmed') {
    await confirmEvent(booking.calendarEventId, booking, env);
  }

  await env.BOOKINGS.put(id, JSON.stringify(booking));

  // Send date change email (skipped in test mode)
  await triggerAppsScript('date_change', {
    bookingId: booking.id,
    clientName: booking.name,
    clientEmail: booking.email,
    eventType: booking.eventType,
    oldDate,
    newDate,
    newTimeSlot: selectedSlot.label,
    changeFee,
    feeMessage,
  }, env, { testMode });

  return json({
    success: true,
    message: 'Date changed successfully',
    testMode,
    policy: { daysUntil, changeFee, feeMessage },
    newDate,
    newTimeSlot,
  });
});

// ============================================
// Admin Routes
// ============================================

// Admin login (sets cookie)
router.get('/admin/login', async (request, env) => {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (key !== env.ADMIN_KEY) {
    return html('<h1>Invalid admin key</h1>', 401);
  }

  // Set secure cookie and redirect to admin
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': `hb_admin_key=${key}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`,
      'Location': '/admin',
    },
  });
});

// Admin dashboard
router.get('/admin', async (request, env) => {
  // Check auth
  const authCookie = request.headers.get('Cookie')?.match(/hb_admin_key=([^;]+)/)?.[1];

  if (authCookie !== env.ADMIN_KEY) {
    return html(`
      <html>
        <head><title>HB Admin - Login Required</title></head>
        <body style="font-family: system-ui; padding: 40px; text-align: center;">
          <h1>Admin Access Required</h1>
          <p>Please use your admin login link to access this page.</p>
        </body>
      </html>
    `, 401);
  }

  // Get bookings from KV
  const bookingsList = await env.BOOKINGS.list();
  const kvBookings = [];
  const kvCalendarIds = new Set();

  for (const key of bookingsList.keys) {
    const data = await env.BOOKINGS.get(key.name);
    if (data) {
      const booking = JSON.parse(data);
      booking.fromKV = true;
      kvBookings.push(booking);
      if (booking.calendarEventId) {
        kvCalendarIds.add(booking.calendarEventId);
      }
    }
  }

  // Get ALL calendar events from both calendars
  let calendarEvents = [];
  try {
    calendarEvents = await getAllCalendarEvents(env);
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
  }

  // Filter out calendar events that already exist in KV (avoid duplicates)
  const uniqueCalendarEvents = calendarEvents.filter(
    event => !kvCalendarIds.has(event.calendarEventId)
  );

  // Merge: KV bookings + unique calendar events
  const allBookings = [...kvBookings, ...uniqueCalendarEvents];

  // Sort by event date (upcoming first), then by created date
  allBookings.sort((a, b) => {
    const dateA = new Date(a.date || a.startTime || '2099-12-31');
    const dateB = new Date(b.date || b.startTime || '2099-12-31');
    return dateA - dateB;
  });

  return html(generateAdminDashboard(allBookings, { calendarEventsCount: calendarEvents.length }));
});

// Get pending bookings as JSON (for AJAX refresh)
router.get('/api/admin/pending', async (request, env) => {
  const authCookie = request.headers.get('Cookie')?.match(/hb_admin_key=([^;]+)/)?.[1];
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (authCookie !== env.ADMIN_KEY && authHeader !== env.ADMIN_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const bookingsList = await env.BOOKINGS.list();
  const pendingBookings = [];

  for (const key of bookingsList.keys) {
    const data = await env.BOOKINGS.get(key.name);
    if (data) {
      const booking = JSON.parse(data);
      if (booking.status === 'pending') {
        pendingBookings.push(booking);
      }
    }
  }

  pendingBookings.sort((a, b) => new Date(a.date) - new Date(b.date));

  return json({ bookings: pendingBookings });
});

// ============================================
// Admin Dashboard HTML
// ============================================

function generateAdminDashboard(bookings, options = {}) {
  // Calculate stats
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Separate sources
  const kvBookings = bookings.filter(b => b.fromKV);
  const calendarOnlyBookings = bookings.filter(b => b.fromCalendar && !b.fromKV);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    fromKV: kvBookings.length,
    fromCalendar: calendarOnlyBookings.length,
    ytdBookings: bookings.filter(b => {
      const dateField = b.createdAt || b.date;
      return dateField && new Date(dateField).getFullYear() === currentYear && b.status !== 'cancelled';
    }).length,
    ytdRevenue: bookings.filter(b => {
      const dateField = b.createdAt || b.date;
      return dateField && new Date(dateField).getFullYear() === currentYear && b.status === 'confirmed';
    }).reduce((sum, b) => sum + (b.total || 300), 0),
    monthlyBreakdown: {},
  };

  // Calculate monthly breakdown for current year (using event date, not created date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((m, i) => { stats.monthlyBreakdown[m] = 0; });

  bookings.filter(b => {
    const eventDate = new Date(b.date);
    return eventDate.getFullYear() === currentYear && b.status !== 'cancelled';
  }).forEach(b => {
    const month = months[new Date(b.date).getMonth()];
    if (month) stats.monthlyBreakdown[month]++;
  });

  // Generate booking cards
  const pendingBookings = bookings.filter(b => b.status === 'pending').sort((a, b) => new Date(a.date) - new Date(b.date));
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').sort((a, b) => new Date(b.date) - new Date(a.date));
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').sort((a, b) => new Date(b.cancelledAt) - new Date(a.cancelledAt));

  // NEW: Action-first card design with inline confirm and source badge
  function generateBookingCard(b) {
    const eventDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    const dateChangeCount = b.dateChangeCount || 0;
    const isPending = b.status === 'pending';
    const isConfirmed = b.status === 'confirmed';
    const isCancelled = b.status === 'cancelled';
    const isCalendarOnly = b.fromCalendar && !b.fromKV;
    const isLegacy = b.calendarSource === 'hibiscusstudiouk';

    const statusClass = isPending ? 'pending' : isConfirmed ? 'confirmed' : 'cancelled';
    const daysLabel = daysUntil > 0 ? `${daysUntil}d` : daysUntil === 0 ? 'Today' : 'Past';
    const daysClass = daysUntil <= 2 ? 'urgent' : daysUntil <= 7 ? 'soon' : '';

    // Source badge text and class
    const sourceText = isCalendarOnly ? (isLegacy ? 'Legacy' : 'Cal') : 'API';
    const sourceClass = isCalendarOnly ? (isLegacy ? 'legacy' : 'cal') : 'api';

    // Month key for filtering (e.g., "2025-01")
    const monthKey = eventDate.toISOString().slice(0, 7);

    return `
    <article class="card ${statusClass}" data-id="${b.id}" data-status="${b.status}" data-month="${monthKey}">
      <div class="card-row">
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-name">${b.name || 'Unknown'}</h3>
            <span class="source-badge ${sourceClass}">${sourceText}</span>
          </div>
          <div class="card-info">
            <time class="card-date">${formatDate(b.date)}</time>
            ${b.total ? `<span class="card-sep">·</span><span class="card-price">£${b.total}</span>` : ''}
            ${!isCancelled ? `<span class="days-badge ${daysClass}">${daysLabel}</span>` : ''}
          </div>
          <div class="card-meta">
            <span>${b.eventType || 'Event'}</span>
            ${b.guestCount ? `<span>${b.guestCount} guests</span>` : ''}
          </div>
        </div>

        ${isPending && !isCalendarOnly ? `
        <button class="inline-confirm" onclick="confirmBooking('${b.id}')">
          <svg class="confirm-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="confirm-text">Confirm</span>
        </button>
        ` : ''}
      </div>

      ${b.email || b.phone ? `
      <div class="card-contact">
        ${b.email ? `<a href="mailto:${b.email}">${b.email}</a>` : ''}
        ${b.phone ? `<a href="tel:${b.phone}">${b.phone}</a>` : ''}
      </div>
      ` : ''}

      ${isCalendarOnly ? `
      <a href="https://calendar.google.com/calendar/u/0/r/eventedit/${b.calendarEventId || ''}" target="_blank" rel="noopener" class="cal-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open in Google Calendar
      </a>
      ` : ''}

      ${(isPending || isConfirmed) && !isCalendarOnly ? `
      <div class="card-actions">
        <button class="btn-secondary" onclick="showChangeDateModal('${b.id}', '${b.date}', ${daysUntil}, ${dateChangeCount})">
          ${isPending ? 'Change' : 'Change Date'}
        </button>
        <button class="btn-danger" onclick="showCancelModal('${b.id}', '${b.name}', '${b.date}', ${daysUntil}, ${b.deposit || 150}, ${b.total || 300})">
          Cancel
        </button>
      </div>
      ` : ''}

      ${isCancelled ? `
      <p class="cancelled-note">Cancelled ${formatDate(b.cancelledAt)}${b.cancellationPolicy?.refundAmount > 0 ? ` · Refund: £${b.cancellationPolicy.refundAmount}` : ''}</p>
      ` : ''}
    </article>
  `;
  }

  const pendingCards = pendingBookings.map(generateBookingCard).join('');
  const confirmedCards = confirmedBookings.map(generateBookingCard).join('');
  const cancelledCards = cancelledBookings.map(generateBookingCard).join('');

  // Generate unique months from confirmed bookings for filter
  const confirmedMonths = [...new Set(confirmedBookings.map(b => {
    const d = new Date(b.date);
    return d.toISOString().slice(0, 7);
  }))].sort().reverse();

  const monthFilterOptions = confirmedMonths.map(m => {
    const [year, month] = m.split('-');
    const label = new Date(year, parseInt(month) - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const count = confirmedBookings.filter(b => new Date(b.date).toISOString().slice(0, 7) === m).length;
    return `<button class="filter-btn" data-filter="${m}" onclick="filterByMonth('${m}')">${label} <span class="filter-count">${count}</span></button>`;
  }).join('');

  // Monthly chart data
  const maxMonthly = Math.max(...Object.values(stats.monthlyBreakdown), 1);
  const monthlyBars = months.slice(0, currentMonth + 1).map(m => {
    const count = stats.monthlyBreakdown[m];
    const height = Math.max((count / maxMonthly) * 100, 4);
    const isCurrentMonth = months.indexOf(m) === currentMonth;
    return `<div class="bar-col${isCurrentMonth ? ' current' : ''}">
      <div class="bar" style="height: ${height}%"></div>
      <span class="bar-val">${count}</span>
      <span class="bar-lbl">${m}</span>
    </div>`;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0f0f1a">
  <title>HB Studio Admin</title>
  <style>
    /* ========================================
       ACTION-FIRST LAYOUT
       Mobile: Sticky header + tabs, cards above fold
       Desktop: 60/40 two-column layout
       ======================================== */

    :root {
      /* Spacing scale (4pt base) */
      --sp-1: 4px;
      --sp-2: 8px;
      --sp-3: 12px;
      --sp-4: 16px;
      --sp-5: 20px;
      --sp-6: 24px;
      --sp-8: 32px;
      --sp-10: 40px;
      --sp-12: 48px;

      /* Colors */
      --bg-base: #0f0f1a;
      --bg-surface: #1a1a2e;
      --bg-elevated: #252545;
      --bg-overlay: rgba(0,0,0,0.85);

      --text-primary: #f5f5f7;
      --text-secondary: #a1a1aa;
      --text-muted: #71717a;

      --accent-primary: #8b5cf6;
      --accent-success: #10b981;
      --accent-warning: #f59e0b;
      --accent-danger: #ef4444;
      --accent-info: #3b82f6;

      /* Typography */
      --text-xs: 0.6875rem;
      --text-sm: 0.8125rem;
      --text-base: 1rem;
      --text-lg: 1.125rem;
      --text-xl: 1.5rem;

      /* Borders & Radius */
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
      --border-subtle: 1px solid rgba(255,255,255,0.08);

      /* Shadows */
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
      --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);

      --touch-min: 44px;

      /* Sticky heights for offset */
      --header-height: 60px;
      --tabs-height: 52px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; -webkit-text-size-adjust: 100%; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
      background: var(--bg-base);
      color: var(--text-primary);
      line-height: 1.5;
      min-height: 100dvh;
    }

    /* ========================================
       STICKY HEADER with Pending Badge
       ======================================== */

    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-base);
      border-bottom: var(--border-subtle);
      padding: var(--sp-3) var(--sp-4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--header-height);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--sp-3);
    }

    .logo {
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--text-primary);
    }

    .pending-badge {
      display: ${stats.pending > 0 ? 'flex' : 'none'};
      align-items: center;
      gap: var(--sp-1);
      background: var(--accent-warning);
      color: #000;
      padding: var(--sp-1) var(--sp-2);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 700;
      animation: pulse-badge 2s infinite;
    }

    @keyframes pulse-badge {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--sp-2);
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--touch-min);
      height: var(--touch-min);
      background: var(--bg-surface);
      border: var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: var(--text-lg);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-icon:hover { background: var(--bg-elevated); color: var(--text-primary); }
    .btn-icon:active { transform: scale(0.95); }

    /* ========================================
       STICKY TABS (below header)
       ======================================== */

    .tabs-bar {
      position: sticky;
      top: var(--header-height);
      z-index: 99;
      background: var(--bg-base);
      padding: var(--sp-2) var(--sp-4);
      display: flex;
      gap: var(--sp-2);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      border-bottom: var(--border-subtle);
    }
    .tabs-bar::-webkit-scrollbar { display: none; }

    .tab {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-2);
      padding: var(--sp-2) var(--sp-4);
      min-height: 36px;
      background: var(--bg-surface);
      border: var(--border-subtle);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .tab:hover { background: var(--bg-elevated); color: var(--text-primary); }
    .tab.active { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }

    .tab .count {
      background: rgba(255,255,255,0.2);
      padding: 2px var(--sp-2);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-variant-numeric: tabular-nums;
    }

    .tab.pending-tab .count {
      background: var(--accent-warning);
      color: #000;
    }

    /* ========================================
       MAIN LAYOUT: Mobile single column
       Desktop: Two-column 60/40
       ======================================== */

    .main-layout {
      display: flex;
      flex-direction: column;
      min-height: calc(100dvh - var(--header-height) - var(--tabs-height));
    }

    .bookings-panel {
      flex: 1;
      padding: var(--sp-4);
      padding-bottom: calc(var(--sp-12) + 60px); /* Space for drawer handle */
    }

    .context-panel {
      display: none; /* Hidden on mobile - use drawer */
    }

    @media (min-width: 900px) {
      .main-layout {
        flex-direction: row;
        min-height: calc(100dvh - var(--header-height) - var(--tabs-height));
      }

      .bookings-panel {
        flex: 0 0 60%;
        max-width: 60%;
        padding: var(--sp-6);
        padding-bottom: var(--sp-6);
        overflow-y: auto;
        max-height: calc(100dvh - var(--header-height) - var(--tabs-height));
      }

      .context-panel {
        display: block;
        flex: 0 0 40%;
        max-width: 40%;
        background: var(--bg-surface);
        border-left: var(--border-subtle);
        padding: var(--sp-6);
        overflow-y: auto;
        max-height: calc(100dvh - var(--header-height) - var(--tabs-height));
      }

      /* Hide mobile drawer on desktop */
      .drawer { display: none !important; }
    }

    /* ========================================
       BOOKING CARDS - Compact, Action-First
       ======================================== */

    .list { display: block; }
    .list.hidden { display: none; }

    .cards {
      display: flex;
      flex-direction: column;
      gap: var(--sp-3);
    }

    .card {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: var(--sp-4);
      border-left: 4px solid var(--accent-warning);
    }
    .card.confirmed { border-left-color: var(--accent-success); }
    .card.cancelled { border-left-color: var(--text-muted); opacity: 0.6; }

    .card-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--sp-3);
    }

    .card-content { flex: 1; min-width: 0; }

    .card-header {
      display: flex;
      align-items: center;
      gap: var(--sp-2);
      margin-bottom: var(--sp-1);
    }

    .card-name {
      font-size: var(--text-base);
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .source-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .source-badge.api { background: rgba(16,185,129,0.15); color: var(--accent-success); }
    .source-badge.cal { background: rgba(59,130,246,0.15); color: var(--accent-info); }
    .source-badge.legacy { background: rgba(245,158,11,0.15); color: var(--accent-warning); }

    .card-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--sp-1);
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin-bottom: var(--sp-2);
    }

    .card-sep { color: var(--text-muted); }

    .card-price {
      color: var(--accent-success);
      font-weight: 600;
    }

    .days-badge {
      background: var(--bg-elevated);
      padding: 1px 6px;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: 600;
      margin-left: auto;
    }
    .days-badge.urgent { background: rgba(239,68,68,0.2); color: var(--accent-danger); }
    .days-badge.soon { background: rgba(245,158,11,0.2); color: var(--accent-warning); }

    .card-meta {
      display: flex;
      gap: var(--sp-2);
      font-size: var(--text-xs);
      color: var(--text-muted);
    }

    /* Inline Confirm Button - the star of the show */
    .inline-confirm {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 64px;
      padding: var(--sp-3);
      background: var(--accent-success);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .inline-confirm:hover { background: #059669; transform: scale(1.02); }
    .inline-confirm:active { transform: scale(0.98); }
    .inline-confirm:disabled { background: var(--text-muted); cursor: not-allowed; transform: none; }

    .confirm-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .confirm-text { font-size: 10px; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.03em; }

    /* Desktop: Horizontal confirm button */
    @media (min-width: 900px) {
      .inline-confirm {
        flex-direction: row;
        gap: var(--sp-2);
        min-width: auto;
        padding: var(--sp-3) var(--sp-4);
      }
      .confirm-icon { width: 16px; height: 16px; }
      .confirm-text { margin-top: 0; font-size: 13px; }
    }

    .card-contact {
      margin-top: var(--sp-3);
      padding-top: var(--sp-3);
      border-top: var(--border-subtle);
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-2);
    }
    .card-contact a {
      font-size: var(--text-sm);
      color: var(--accent-info);
      text-decoration: none;
    }
    .card-contact a:hover { text-decoration: underline; }

    .cal-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--sp-2);
      margin-top: var(--sp-3);
      padding: var(--sp-3);
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.3);
      border-radius: var(--radius-md);
      color: var(--accent-info);
      font-size: var(--text-sm);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .cal-link:hover {
      background: rgba(59,130,246,0.2);
      border-color: var(--accent-info);
    }
    .cal-link:active { transform: scale(0.98); }

    .cancelled-note {
      margin-top: var(--sp-3);
      font-size: var(--text-sm);
      color: var(--text-muted);
      text-align: center;
    }

    .card-actions {
      display: flex;
      gap: var(--sp-2);
      margin-top: var(--sp-3);
      padding-top: var(--sp-3);
      border-top: var(--border-subtle);
    }

    .btn-secondary, .btn-danger {
      flex: 1;
      min-height: 36px;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-secondary);
    }
    .btn-secondary:hover { border-color: var(--accent-info); color: var(--accent-info); }
    .btn-danger:hover { border-color: var(--accent-danger); color: var(--accent-danger); }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      gap: var(--sp-2);
      margin-bottom: var(--sp-4);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: var(--sp-1);
    }
    .filter-bar::-webkit-scrollbar { display: none; }

    .filter-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-1);
      padding: var(--sp-2) var(--sp-3);
      background: var(--bg-surface);
      border: var(--border-subtle);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: var(--text-xs);
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .filter-btn:hover { background: var(--bg-elevated); color: var(--text-primary); }
    .filter-btn.active { background: var(--accent-success); border-color: var(--accent-success); color: #fff; }
    .filter-count {
      background: rgba(255,255,255,0.2);
      padding: 1px 6px;
      border-radius: var(--radius-full);
      font-size: 10px;
    }

    /* Empty State */
    .empty {
      text-align: center;
      padding: var(--sp-12) var(--sp-4);
      color: var(--text-muted);
    }
    .empty h3 { font-size: var(--text-lg); color: var(--text-secondary); margin-bottom: var(--sp-2); }

    /* ========================================
       BOTTOM DRAWER (Mobile Stats/Info)
       ======================================== */

    .drawer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border-top: var(--border-subtle);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      z-index: 50;
      transform: translateY(calc(100% - 56px));
      transition: transform 0.3s ease;
      max-height: 70vh;
      overflow: hidden;
    }
    .drawer.open { transform: translateY(0); }

    .drawer-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--sp-4);
      cursor: pointer;
      user-select: none;
    }

    .drawer-handle::before {
      content: '';
      width: 36px;
      height: 4px;
      background: var(--text-muted);
      border-radius: 2px;
    }

    .drawer-handle-text {
      position: absolute;
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }

    .drawer-content {
      padding: 0 var(--sp-4) var(--sp-6);
      overflow-y: auto;
      max-height: calc(70vh - 56px);
    }

    /* Stats Grid */
    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--sp-3);
      margin-bottom: var(--sp-5);
    }

    .stat {
      background: var(--bg-elevated);
      border-radius: var(--radius-md);
      padding: var(--sp-3);
      text-align: center;
    }

    .stat-val {
      font-size: var(--text-xl);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      line-height: 1.2;
    }
    .stat-val.pending { color: var(--accent-warning); }
    .stat-val.confirmed { color: var(--accent-success); }
    .stat-val.revenue { color: var(--accent-primary); }

    .stat-lbl {
      font-size: var(--text-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: var(--sp-1);
    }

    /* Chart */
    .chart-wrap {
      background: var(--bg-elevated);
      border-radius: var(--radius-md);
      padding: var(--sp-4);
      margin-bottom: var(--sp-5);
    }

    .chart-title {
      font-size: var(--text-sm);
      color: var(--text-muted);
      margin-bottom: var(--sp-3);
    }

    .chart {
      display: flex;
      align-items: flex-end;
      height: 60px;
      gap: var(--sp-1);
    }

    .bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .bar {
      width: 100%;
      background: linear-gradient(to top, var(--accent-primary), #a78bfa);
      border-radius: 2px 2px 0 0;
      min-height: 4px;
    }
    .bar-col.current .bar { background: linear-gradient(to top, var(--accent-success), #34d399); }

    .bar-val { font-size: 10px; color: var(--text-muted); }
    .bar-lbl { font-size: 9px; color: var(--text-muted); }

    /* Info Section */
    .info-section { margin-bottom: var(--sp-4); }
    .info-section h3 {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin-bottom: var(--sp-3);
    }

    .info-list {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }
    .info-list li { margin-bottom: var(--sp-2); }
    .info-list strong { color: var(--text-secondary); }

    /* Copy buttons */
    .copy-items { display: flex; flex-direction: column; gap: var(--sp-2); }
    .copy-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-2);
      width: 100%;
      padding: var(--sp-3);
      background: var(--bg-elevated);
      border: var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    .copy-btn:hover { background: var(--bg-base); color: var(--text-primary); }
    .copy-btn:active { transform: scale(0.98); }
    .copy-btn.copied { background: rgba(16,185,129,0.2); border-color: var(--accent-success); }
    .copy-btn.copied .copy-icon { color: var(--accent-success); }
    .copy-text { flex: 1; }
    .copy-icon { flex-shrink: 0; opacity: 0.5; }
    .copy-btn:hover .copy-icon { opacity: 1; }

    /* ========================================
       CONTEXT PANEL (Desktop Sidebar)
       ======================================== */

    .context-panel h2 {
      font-size: var(--text-base);
      margin-bottom: var(--sp-4);
      color: var(--text-primary);
    }

    .context-panel .stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .context-panel .chart-wrap {
      background: var(--bg-base);
    }

    /* Flow Steps */
    .flow { display: flex; flex-direction: column; gap: var(--sp-3); }
    .flow-step { display: flex; gap: var(--sp-2); }
    .flow-num {
      width: 24px; height: 24px;
      background: var(--accent-primary);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: var(--text-xs);
      font-weight: 600;
      flex-shrink: 0;
    }
    .flow-text h4 { font-size: var(--text-sm); font-weight: 600; margin-bottom: 2px; }
    .flow-text p { font-size: var(--text-xs); color: var(--text-muted); }

    /* ========================================
       TOAST
       ======================================== */

    .toast {
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom) + 70px);
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--accent-success);
      color: #fff;
      padding: var(--sp-3) var(--sp-5);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1001;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    @media (min-width: 900px) {
      .toast { bottom: var(--sp-6); }
    }

    /* ========================================
       MODAL
       ======================================== */

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: var(--bg-overlay);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      padding: var(--sp-4);
    }
    @media (min-width: 600px) { .modal-overlay { align-items: center; } }

    .modal {
      background: var(--bg-surface);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      padding: var(--sp-6);
      width: 100%;
      max-width: 420px;
      max-height: 85vh;
      overflow-y: auto;
    }
    @media (min-width: 600px) { .modal { border-radius: var(--radius-lg); } }

    .modal h2 { font-size: var(--text-lg); margin-bottom: var(--sp-4); }

    .modal-info {
      background: var(--bg-elevated);
      padding: var(--sp-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--sp-4);
    }
    .modal-info p { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--sp-2); }
    .modal-info p:last-child { margin-bottom: 0; }

    .policy-box {
      background: var(--bg-elevated);
      border-left: 3px solid var(--accent-warning);
      padding: var(--sp-4);
      margin-bottom: var(--sp-4);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }
    .policy-box.refund { border-left-color: var(--accent-success); }
    .policy-box.no-refund { border-left-color: var(--accent-danger); }
    .policy-box p { font-size: var(--text-sm); color: var(--text-secondary); }

    .form-group { margin-bottom: var(--sp-4); }
    .form-group label { display: block; font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--sp-2); }
    .form-group input, .form-group select {
      width: 100%;
      min-height: var(--touch-min);
      padding: 0 var(--sp-4);
      background: var(--bg-elevated);
      border: var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: var(--text-base);
    }

    .modal-actions { display: flex; gap: var(--sp-3); margin-top: var(--sp-5); }
    .modal-btn {
      flex: 1;
      min-height: var(--touch-min);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
    }
    .modal-btn.secondary { background: var(--bg-elevated); color: var(--text-primary); }
    .modal-btn.danger { background: var(--accent-danger); color: #fff; }
    .modal-btn.primary { background: var(--accent-info); color: #fff; }
  </style>
</head>
<body>
  <!-- STICKY HEADER with Pending Badge -->
  <header class="header">
    <div class="header-left">
      <span class="logo">🌺 HB Studio</span>
      <span class="pending-badge">
        <span>${stats.pending}</span>
        <span>pending</span>
      </span>
    </div>
    <div class="header-right">
      <button class="btn-icon" onclick="toggleDrawer()" aria-label="Stats">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
      </button>
      <button class="btn-icon" onclick="location.reload()" aria-label="Refresh">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
      </button>
    </div>
  </header>

  <!-- STICKY TABS -->
  <nav class="tabs-bar">
    <button class="tab pending-tab active" data-tab="pending" onclick="showTab('pending')">
      Pending<span class="count">${stats.pending}</span>
    </button>
    <button class="tab" data-tab="confirmed" onclick="showTab('confirmed')">
      Confirmed<span class="count">${stats.confirmed}</span>
    </button>
    <button class="tab" data-tab="cancelled" onclick="showTab('cancelled')">
      Cancelled<span class="count">${stats.cancelled}</span>
    </button>
  </nav>

  <!-- MAIN LAYOUT -->
  <div class="main-layout">
    <!-- BOOKINGS PANEL (Primary - 60% on desktop) -->
    <main class="bookings-panel">
      <div id="pending-list" class="list">
        ${pendingBookings.length === 0 ? `
          <div class="empty">
            <h3>No pending bookings</h3>
            <p>All caught up! 🎉</p>
          </div>
        ` : `<div class="cards">${pendingCards}</div>`}
      </div>

      <div id="confirmed-list" class="list hidden">
        ${confirmedBookings.length === 0 ? `
          <div class="empty">
            <h3>No confirmed bookings</h3>
            <p>Confirmed bookings appear here</p>
          </div>
        ` : `
          <div class="filter-bar">
            <button class="filter-btn active" data-filter="all" onclick="filterByMonth('all')">All <span class="filter-count">${stats.confirmed}</span></button>
            ${monthFilterOptions}
          </div>
          <div class="cards">${confirmedCards}</div>
        `}
      </div>

      <div id="cancelled-list" class="list hidden">
        ${cancelledBookings.length === 0 ? `
          <div class="empty">
            <h3>No cancelled bookings</h3>
            <p>Cancelled bookings appear here</p>
          </div>
        ` : `<div class="cards">${cancelledCards}</div>`}
      </div>
    </main>

    <!-- CONTEXT PANEL (Desktop Sidebar - 40%) -->
    <aside class="context-panel">
      <h2>Overview</h2>

      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <div class="stat-val pending">${stats.pending}</div>
          <div class="stat-lbl">Pending</div>
        </div>
        <div class="stat">
          <div class="stat-val confirmed">${stats.confirmed}</div>
          <div class="stat-lbl">Confirmed</div>
        </div>
        <div class="stat">
          <div class="stat-val">${stats.ytdBookings}</div>
          <div class="stat-lbl">${currentYear} Total</div>
        </div>
        <div class="stat">
          <div class="stat-val revenue">£${stats.ytdRevenue.toLocaleString()}</div>
          <div class="stat-lbl">${currentYear} Revenue</div>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-wrap">
        <div class="chart-title">${currentYear} Bookings by Month</div>
        <div class="chart">${monthlyBars}</div>
      </div>

      <!-- Booking Flow -->
      <div class="info-section">
        <h3>Booking Flow</h3>
        <div class="flow">
          <div class="flow-step"><span class="flow-num">1</span><div class="flow-text"><h4>Customer Submits</h4><p>Form with date, time, type</p></div></div>
          <div class="flow-step"><span class="flow-num">2</span><div class="flow-text"><h4>Invoice Sent</h4><p>Email with bank details</p></div></div>
          <div class="flow-step"><span class="flow-num">3</span><div class="flow-text"><h4>Customer Pays</h4><p>50% deposit transfer</p></div></div>
          <div class="flow-step"><span class="flow-num">4</span><div class="flow-text"><h4>Admin Confirms</h4><p>Verify & click Confirm</p></div></div>
          <div class="flow-step"><span class="flow-num">5</span><div class="flow-text"><h4>Confirmation Sent</h4><p>Customer gets address</p></div></div>
        </div>
      </div>

      <!-- Policies -->
      <div class="info-section">
        <h3>Policies</h3>
        <ul class="info-list">
          <li><strong>7+ days:</strong> Deposit forfeit, balance refunded</li>
          <li><strong>&lt;7 days:</strong> No refund</li>
          <li><strong>1st change 7+ days:</strong> Free</li>
          <li><strong>1st change &lt;7 days:</strong> £50 fee</li>
          <li><strong>2nd change:</strong> Treated as cancellation</li>
        </ul>
      </div>

      <!-- Studio -->
      <div class="info-section">
        <h3>Studio</h3>
        <div class="copy-items">
          <button class="copy-btn" onclick="copyToClipboard('19 Peto St N, London E16 1DP', this)">
            <span class="copy-text">19 Peto St N, London E16 1DP</span>
            <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
          <button class="copy-btn" onclick="copyToClipboard('///dime.square.cost', this)">
            <span class="copy-text">///dime.square.cost</span>
            <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
        </div>
      </div>
    </aside>
  </div>

  <!-- MOBILE BOTTOM DRAWER -->
  <div class="drawer" id="drawer">
    <div class="drawer-handle" onclick="toggleDrawer()">
      <span class="drawer-handle-text">Stats & Info</span>
    </div>
    <div class="drawer-content">
      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <div class="stat-val pending">${stats.pending}</div>
          <div class="stat-lbl">Pending</div>
        </div>
        <div class="stat">
          <div class="stat-val confirmed">${stats.confirmed}</div>
          <div class="stat-lbl">Confirmed</div>
        </div>
        <div class="stat">
          <div class="stat-val">${stats.ytdBookings}</div>
          <div class="stat-lbl">${currentYear} Total</div>
        </div>
        <div class="stat">
          <div class="stat-val revenue">£${stats.ytdRevenue.toLocaleString()}</div>
          <div class="stat-lbl">Revenue</div>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-wrap">
        <div class="chart-title">${currentYear} Bookings by Month</div>
        <div class="chart">${monthlyBars}</div>
      </div>

      <!-- Quick Info -->
      <div class="info-section">
        <h3>Policies</h3>
        <ul class="info-list">
          <li><strong>7+ days:</strong> Deposit forfeit, balance refunded</li>
          <li><strong>&lt;7 days:</strong> No refund</li>
          <li><strong>Change fee &lt;7d:</strong> £50</li>
        </ul>
      </div>

      <div class="info-section">
        <h3>Studio</h3>
        <div class="copy-items">
          <button class="copy-btn" onclick="copyToClipboard('19 Peto St N, London E16 1DP', this)">
            <span class="copy-text">19 Peto St N, E16 1DP</span>
            <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
          <button class="copy-btn" onclick="copyToClipboard('///dime.square.cost', this)">
            <span class="copy-text">///dime.square.cost</span>
            <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    // Tab switching
    function showTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('[data-tab="'+tab+'"]').classList.add('active');
      document.querySelectorAll('.list').forEach(l => l.classList.add('hidden'));
      document.getElementById(tab+'-list').classList.remove('hidden');
    }

    // Mobile drawer toggle
    function toggleDrawer() {
      const drawer = document.getElementById('drawer');
      drawer.classList.toggle('open');
    }

    // Close drawer when clicking outside (on bookings)
    document.querySelector('.bookings-panel')?.addEventListener('click', () => {
      const drawer = document.getElementById('drawer');
      if (drawer?.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    });

    // Filter confirmed bookings by month
    function filterByMonth(month) {
      const cards = document.querySelectorAll('#confirmed-list .card');
      const btns = document.querySelectorAll('.filter-btn');

      btns.forEach(b => b.classList.remove('active'));
      document.querySelector('[data-filter="'+month+'"]')?.classList.add('active');

      cards.forEach(card => {
        if (month === 'all' || card.dataset.month === month) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Copy to clipboard
    async function copyToClipboard(text, btn) {
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        showToast('Copied: ' + text);
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch (e) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.classList.add('copied');
        showToast('Copied: ' + text);
        setTimeout(() => btn.classList.remove('copied'), 2000);
      }
    }

    async function confirmBooking(id) {
      const btn = document.querySelector('[data-id="'+id+'"] .btn-confirm');
      btn.disabled = true;
      btn.textContent = 'Confirming...';

      try {
        const res = await fetch('/api/bookings/'+id+'/confirm', {
          method: 'POST',
          credentials: 'include'
        });

        if (res.ok) {
          btn.textContent = 'Confirmed!';
          showToast('Booking confirmed');
          setTimeout(() => location.reload(), 1500);
        } else {
          throw new Error('Failed');
        }
      } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Confirm Payment';
        showToast('Error - try again');
      }
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3000);
    }

    function showCancelModal(id, name, date, days, deposit, total) {
      const isRefund = days >= 7;
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'cancelModal';
      modal.innerHTML = \`
        <div class="modal">
          <h2>Cancel Booking</h2>
          <div class="modal-info">
            <p><strong>\${name}</strong></p>
            <p>\${formatDateJS(date)}</p>
          </div>
          <div class="policy-box \${isRefund ? 'refund' : 'no-refund'}">
            <p><strong>\${days} days notice</strong></p>
            <p>\${isRefund
              ? 'Deposit (£'+deposit+') forfeit. Balance refunded if paid.'
              : 'No refund available (<7 days notice).'}</p>
          </div>
          <div class="modal-actions">
            <button class="modal-btn secondary" onclick="closeModal('cancelModal')">Keep</button>
            <button class="modal-btn danger" onclick="cancelBooking('\${id}')">Cancel</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
    }

    async function cancelBooking(id) {
      const btn = document.querySelector('#cancelModal .danger');
      btn.textContent = 'Cancelling...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/bookings/'+id+'/cancel', {
          method: 'POST',
          credentials: 'include'
        });

        if (res.ok) {
          closeModal('cancelModal');
          showToast('Booking cancelled');
          setTimeout(() => location.reload(), 1500);
        } else {
          throw new Error('Failed');
        }
      } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Cancel';
        showToast('Error - try again');
      }
    }

    function showChangeDateModal(id, date, days, changes) {
      if (changes >= 1) {
        alert('Already changed once. Second change = cancellation.');
        return;
      }

      const fee = days >= 7 ? 'Free' : '£50 fee';
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'changeDateModal';
      modal.innerHTML = \`
        <div class="modal">
          <h2>Change Date</h2>
          <div class="policy-box">
            <p><strong>\${fee}</strong> (\${days} days notice)</p>
          </div>
          <div class="form-group">
            <label>New Date</label>
            <input type="date" id="newDate" min="\${getTomorrow()}">
          </div>
          <div class="form-group">
            <label>Time Slot</label>
            <select id="newSlot">
              <option value="morning">12 PM - 6 PM</option>
              <option value="afternoon">2 PM - 8 PM</option>
              <option value="evening">4 PM - 10 PM</option>
              <option value="latenight">6 PM - 12 AM (+£50)</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="modal-btn secondary" onclick="closeModal('changeDateModal')">Cancel</button>
            <button class="modal-btn primary" onclick="changeDate('\${id}')">Change</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
    }

    async function changeDate(id) {
      const newDate = document.getElementById('newDate').value;
      const newSlot = document.getElementById('newSlot').value;

      if (!newDate) { alert('Pick a date'); return; }

      const btn = document.querySelector('#changeDateModal .primary');
      btn.textContent = 'Checking...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/bookings/'+id+'/change-date', {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({newDate, newTimeSlot: newSlot})
        });

        const data = await res.json();

        if (res.ok) {
          closeModal('changeDateModal');
          showToast('Date changed');
          setTimeout(() => location.reload(), 1500);
        } else if (data.error === 'slot_unavailable') {
          btn.disabled = false;
          btn.textContent = 'Change';
          alert('Slot unavailable. Try another time.');
        } else {
          throw new Error(data.error || 'Failed');
        }
      } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Change';
        showToast('Error: ' + e.message);
      }
    }

    function closeModal(id) {
      const m = document.getElementById(id);
      if (m) m.remove();
    }

    function formatDateJS(d) {
      return new Date(d).toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'});
    }

    function getTomorrow() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    }
  </script>
</body>
</html>
  `;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// ============================================
// 404 Handler
// ============================================

router.all('*', () => json({ error: 'Not found' }, 404));

// ============================================
// Export
// ============================================

export default {
  fetch: router.handle,
};
