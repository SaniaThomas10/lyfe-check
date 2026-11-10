
import { useState, useEffect } from "react";
import "./DailyTasks.css";

// Define the information stored for each task.
type Task = {
  id: string;
  text: string;
  completed: boolean;
};

// Key used to save tasks in the browser.
const STORAGE_KEY = "lyfe-check-tasks";

// Daily Tasks component for the Home Dashboard.
function DailyTasks() {

  // Load previously saved tasks when the component starts.
  const [tasks, setTasks] = useState<Task[]>(() => {

    // Retrieve tasks from browser storage.
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      // Convert saved JSON text back into an array.
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        // Only use the saved data if it is an array.
        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.error("Unable to load saved tasks:", error);
    }

    // Start with an empty list if nothing is saved.
    return [];
  });

  // Store what the user types into the input box.
  const [newTask, setNewTask] = useState("");

  // Automatically save tasks whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [tasks]);

  // Add a new task.
  function addTask() {

    // Remove unnecessary spaces.
    const taskText = newTask.trim();

    // Prevent empty tasks.
    if (taskText === "") {
      return;
    }

    // Create a task object with a unique ID.
    const task: Task = {
      id: crypto.randomUUID(),
      text: taskText,
      completed: false,
    };

    // Add the task to the existing list.
    setTasks((previousTasks) => [
      ...previousTasks,
      task
    ]);

    // Clear the input field.
    setNewTask("");
  }

  // Mark a task complete or incomplete.
  function toggleTask(id: string) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  }

  // Delete a task.
  function deleteTask(id: string) {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== id
      )
    );
  }

  // Count completed tasks.
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <section className="daily-tasks">

      {/* Section heading */}
      <div className="tasks-header">
        <h2>Today's Tasks</h2>

        {/* Display completed task count */}
        <span className="tasks-count">
          {completedCount} of {tasks.length} completed
        </span>
      </div>

      {/* Form for adding tasks */}
      <form
        className="task-form"
        onSubmit={(event) => {
          event.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(event) =>
            setNewTask(event.target.value)
          }
          aria-label="New task"
        />

        <button type="submit">
          + Add
        </button>
      </form>

      {/* Message when no tasks exist */}
      {tasks.length === 0 && (
        <p className="empty-tasks">
          No tasks yet. Add your first task!
        </p>
      )}

      {/* Display all tasks */}
      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            className="task-item"
            key={task.id}
          >

            {/* Task completion checkbox */}
            <label className="task-label">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task.id)
                }
              />

              <span
                className={
                  task.completed
                    ? "task-text completed"
                    : "task-text"
                }
              >
                {task.text}
              </span>
            </label>

            {/* Delete task button */}
            <button
              type="button"
              className="delete-task"
              onClick={() =>
                deleteTask(task.id)
              }
              aria-label={`Delete ${task.text}`}
            >
              ×
            </button>

          </div>
        ))}
      </div>

    </section>
  );
}

export default DailyTasks;
