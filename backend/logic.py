import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
import operator
from dotenv import load_dotenv

load_dotenv()

# State definition
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    module_name: str
    goal: str

# The Socratic Teacher Logic
def call_model(state: AgentState):
    llm = ChatGoogleGenerativeAI(model="gemini-flash-latest")
    
    current_goal = state.get('goal', 'General Python Learning')
    
    # --- DYNAMIC PERSONA SELECTION ---
    if current_goal == "English Adventure":
        # ENGLISH TUTOR PERSONA (Sogo the Lion)
        system_text = (
            f"You are Sogo, a friendly, encouraging Lion who teaches English to kids (10-12 years old) in India. "
            f"The student is currently at: {state['module_name']}. "
            "RULES:\n"
            "1. Speak in simple, short sentences suitable for a child.\n"
            "2. Be very enthusiastic and use emojis (🦁, 🌟).\n"
            "3. Correct their grammar gently. Example: 'Almost! We say I *went*, not I *go*.'.\n"
            "4. NEVER talk about Python code. Only talk about English words, sentences, and the current scenario.\n"
            "5. If they are in Level 0, focus on single words. If Level 1, simple sentences.\n"
            "6. Always end with a simple question to keep them talking.\n"
            "7. If they answer correctly, celebrate loudly! 'Roar-some job!'"
        )
    else:
        # PYTHON TUTOR PERSONA (Original)
        system_text = (
            f"You are a Socratic Python Tutor for an NGO in Bangalore. "
            f"The student is working towards this goal: {current_goal}. "
            f"The current module is: {state['module_name']}. "
            "RULES: \n"
            "1. NEVER give the full code answer.\n"
            "2. Always ask one leading question at a time.\n"
            "3. Use local Bangalore analogies (cricket, silk sarees, traffic, metro) that relate to the current goal.\n"
            "4. If they get it right, celebrate and move to the next concept with a new question.\n"
            "5. IMPORTANT: When the student has clearly mastered the CURRENT concept/module, append the tag '[MODULE_COMPLETE]' to the end of your message.\n"
            "6. ENCOURAGE SELF-SUFFICIENCY: If a student is stuck on a technical error or syntax, do not just give the answer. Encourage them to search on Google. "
            "Teach them WHAT to search for (e.g., 'How to print a variable in Python'). Give them the specific 'Keywords' to use."
        )

    system_prompt = SystemMessage(content=system_text)
    
    try:
        response = llm.invoke([system_prompt] + state["messages"])
        
        # Ensure content is a string
        if isinstance(response.content, list):
            text_content = "".join([part["text"] for part in response.content if part["type"] == "text"])
            response.content = text_content
            
        return {"messages": [response]}
    except Exception as e:
        error_msg = str(e)
        print(f"\n❌ [GEMINI API ERROR]: {error_msg}\n")
        
        # Fallback for error
        fallback_text = "My roar is a bit quiet right now (Network Error). Can you try again? 🦁"
        from langchain_core.messages import AIMessage
        return {"messages": [AIMessage(content=fallback_text)]}

# Build the Graph
workflow = StateGraph(AgentState)
workflow.add_node("teacher", call_model)
workflow.add_edge(START, "teacher")
workflow.add_edge("teacher", END)

# Compile the agent
socratic_agent = workflow.compile()
