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
    // TODO: implement
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

console.log('Hello World');
