
import type { Task } from "../models/Task.js";

// Store daily tasks temporarily
let tasks: Task[] = [];

// Get all daily tasks
export function getTasks(): Task[] {
  return [...tasks];
}

// Add a new daily task
export function addTask(task: Task): void {
  tasks.push(task);
}

// Update an existing task
export function updateTask(
  id: string,
  updatedTask: Partial<Task>
): boolean {
  const task = tasks.find((task) => task.id === id);

  // Check if the task exists
  if (!task) {
    return false;
  }

  // Update the task information
  Object.assign(task, updatedTask);

  return true;
}

// Mark a task as completed or incomplete
export function toggleTask(id: string): boolean {
  const task = tasks.find((task) => task.id === id);

  // Check if the task exists
  if (!task) {
    return false;
  }

  // Change the completed status
  task.completed = !task.completed;

  return true;
}

// Delete a daily task
export function deleteTask(id: string): boolean {
  const originalLength = tasks.length;

  // Remove the task with the matching ID
  tasks = tasks.filter((task) => task.id !== id);

  return tasks.length < originalLength;
}
