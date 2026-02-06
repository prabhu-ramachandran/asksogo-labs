from fastapi import FastAPI, HTTPException, Body, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import uvicorn
import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Logic Imports
from logic import socratic_agent
from langchain_core.messages import HumanMessage, AIMessage
from database import save_progress, ensure_user_exists, get_user_progress
from sandbox import execute_code_safely
from vision import calculate_xp

# --- APP SETUP ---
app = FastAPI(title="AskSOGO API")

# Initialize Groq Client
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# CORS Setup - Allow Frontend to access Backend
origins = [
    "http://localhost:5173",          # Vite Dev Server
    "http://localhost",               # Nginx Local
    "https://asksogo.org",            # Production Frontend
    "https://www.asksogo.org",        # Production Frontend (www)
    "*"                               # Open for now (MVP)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---

class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: List[Dict[str, str]]  # [{'role': 'user', 'content': '...'}, ...]
    module_name: str
    goal: str

class CodeRequest(BaseModel):
    code: str
    user_id: str

class ProgressRequest(BaseModel):
    user_id: str

class StartModuleRequest(BaseModel):
    user_id: str
    goal: str
    module_name: Optional[str] = None

# --- CONSTANTS ---
CURRICULUM = {
    "Cricket Game": ["The Stadium (I/O)", "The Scoreboard (Variables)", "The Umpire (Conditionals)", "The Over (Loops)", "The Commentary (Functions)", "Match Recap (Git)"],
    "Food Blog": ["The Menu (Strings)", "The Foodies List (Lists)", "Hotel Cards (Dictionaries)", "The Generator (Loops)", "Go Live (File I/O)", "Cloud Launch (Infra)"],
    "Expense Tracker": ["The Wallet (Data Types)", "Daily Ledger (CSV)", "App Menu (Flow)", "The Auditor (Logic)", "The Workshop (Infra)", "Portfolio (Final)"]
}

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AskSOGO Backend"}

@app.get("/curriculum")
def get_curriculum():
    return CURRICULUM

@app.post("/progress")
def get_progress(req: ProgressRequest):
    ensure_user_exists(req.user_id)
    progress = get_user_progress(req.user_id)
    xp = calculate_xp(req.user_id)
    return {"progress": progress, "xp": xp}

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    # Convert history format
    formatted_history = []
    for msg in req.history:
        if msg['role'] == 'user':
            formatted_history.append(HumanMessage(content=msg['content']))
        elif msg['role'] == 'assistant':
            formatted_history.append(AIMessage(content=msg['content']))
            
    # Add current message
    formatted_history.append(HumanMessage(content=req.message))
    
    # Call Agent
    result = socratic_agent.invoke({
        "messages": formatted_history, 
        "module_name": req.module_name, 
        "goal": req.goal
    })
    
    ai_response = result["messages"][-1].content
    
    # Check for completion
    module_complete = False
    next_module = req.module_name
    
    if "[MODULE_COMPLETE]" in ai_response:
        module_complete = True
        ai_response = ai_response.replace("[MODULE_COMPLETE]", "").strip()
        
        # Advance Module Logic
        modules = CURRICULUM.get(req.goal, [])
        try:
            idx = modules.index(req.module_name)
            if idx < len(modules) - 1:
                next_module = modules[idx + 1]
                save_progress(
                    req.user_id, 
                    req.goal, 
                    next_module, 
                    {"completed_module_name": req.module_name}
                )
        except ValueError:
            pass # Module not found in list
            
    return {
        "response": ai_response,
        "module_complete": module_complete,
        "next_module": next_module
    }

@app.post("/voice_chat")
async def voice_chat_endpoint(
    audio: UploadFile = File(...),
    user_id: str = Form(...),
    history: str = Form(...), # JSON string
    module_name: str = Form(...),
    goal: str = Form(...)
):
    try:
        # 1. Transcribe with Groq
        # Save temp file for Groq client (it needs a file-like object with a name or path)
        contents = await audio.read()
        filename = f"temp_{user_id}.wav"
        
        with open(filename, "wb") as f:
            f.write(contents)
            
        with open(filename, "rb") as f:
            transcription = groq_client.audio.transcriptions.create(
                file=(filename, f.read()),
                model="whisper-large-v3",
                response_format="json",
                language="en",
                temperature=0.0
            )
        
        os.remove(filename) # Cleanup
        
        user_text = transcription.text
        
        # 2. Process with Socratic Agent (Reuse logic)
        history_list = json.loads(history)
        
        # Create a ChatRequest-like object to reuse chat_endpoint logic if possible, 
        # or just call the agent directly. Calling directly is cleaner here.
        formatted_history = []
        for msg in history_list:
            if msg['role'] == 'user':
                formatted_history.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                formatted_history.append(AIMessage(content=msg['content']))
        
        formatted_history.append(HumanMessage(content=user_text))
        
        result = socratic_agent.invoke({
            "messages": formatted_history, 
            "module_name": module_name, 
            "goal": goal
        })
        
        ai_response = result["messages"][-1].content
        
        # (Optional: Generate TTS Audio here if we had ElevenLabs)
        
        return {
            "transcription": user_text,
            "response": ai_response
        }
        
    except Exception as e:
        print(f"Voice Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run_code")
def run_code_endpoint(req: CodeRequest):
    output = execute_code_safely(req.code)
    return {"output": output}

@app.post("/start_module")
def start_module(req: StartModuleRequest):
    ensure_user_exists(req.user_id)
    
    modules = CURRICULUM.get(req.goal, [])
    if not modules:
        # Default/Fallback logic for non-coding goals (like English)
        if req.goal == "English Adventure":
             return {
                "module": "Level 0: The Explorer",
                "intro_message": "Hello! I am Sogo. What is your name?",
                "all_modules": ["Level 0", "Level 1", "Level 2"]
            }
        raise HTTPException(status_code=400, detail="Invalid Goal")
        
    # Determine active module
    active_mod = req.module_name
    if not active_mod:
        saved = get_user_progress(req.user_id)
        if saved and saved.get("goal") == req.goal:
            active_mod = saved.get("module")
        else:
            active_mod = modules[0]
            
    # Generate intro message
    result = socratic_agent.invoke({
        "messages": [HumanMessage(content=f"Starting {req.goal}, module {active_mod}")], 
        "module_name": active_mod, 
        "goal": req.goal
    })
    
    intro_message = result["messages"][-1].content
    
    return {
        "module": active_mod,
        "intro_message": intro_message,
        "all_modules": modules
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 7860)))