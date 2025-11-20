(function () {
    // Configuration
    const API_URL = 'https://hibiscus-studio-chatbot.onrender.com/chat'; // Update this when deploying

    // Inject HTML
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'hibiscus-chat-widget';
    widgetContainer.innerHTML = `
        <div id="chat-window" class="hidden">
            <div class="chat-header">
                <div class="chat-title">
                    <span class="status-dot"></span>
                    Hibiscus Support
                </div>
                <button id="close-chat" aria-label="Close chat">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div id="chat-messages" class="chat-messages">
                <div class="message bot-message">
                    Hello! 👋 I'm the Hibiscus Studio assistant. How can I help you with your booking today?
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Type a message..." aria-label="Type a message">
                <button id="send-message" aria-label="Send message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
        </div>
        <button id="chat-toggle-btn" class="chat-toggle-btn" aria-label="Open chat">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>
    `;
    document.body.appendChild(widgetContainer);

    // Elements
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    const messagesContainer = document.getElementById('chat-messages');

    // State
    let isOpen = false;
    let isLoading = false;

    // Functions
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('open');
            toggleBtn.classList.add('hidden');
            chatInput.focus();
        } else {
            chatWindow.classList.remove('open');
            chatWindow.classList.add('hidden');
            toggleBtn.classList.remove('hidden');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || isLoading) return;

        // User message
        addMessage(text, 'user');
        chatInput.value = '';
        isLoading = true;

        // Loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message', 'loading');
        loadingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // Remove loading
            messagesContainer.removeChild(loadingDiv);

            // Bot message
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            messagesContainer.removeChild(loadingDiv);
            addMessage("Sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
        } finally {
            isLoading = false;
        }
    }

    // Event Listeners
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
