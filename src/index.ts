interface Task {
  id: string;
  title: string;
  completed: boolean;
}

class TaskManager {
  private readonly tasks: Task[] = [];

  addTask(title: string): void {
    // TODO: implement
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
