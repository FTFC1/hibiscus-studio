# Hibiscus Studio Website & Chatbot

This repository contains the source code for the Hibiscus Studio website and its AI customer support chatbot.

## 📂 Project Structure

*   **`index.html`**: The main landing page (deployed via GitHub Pages).
*   **`assets/`**:
    *   `css/chat-widget.css`: Styles for the floating chat widget.
    *   `js/chat-widget.js`: Logic for the chat widget (connects to backend).
*   **`backend/`**: The Python FastAPI application (deployed on Render).
    *   `main.py`: The API server.
    *   `context.txt`: The knowledge base for the AI.
    *   `render.yaml`: Deployment configuration for Render.

## 🚀 Deployment

### Frontend (Website)
*   **Host**: GitHub Pages.
*   **Update**: Push changes to the `main` branch. GitHub Pages updates automatically.

### Backend (Chatbot API)
*   **Host**: Render (Free Tier).
*   **URL**: `https://hibiscus-studio-chatbot.onrender.com`
*   **Update**: Push changes to the `backend/` folder. Render updates automatically.
*   **Secrets**: `GEMINI_API_KEY` is set in Render's Environment Variables.

## 🤖 Chatbot Knowledge Base
To update what the chatbot knows:
1.  Edit `backend/context.txt`.
2.  Commit and push.
3.  Render will redeploy with the new knowledge (~2 mins).

## 🛠 Local Development
1.  Run `./start_local.sh` to start the backend.
2.  Open `index.html` in your browser.