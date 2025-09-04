from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from pathlib import Path
from datetime import datetime


# ----------------------------------------------------------------------------
# Flask app setup
# ----------------------------------------------------------------------------
app = Flask(__name__)

DB_PATH = Path(__file__).with_name("tasks.db")


def get_db_connection():
    """Create and return a connection to the SQLite database.

    isolation_level=None enables autocommit for simple usage in this app.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the tasks table if it does not already exist."""
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


# Initialize DB on startup
init_db()


# ----------------------------------------------------------------------------
# Routes
# ----------------------------------------------------------------------------
@app.get("/")
def index():
    """List all tasks and display the add form."""
    conn = get_db_connection()
    tasks = conn.execute(
        "SELECT id, title, completed, created_at FROM tasks ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return render_template("index.html", tasks=tasks)


@app.post("/add")
def add_task():
    """Create a new task with the provided title."""
    title = (request.form.get("title") or "").strip()
    if title:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO tasks (title, completed, created_at) VALUES (?, 0, ?)",
            (title, datetime.utcnow().isoformat()),
        )
        conn.commit()
        conn.close()
    return redirect(url_for("index"))


@app.post("/toggle/<int:task_id>")
def toggle_task(task_id: int):
    """Toggle a task's completed status."""
    conn = get_db_connection()
    row = conn.execute("SELECT completed FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if row is not None:
        new_value = 0 if row["completed"] else 1
        conn.execute("UPDATE tasks SET completed = ? WHERE id = ?", (new_value, task_id))
        conn.commit()
    conn.close()
    return redirect(url_for("index"))


@app.get("/edit/<int:task_id>")
def edit_page(task_id: int):
    """Render a page to edit a task title."""
    conn = get_db_connection()
    task = conn.execute(
        "SELECT id, title, completed FROM tasks WHERE id = ?", (task_id,)
    ).fetchone()
    conn.close()
    if task is None:
        return redirect(url_for("index"))
    return render_template("edit.html", task=task)


@app.post("/edit/<int:task_id>")
def edit_task(task_id: int):
    """Update a task's title from the form input."""
    title = (request.form.get("title") or "").strip()
    if title:
        conn = get_db_connection()
        conn.execute("UPDATE tasks SET title = ? WHERE id = ?", (title, task_id))
        conn.commit()
        conn.close()
    return redirect(url_for("index"))


@app.post("/delete/<int:task_id>")
def delete_task(task_id: int):
    """Delete a task by id."""
    conn = get_db_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("index"))


if __name__ == "__main__":
    # Run the Flask development server
    # Access the app at http://127.0.0.1:5000
    app.run(debug=True)


