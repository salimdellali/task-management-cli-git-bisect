# Task Management CLI App - Git Bisect Demo

## Concept
A command-line task manager where you can add, list, complete, and delete tasks. The bug: completed tasks stop being saved to the file.

## Plan to build the CLI:

1. Initial commit - Project setup, package.json, tsconfig.json
1. Add basic Task interface - Define Task type with id, title, completed
1. Create TaskManager class skeleton - Empty class with method stubs
1. Implement addTask method - Add tasks to in-memory array
1. Implement listTasks method - Display all tasks
1. Add CLI argument parsing - Basic command handling (add, list)
1. Implement task ID generation - UUID or timestamp-based IDs
1. Add file storage setup - Create tasks.json file handling
1. Implement saveToFile method - Persist tasks to JSON file
1. Implement loadFromFile method - Load tasks on startup
1. Add completeTask method - Mark tasks as complete ✓
1. Add visual formatting - Colors/emojis for completed vs pending tasks
1. Implement deleteTask method - Remove tasks by ID
1. Add task filtering - Show only pending or completed tasks
1. Add input validation - Check for empty task titles
1. 🐛 BUG INTRODUCED - In saveToFile, accidentally filter out completed tasks: tasks.filter(t => !t.completed)
1. Add task priority field - Add priority: low, medium, high
1. Add sort by priority feature - Sort tasks when listing
1. Add due date field - Optional due dates for tasks
1. Add overdue task highlighting - Show overdue tasks in red
1. Add task count summary - Show "5 pending, 3 completed"
1. Add search/filter by keyword - Find tasks by title
1. Improve error messages - Better user feedback
1. Add help command - Display usage instructions
1. Add README documentation - Final polish

Why This Works Perfectly:
- ✅ 20+ commits with meaningful progression
- ✅ Bug is subtle - app appears to work, but data doesn't persist
- ✅ Easy to test - "Add task → complete it → restart app → is it still there?"
- ✅ Clear good/bad boundary - Commits 1-15 work, 16-25 don't
- ✅ Realistic workflow - Shows how features build on each other
- ✅ Binary search works perfectly - Each commit either saves completed tasks or doesn't

## Bisect Demo Script:
```bash
# Bug report: "Completed tasks disappear after restarting!"
git bisect start
git bisect bad HEAD
git bisect good <commit-15-hash>

# At each step:
npm run dev add "Test task"
npm run dev complete 1
npm run dev list  # Shows completed
# Restart
npm run dev list  # Is it still there?
git bisect good/bad
```