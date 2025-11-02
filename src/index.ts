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

const args = process.argv.slice(2);

if (args[0] === 'add' && args[1]) {
  taskManager.addTask(args.slice(1).join(' '));
} else if (args[0] === 'list') {
  taskManager.listTasks();
} else {
  console.log('Usage: add <title> or list');
}
