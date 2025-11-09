import * as readline from 'node:readline';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';

type Priority = 'Low' | 'Medium' | 'High';
type Filter = 'all' | 'uncompleted' | 'completed';
type SortOrder = 'highest' | 'lowest' | 'none';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  dueDate: string | null;
}


class TaskManager {
  private readonly tasks: Task[] = [];

  addTask(title: Task['title'], dueDate: Task['dueDate'], priority: Task['priority'] = 'Medium'): void {
    if (!title.trim()) {
      console.log('Task title cannot be empty.');
      return;
    }
    const task: Task = {
      id: randomUUID().substring(0, 4),
      title,
      completed: false,
      priority,
      dueDate,
    };
    this.tasks.push(task);
  }

  showSummary(): void {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    console.log(`Total: ${totalTasks}`);
    console.log(`Pending: ${pendingTasks}`);
    console.log(`Completed: ${completedTasks}`);
  }

  private displayTasks(tasks: Task[]): void {
    console.log('ID   | Status | Priority | Due Date   | Title');
    console.log('-----|--------|----------|------------|------');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const task of tasks) {
      const status = task.completed ? '\x1b[32m✓\x1b[0m' : ' ';
      let dueDateStr = task.dueDate ? task.dueDate.padEnd(10) : ''.padEnd(10);
      
      // Check if task is overdue (has due date, not completed, and due date is before today)
      if (task.dueDate && !task.completed) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < today) {
          dueDateStr = `\x1b[31m${task.dueDate.padEnd(10)}\x1b[0m`;
        }
      }
      
      console.log(`${task.id.padEnd(4)} |   ${status}    | ${task.priority.padEnd(8)} | ${dueDateStr} | ${task.title}`);
    }
  }

  searchTasks(keyword: string): void {
    const MatchedTasksToShow = this.tasks.filter(task => task.title.toLowerCase().includes(keyword.toLowerCase()));
    console.log('Search results:');
    this.displayTasks(MatchedTasksToShow);
  }

  listTasks(filter: Filter = 'all', sortOrder: SortOrder = 'none'): void {
    let tasksToShow = this.tasks;

    // Filter tasks if specified
    if (filter === 'uncompleted') {
      tasksToShow = this.tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      tasksToShow = this.tasks.filter(task => task.completed);
    }

    // Sort by priority if specified
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    if (sortOrder === 'highest') {
      tasksToShow.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sortOrder === 'lowest') {
      tasksToShow.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    this.displayTasks(tasksToShow);
  }

  completeTask(id: string): void {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      console.log(`Task ${id} not found.`);
      return;
    }

    task.completed = true;
    console.log(`Task ${id} marked as completed.`);
  }

  uncompleteTask(id: string): void {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      console.log(`Task ${id} not found.`);
      return;
    }
    
    task.completed = false;
    console.log(`Task ${id} marked as uncompleted.`);
  }

  deleteTask(id: string): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      console.log(`Task ${id} not found.`);
      return;
    }

    this.tasks.splice(index, 1);
    console.log(`Task ${id} deleted.`);
    
  }

  saveToFile(): void {
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/tasks.json', JSON.stringify(this.tasks.filter(t => !t.completed), null, 2));
    console.log('Tasks saved to file.');
  }

  loadFromFile(): void {
    try {
      const data = fs.readFileSync('data/tasks.json', 'utf8');
      const parsedTasks: Task[] = JSON.parse(data);
      this.tasks.splice(0, this.tasks.length, ...parsedTasks);
      console.log('Tasks loaded from file.');
    } catch {
      console.log('No file to load from, starting with empty task list.');
    }
  }
}

const taskManager = new TaskManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});


const welcomeASCIIBanner = `
####################################################################
 _____         _      __  __                                   
|_   _|_ _ ___| | __ |  /  | __ _ _ __   __ _  __ _  ___ _ __
  | |/ _\` / __| |/ / | |/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
  | | (_| \\__ \\   <  | | | | (_| | | | | (_| | (_| |  __/ |   
  |_|\\__,_|___/_|\\_\\ |_| |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
                                              |___/           
  ____ _     ___ 
 / ___| |   |_ _|
| |   | |    | | 
| |___| |___ | | 
 \\____|_____|___|

 ####################################################################
 `;

console.log(welcomeASCIIBanner);
console.log('Available commands: add [--low|--medium|--high] [--due <days>] <title>, list [--highest|--lowest] [completed|uncompleted], summary, search <title>, load, save, complete <id>, uncomplete <id>, delete <id>, help, exit');
rl.prompt();

rl.on('line', (input) => {
  const args = input.trim().split(/\s+/);
  const command = args[0];

  if (command === 'add') {
    let priority: Priority;
    let titleStartIndex = 1;

    // Get the priority
    if (args[1] === '--low') {
      priority = 'Low';
      titleStartIndex = 2;
    } else if (args[1] === '--medium') {
      priority = 'Medium';
      titleStartIndex = 2;
    } else if (args[1] === '--high') {
      priority = 'High';
      titleStartIndex = 2;
    } else {
      priority = 'Medium';
    }

    let dueDate: Task['dueDate'] = null;
    if (args[titleStartIndex] === '--due') {
      const daysStr = args[titleStartIndex + 1];
      const days = Number.parseInt(daysStr, 10);
      if (Number.isNaN(days) || days < 0) {
        console.log('Invalid number of days for due date. Must be a non-negative integer.');
        return;
      }
      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + days);
      dueDate = dueDateObj.toISOString().split('T')[0];
      titleStartIndex += 2;
    }
    const title = args.slice(titleStartIndex).join(' ');
    taskManager.addTask(title, dueDate, priority);
  } else if (command === 'list') {
    let sortOrder: SortOrder;
    let filterIndex = 1;
    if (args[1] === '--highest') {
      sortOrder = 'highest';
      filterIndex = 2;
    } else if (args[1] === '--lowest') {
      sortOrder = 'lowest';
      filterIndex = 2;
    } else {
      sortOrder = 'none';
    }
    let filter: Filter = 'all';
    if (args[filterIndex]) {
      if (args[filterIndex] === 'completed') {
        filter = 'completed';
      } else if (args[filterIndex] === 'uncompleted') {
        filter = 'uncompleted';
      } else {
        console.log('Invalid filter. Use completed or uncompleted.');
        rl.prompt();
        return;
      }
    }
    taskManager.listTasks(filter, sortOrder);
    } else if (command === 'summary') {
    taskManager.showSummary();
    } else if (command === 'search' && args[1]) {
    taskManager.searchTasks(args.slice(1).join(' '));
    } else if (command === 'help') {
    console.log('Available commands:');
    console.log('  add [--low|--medium|--high] [--due <days>] <title>  - Add a new task (default medium priority, due date in days from today)');
    console.log('  list [--highest|--lowest] [completed|uncompleted] - List tasks (default all, no sorting)');
    console.log('  summary      - Show task count summary');
    console.log('  search <title> - Search tasks by title');
    console.log('  load         - Load tasks from file');
    console.log('  save         - Save tasks to file');
    console.log('  complete <id> - Mark a task as completed');
    console.log('  uncomplete <id> - Mark a task as uncompleted');
    console.log('  delete <id>  - Delete a task by ID');
    console.log('  help         - Show this help');
    console.log('  exit         - Exit the CLI');
  } else if (command === 'load') {
    taskManager.loadFromFile();
  } else if (command === 'save') {
    taskManager.saveToFile();
  } else if (command === 'delete' && args[1]) {
    taskManager.deleteTask(args[1]);
  } else if (command === 'complete' && args[1]) {
    taskManager.completeTask(args[1]);
  } else if (command === 'uncomplete' && args[1]) {
    taskManager.uncompleteTask(args[1]);
  } else if (command === 'exit') {
    rl.close();
  } else {
    console.log('Unknown command. Type "help" for available commands.');
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
