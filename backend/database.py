import os
import json
import hashlib
from datetime import datetime
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor

# DATABASE_URL provided by Railway for Postgres
DATABASE_URL = os.environ.get("DATABASE_URL")

def get_connection():
    """Factory to get the correct DB connection."""
    if DATABASE_URL:
        # PostgreSQL Connection
        try:
            conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            return conn, "postgres"
        except Exception as e:
            print(f"❌ DB Connection Error: {e}")
            raise e
    else:
        # SQLite Connection (Local Fallback)
        DB_NAME = "tutor_db.sqlite"
        conn = sqlite3.connect(DB_NAME)
        # Enable row factory to access columns by name (like RealDictCursor)
        conn.row_factory = sqlite3.Row
        return conn, "sqlite"

def init_db():
    """Initialize the database tables."""
    conn, db_type = get_connection()
    c = conn.cursor()
    
    # Common SQL for table creation
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY, 
        password_hash TEXT, 
        created_at TEXT
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS progress (
        username TEXT PRIMARY KEY, 
        current_goal TEXT, 
        current_module TEXT, 
        completed_modules TEXT,
        last_updated TEXT
    )''')
    
    conn.commit()
    conn.close()
    print(f"✅ Database initialized ({db_type}).")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def ensure_user_exists(username):
    """
    Ensure a user exists. Uses UPSERT logic to handle concurrency safely.
    """
    conn, db_type = get_connection()
    c = conn.cursor()
    
    hashed = hash_password("oauth_user")
    now = datetime.now().isoformat()
    
    try:
        if db_type == "postgres":
            # Postgres: ON CONFLICT DO NOTHING
            c.execute("""
                INSERT INTO users (username, password_hash, created_at) 
                VALUES (%s, %s, %s) 
                ON CONFLICT (username) DO NOTHING
            """, (username, hashed, now))
        else:
            # SQLite: INSERT OR IGNORE
            c.execute("""
                INSERT OR IGNORE INTO users (username, password_hash, created_at) 
                VALUES (?, ?, ?)
            """, (username, hashed, now))
            
        conn.commit()
    except Exception as e:
        print(f"Error ensuring user: {e}")
    finally:
        conn.close()

def get_user_progress(username):
    """Retrieve user's last known state."""
    conn, db_type = get_connection()
    c = conn.cursor()
    
    query = "SELECT current_goal, current_module, completed_modules FROM progress WHERE username=%s" if db_type == "postgres" else "SELECT current_goal, current_module, completed_modules FROM progress WHERE username=?"
    
    c.execute(query, (username,))
    row = c.fetchone()
    conn.close()
    
    if row:
        completed = {}
        try:
            # Handle both dictionary access (Postgres/SQLite Row) or tuple access
            if db_type == "postgres":
                comp_str = row['completed_modules']
                goal = row['current_goal']
                module = row['current_module']
            else:
                comp_str = row['completed_modules']
                goal = row['current_goal']
                module = row['current_module']
            
            completed = json.loads(comp_str)
        except:
            completed = {}
            goal = row[0] if not isinstance(row, dict) else row['current_goal']
            module = row[1] if not isinstance(row, dict) else row['current_module']
        
        return {"goal": goal, "module": module, "completed": completed}
    return None

def save_progress(username, goal, module, metrics=None):
    """Update progress with UPSERT logic."""
    conn, db_type = get_connection()
    c = conn.cursor()
    
    # 1. Fetch existing completed_modules first to append new metrics
    existing_completed = {}
    
    select_query = "SELECT completed_modules FROM progress WHERE username=%s" if db_type == "postgres" else "SELECT completed_modules FROM progress WHERE username=?"
    c.execute(select_query, (username,))
    row = c.fetchone()
    
    if row:
        try:
            val = row['completed_modules']
            existing_completed = json.loads(val)
        except:
            pass

    # 2. Update the completed dict
    if metrics and "completed_module_name" in metrics:
        mod_name = metrics["completed_module_name"]
        existing_completed[mod_name] = {
            "steps": metrics.get("steps", 0),
            "timestamp": datetime.now().isoformat(),
            "efficiency_score": max(100 - (metrics.get("steps", 0) * 2), 10)
        }
    
    json_data = json.dumps(existing_completed)
    now = datetime.now().isoformat()
    
    try:
        if db_type == "postgres":
            # Postgres UPSERT
            c.execute("""
                INSERT INTO progress (username, current_goal, current_module, completed_modules, last_updated)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (username) 
                DO UPDATE SET 
                    current_goal = EXCLUDED.current_goal,
                    current_module = EXCLUDED.current_module,
                    completed_modules = EXCLUDED.completed_modules,
                    last_updated = EXCLUDED.last_updated
            """, (username, goal, module, json_data, now))
        else:
            # SQLite UPSERT
            c.execute("""
                INSERT INTO progress (username, current_goal, current_module, completed_modules, last_updated)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(username) 
                DO UPDATE SET 
                    current_goal=excluded.current_goal,
                    current_module=excluded.current_module,
                    completed_modules=excluded.completed_modules,
                    last_updated=excluded.last_updated
            """, (username, goal, module, json_data, now))
            
        conn.commit()
    except Exception as e:
        print(f"Error saving progress: {e}")
    finally:
        conn.close()

# Auto-initialize
try:
    init_db()
except Exception as e:
    print(f"⚠️ DB Init Warning: {e}")