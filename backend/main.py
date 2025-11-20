import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Load context
try:
    with open("context.txt", "r") as f:
        CONTEXT = f.read()
except FileNotFoundError:
    CONTEXT = "You are a helpful assistant for Hibiscus Studio. No specific context provided yet."

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Hibiscus Studio Chatbot Backend"}

@app.post("/chat")
async def chat(request: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Construct prompt with context
        prompt = f"""
You are a helpful, friendly customer support assistant for Hibiscus Studio, an event space in East London.
You are chatting with a customer on our website.

GUIDELINES:
1. **Be Concise**: Avoid long blocks of text. Use bullet points for lists.
2. **Format Links**: When mentioning a URL, format it as a clickable HTML link. Example: <a href="https://hibiscusstudio.co.uk" target="_blank">hibiscusstudio.co.uk</a>.
3. **Tone**: Friendly, simple, and clear. Like a helpful support agent.
4. **Context**: Use the provided context to answer. If the answer is not there, politely say you don't know and suggest contacting us on Instagram.

CONTEXT:
{CONTEXT}

CUSTOMER QUESTION:
{request.message}
"""
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
