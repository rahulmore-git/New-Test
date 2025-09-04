# Flask Task Tracker

A beginner-friendly task tracker using Flask (Python), SQLite, HTML, and CSS.

## Prerequisites
- Python 3.9+
- pip

## Setup
```powershell
cd C:\Users\admin\test-project\test
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run
```powershell
# From the project directory
python app.py
```

Open in your browser: http://127.0.0.1:5000

## Features
- Add tasks
- Edit task titles
- Delete tasks
- Mark tasks as completed/pending
- SQLite database stored as `tasks.db`

## Project Structure
```
app.py
requirements.txt
templates/
  index.html
  edit.html
static/
  styles.css
```

## Notes
- The database file `tasks.db` is created automatically on first run.
- To reset tasks, stop the server and delete `tasks.db`, then run again.
