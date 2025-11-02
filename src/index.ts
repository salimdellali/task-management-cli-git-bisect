import * as readline from 'node:readline';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

class TaskManager {
  private readonly tasks: Task[] = [];

  addTask(title: string): void {
    const task: Task = {
      id: randomUUID().substring(0, 4),
      title,
      completed: false,
    };
    this.tasks.push(task);
  }

  listTasks(): void {
    console.log('ID   | Status | Title');
    console.log('-----|--------|------');
    for (const task of this.tasks) {
      const status = task.completed ? '\x1b[32m✓\x1b[0m' : ' ';
      console.log(`${task.id.padEnd(4)} |   ${status}    | ${task.title}`);
    }
  }

  completeTask(id: string): void {
    // TODO: implement
  }

  deleteTask(id: string): void {
    // TODO: implement
  }

  saveToFile(): void {
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/tasks.json', JSON.stringify(this.tasks, null, 2));
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
console.log('Available commands: add <title>, list, load, save, help, exit');
rl.prompt();

rl.on('line', (input) => {
  const args = input.trim().split(/\s+/);
  const command = args[0];

  if (command === 'add' && args[1]) {
    taskManager.addTask(args.slice(1).join(' '));
  } else if (command === 'list') {
    taskManager.listTasks();
    } else if (command === 'help') {
    console.log('Available commands:');
    console.log('  add <title>  - Add a new task');
    console.log('  list         - List all tasks');
    console.log('  load         - Load tasks from file');
    console.log('  save         - Save tasks to file');
    console.log('  help         - Show this help');
    console.log('  exit         - Exit the CLI');
  } else if (command === 'load') {
    taskManager.loadFromFile();
  } else if (command === 'save') {
    taskManager.saveToFile();
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
