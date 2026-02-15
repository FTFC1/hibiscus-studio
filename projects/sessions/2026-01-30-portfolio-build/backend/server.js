const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Telegram notification function
async function sendTelegramNotification(leadData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Missing Telegram credentials');
        return;
    }

    // Format contact method
    const contactMethodEmoji = {
        'whatsapp': '💬',
        'telegram': '✈️',
        'imessage': '📱'
    };

    const emoji = contactMethodEmoji[leadData.contact_method] || '📞';

    // Format timeline
    const timelineMap = {
        'urgent': '🔴 URGENT - bleeding hours right now',
        'soon': '🟡 Soon - within 4 weeks',
        'planning': '🟢 Exploring options'
    };

    const message = `
🔔 <b>New Lead - Automation Portfolio</b>

<b>Name:</b> ${leadData.name}
<b>Contact:</b> ${emoji} ${leadData.contact_method} → ${leadData.contact_handle}
${leadData.company ? `<b>Company:</b> ${leadData.company}` : ''}

<b>Problem:</b>
${leadData.problem}

<b>Time Cost:</b> ${leadData.hours}

<b>Timeline:</b> ${timelineMap[leadData.timeline] || leadData.timeline}

—————————————
→ Reach out on ${leadData.contact_method}: ${leadData.contact_handle}
    `.trim();

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Telegram API error:', error);
        }
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'Portfolio Lead Capture' });
});

// Lead submission endpoint
app.post('/submit-lead', async (req, res) => {
    try {
        const leadData = req.body;

        // Validate required fields
        const required = ['name', 'contact_method', 'contact_handle', 'problem', 'hours', 'timeline'];
        const missing = required.filter(field => !leadData[field]);

        if (missing.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missing
            });
        }

        // Send Telegram notification
        await sendTelegramNotification(leadData);

        // Log for debugging (remove in production)
        console.log('Lead captured:', {
            name: leadData.name,
            contact: leadData.contact_method,
            timestamp: new Date().toISOString()
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error processing lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
