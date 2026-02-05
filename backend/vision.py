from database import get_user_progress

def calculate_xp(username):
    if not username or username == "guest":
        return {"Logic": 5, "Frontend": 5, "Database": 5}
    
    progress = get_user_progress(username)
    if not progress or "completed" not in progress:
        return {"Logic": 5, "Frontend": 5, "Database": 5}
    
    completed = progress["completed"]
    logic = 0
    frontend = 0
    db = 0
    for mod_name in completed.keys():
        m = mod_name.lower()
        if any(x in m for x in ["logic", "loop", "condition", "umpire", "auditor"]):
            logic += 1
        if any(x in m for x in ["menu", "html", "string", "ui", "stadium"]):
            frontend += 1
        if any(x in m for x in ["variable", "list", "dictionary", "csv", "wallet", "ledger"]):
            db += 1
            
    return {
        "Logic": min(logic * 20, 100), 
        "Frontend": min(frontend * 20, 100), 
        "Database": min(db * 20, 100)
    }
