import streamlit as st
import json
import os
from datetime import datetime, date, timedelta
from typing import List, Dict
import pandas as pd

# File path for persisting tasks
TASKS_FILE = "tasks.json"

# Priority levels
PRIORITY_LEVELS = ["High", "Medium", "Low"]

# Priority colors for visual distinction
PRIORITY_COLORS = {
    "High": "🔴",
    "Medium": "🟡",
    "Low": "🟢"
}


def load_tasks() -> List[Dict]:
    """Load tasks from JSON file."""
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, 'r') as f:
                tasks = json.load(f)
                # Convert date strings back to date objects
                for task in tasks:
                    task['due_date'] = datetime.strptime(task['due_date'], '%Y-%m-%d').date()
                return tasks
        except (json.JSONDecodeError, KeyError):
            return []
    return []


def save_tasks(tasks: List[Dict]) -> None:
    """Save tasks to JSON file."""
    # Convert date objects to strings for JSON serialization
    tasks_to_save = []
    for task in tasks:
        task_copy = task.copy()
        task_copy['due_date'] = task['due_date'].strftime('%Y-%m-%d')
        tasks_to_save.append(task_copy)
    
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks_to_save, f, indent=2)


def initialize_session_state() -> None:
    """Initialize session state variables."""
    if 'tasks' not in st.session_state:
        st.session_state.tasks = load_tasks()
    if 'task_counter' not in st.session_state:
        st.session_state.task_counter = max([t['id'] for t in st.session_state.tasks], default=0) + 1


def add_task(name: str, due_date: date, priority: str) -> None:
    """Add a new task."""
    task = {
        'id': st.session_state.task_counter,
        'name': name,
        'due_date': due_date,
        'priority': priority,
        'completed': False,
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    st.session_state.tasks.append(task)
    st.session_state.task_counter += 1
    save_tasks(st.session_state.tasks)


def toggle_task_completion(task_id: int) -> None:
    """Toggle task completion status."""
    for task in st.session_state.tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            break
    save_tasks(st.session_state.tasks)


def delete_task(task_id: int) -> None:
    """Delete a task."""
    st.session_state.tasks = [t for t in st.session_state.tasks if t['id'] != task_id]
    save_tasks(st.session_state.tasks)


def filter_tasks(tasks: List[Dict], priority_filter: str, date_filter: str) -> List[Dict]:
    """Filter tasks based on priority and date."""
    filtered = tasks.copy()
    
    # Filter by priority
    if priority_filter != "All":
        filtered = [t for t in filtered if t['priority'] == priority_filter]
    
    # Filter by date
    today = date.today()
    if date_filter == "Today":
        filtered = [t for t in filtered if t['due_date'] == today]
    elif date_filter == "This Week":
        week_end = today + timedelta(days=7)
        filtered = [t for t in filtered if today <= t['due_date'] <= week_end]
    elif date_filter == "Overdue":
        filtered = [t for t in filtered if t['due_date'] < today and not t['completed']]
    
    return filtered


def display_tasks_table(tasks: List[Dict], show_completed: bool = False) -> None:
    """Display tasks in a formatted table."""
    if not tasks:
        st.info("No tasks to display." if not show_completed else "No completed tasks yet.")
        return
    
    for task in tasks:
        col1, col2, col3, col4, col5 = st.columns([0.5, 3, 1.5, 1, 1])
        
        with col1:
            st.write(PRIORITY_COLORS[task['priority']])
        
        with col2:
            if task['completed']:
                st.markdown(f"~~{task['name']}~~")
            else:
                # Check if overdue
                if task['due_date'] < date.today():
                    st.markdown(f"**{task['name']}** ⚠️")
                else:
                    st.write(task['name'])
        
        with col3:
            st.write(task['due_date'].strftime('%Y-%m-%d'))
        
        with col4:
            st.write(task['priority'])
        
        with col5:
            button_col1, button_col2 = st.columns(2)
            with button_col1:
                button_label = "✓" if not task['completed'] else "↶"
                if st.button(button_label, key=f"toggle_{task['id']}", help="Toggle completion"):
                    toggle_task_completion(task['id'])
                    st.rerun()
            with button_col2:
                if st.button("🗑️", key=f"delete_{task['id']}", help="Delete task"):
                    delete_task(task['id'])
                    st.rerun()
        
        st.divider()


def main():
    st.set_page_config(page_title="Task Tracker", page_icon="✅", layout="wide")
    
    initialize_session_state()
    
    st.title("📋 Task Tracker")
    st.markdown("---")
    
    # Add Task Section
    with st.expander("➕ Add New Task", expanded=True):
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col1:
            task_name = st.text_input("Task Name", placeholder="Enter task description...")
        
        with col2:
            due_date = st.date_input("Due Date", min_value=date.today())
        
        with col3:
            priority = st.selectbox("Priority", PRIORITY_LEVELS)
        
        if st.button("Add Task", type="primary", use_container_width=True):
            if task_name.strip():
                add_task(task_name.strip(), due_date, priority)
                st.success(f"Task '{task_name}' added successfully!")
                st.rerun()
            else:
                st.error("Please enter a task name.")
    
    st.markdown("---")
    
    # Filter Section
    st.subheader("🔍 Filter Tasks")
    col1, col2 = st.columns(2)
    
    with col1:
        priority_filter = st.selectbox("Filter by Priority", ["All"] + PRIORITY_LEVELS)
    
    with col2:
        date_filter = st.selectbox("Filter by Date", ["All", "Today", "This Week", "Overdue"])
    
    st.markdown("---")
    
    # Separate active and completed tasks
    active_tasks = [t for t in st.session_state.tasks if not t['completed']]
    completed_tasks = [t for t in st.session_state.tasks if t['completed']]
    
    # Apply filters to active tasks
    filtered_active = filter_tasks(active_tasks, priority_filter, date_filter)
    
    # Sort by due date and priority
    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    filtered_active.sort(key=lambda x: (x['due_date'], priority_order[x['priority']]))
    
    # Display Active Tasks
    st.subheader(f"📌 Active Tasks ({len(filtered_active)})")
    
    if filtered_active:
        # Table header
        col1, col2, col3, col4, col5 = st.columns([0.5, 3, 1.5, 1, 1])
        with col1:
            st.markdown("**P**")
        with col2:
            st.markdown("**Task**")
        with col3:
            st.markdown("**Due Date**")
        with col4:
            st.markdown("**Priority**")
        with col5:
            st.markdown("**Actions**")
        st.divider()
    
    display_tasks_table(filtered_active, show_completed=False)
    
    st.markdown("---")
    
    # Display Completed Tasks
    with st.expander(f"✅ Completed Tasks ({len(completed_tasks)})", expanded=False):
        if completed_tasks:
            # Table header
            col1, col2, col3, col4, col5 = st.columns([0.5, 3, 1.5, 1, 1])
            with col1:
                st.markdown("**P**")
            with col2:
                st.markdown("**Task**")
            with col3:
                st.markdown("**Due Date**")
            with col4:
                st.markdown("**Priority**")
            with col5:
                st.markdown("**Actions**")
            st.divider()
        
        display_tasks_table(completed_tasks, show_completed=True)
    
    # Statistics
    st.markdown("---")
    st.subheader("📊 Statistics")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Tasks", len(st.session_state.tasks))
    with col2:
        st.metric("Active", len(active_tasks))
    with col3:
        st.metric("Completed", len(completed_tasks))
    with col4:
        overdue = len([t for t in active_tasks if t['due_date'] < date.today()])
        st.metric("Overdue", overdue, delta=None if overdue == 0 else "⚠️")


if __name__ == "__main__":
    main()
