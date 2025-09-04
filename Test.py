tasks = []


def list_tasks():
    if not tasks:
        print("No tasks yet.")
        return
    print("\nTasks:")
    for i, t in enumerate(tasks, start=1):
        print(f"  {i}. {t}")


def add_task():
    """Insert a task at a specific position (1-based)."""
    title = input("Task title: ").strip()
    if not title:
        print("Title cannot be empty.")
        return
    try:
        pos = int(input("Position (1 for top, leave blank for 1): ") or 1)
    except ValueError:
        pos = 1
    pos = max(1, min(pos, len(tasks) + 1))
    tasks.insert(pos - 1, title)
    print(f"Added at position {pos}.")


def append_task():
    """Append a task to the end of the list."""
    title = input("Task title: ").strip()
    if not title:
        print("Title cannot be empty.")
        return
    tasks.append(title)
    print("Appended.")


def remove_task():
    """Remove a task by number or by exact title."""
    if not tasks:
        print("Nothing to remove.")
        return
    choice = input("Remove by (n)umber or (t)itle? [n/t]: ").strip().lower() or "n"
    if choice == "n":
        list_tasks()
        try:
            idx = int(input("Enter task number to remove: "))
        except ValueError:
            print("Invalid number.")
            return
        if 1 <= idx <= len(tasks):
            removed = tasks.pop(idx - 1)
            print(f"Removed: {removed}")
        else:
            print("Out of range.")
    else:
        title = input("Exact task title to remove: ").strip()
        try:
            tasks.remove(title)
            print(f"Removed: {title}")
        except ValueError:
            print("Title not found.")


def menu():
    print("\nTask Manager")
    print("1) List tasks")
    print("2) Add task (at position)")
    print("3) Append task (to end)")
    print("4) Remove task")
    print("5) Quit")


def main():
    while True:
        menu()
        choice = input("Choose an option: ").strip()
        if choice == "1":
            list_tasks()
        elif choice == "2":
            add_task()
        elif choice == "3":
            append_task()
        elif choice == "4":
            remove_task()
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid choice.")


if __name__ == "__main__":
    main()


