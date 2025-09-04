from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime


# ----------------------------------------------------------------------------
# Simple in-memory Task Tracker (no database)
# ----------------------------------------------------------------------------
app = Flask(__name__)

# Global in-memory store. This resets whenever the server restarts.
tasks = []
next_id = 1


def now_iso():
    return datetime.utcnow().isoformat()


@app.get("/")
def index():
    """List all tasks and show the add form."""
    # Show newest first
    sorted_tasks = sorted(tasks, key=lambda t: t["id"], reverse=True)
    return render_template("index.html", tasks=sorted_tasks)


@app.post("/add")
def add_task():
    """Add a new task using the submitted title."""
    global next_id
    title = (request.form.get("title") or "").strip()
    if title:
        tasks.append({
            "id": next_id,
            "title": title,
            "completed": 0,
            "created_at": now_iso(),
        })
        next_id += 1
    return redirect(url_for("index"))


@app.post("/toggle/<int:task_id>")
def toggle_task(task_id: int):
    """Toggle completed flag for the given task id."""
    for t in tasks:
        if t["id"] == task_id:
            t["completed"] = 0 if t["completed"] else 1
            break
    return redirect(url_for("index"))


@app.get("/edit/<int:task_id>")
def edit_page(task_id: int):
    """Render the edit form for a specific task."""
    task = next((t for t in tasks if t["id"] == task_id), None)
    if task is None:
        return redirect(url_for("index"))
    # Wrap in a simple dict-like object compatible with templates
    return render_template("edit.html", task=task)


@app.post("/edit/<int:task_id>")
def edit_task(task_id: int):
    """Save title changes from the edit form."""
    title = (request.form.get("title") or "").strip()
    if title:
        for t in tasks:
            if t["id"] == task_id:
                t["title"] = title
                break
    return redirect(url_for("index"))


@app.post("/delete/<int:task_id>")
def delete_task(task_id: int):
    """Remove a task by id."""
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return redirect(url_for("index"))


if __name__ == "__main__":
    # Access at http://127.0.0.1:5000
    app.run(debug=True)


