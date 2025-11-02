import * as readline from 'node:readline';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

class TaskManager {
  private readonly tasks: Task[] = [];

  addTask(title: string): void {
    const task: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    this.tasks.push(task);
  }

  listTasks(): void {
    for (const task of this.tasks) {
      console.log(`${task.id}: ${task.title} [${task.completed ? '✓' : ' '}]`);
    }
  }

  completeTask(id: string): void {
    // TODO: implement
  }

  deleteTask(id: string): void {
    // TODO: implement
  }

  saveToFile(): void {
    // TODO: implement
  }

  loadFromFile(): void {
    // TODO: implement
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
console.log('Available commands: add <title>, list, help, exit');
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
    console.log('  help         - Show this help');
    console.log('  exit         - Exit the CLI');
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
