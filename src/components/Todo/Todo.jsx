import React, { useState, useCallback } from "react";
import styles from "./todo.module.css";

const TaskList = React.memo(
  ({ tasks, onComplete, onDelete, onMoveToPending, isCompleted }) => {
    console.log(
      isCompleted ? "Rendering Completed Tasks" : "Rendering Pending Tasks"
    );
    return (
      <div className={styles.taskColumn}>
        <h2>{isCompleted ? "Completed Tasks" : "Pending Tasks"}</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className={isCompleted ? styles.completed : ""}>
              {task}
              <div>
                {!isCompleted && (
                  <button onClick={() => onComplete(index)}>Complete</button>
                )}
                <button onClick={() => onDelete(index, isCompleted)}>
                  Delete
                </button>
                {isCompleted && (
                  <button onClick={() => onMoveToPending(index)}>
                    Move to Pending
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

const Todo = () => {
  const [taskInput, setTaskInput] = useState("");
  const [tasksToDo, setTasksToDo] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);

  const handleAddTask = useCallback(() => {
    if (taskInput.trim() === "") return;
    setTasksToDo((prevTasks) => [...prevTasks, taskInput]);
    setTaskInput("");
  }, [taskInput]);

  const handleCompleteTask = useCallback(
    (taskIndex) => {
      const taskToComplete = tasksToDo[taskIndex];
      setTasksToDo((prevTasks) =>
        prevTasks.filter((_, index) => index !== taskIndex)
      );
      setTasksCompleted((prevTasks) => [...prevTasks, taskToComplete]);
    },
    [tasksToDo]
  );

  const handleDeleteTask = useCallback(
    (taskIndex, isCompleted) => {
      if (isCompleted) {
        setTasksCompleted((prevTasks) =>
          prevTasks.filter((_, index) => index !== taskIndex)
        );
      } else {
        setTasksToDo((prevTasks) =>
          prevTasks.filter((_, index) => index !== taskIndex)
        );
      }
    },
    [tasksToDo, tasksCompleted]
  );

  const handleMoveToPending = useCallback(
    (taskIndex) => {
      const taskToMove = tasksCompleted[taskIndex];
      setTasksCompleted((prevTasks) =>
        prevTasks.filter((_, index) => index !== taskIndex)
      );
      setTasksToDo((prevTasks) => [...prevTasks, taskToMove]);
    },
    [tasksCompleted]
  );

  return (
    <div className={styles.Todo}>
      <h1>To-Do List</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className={styles.taskLists}>
        <TaskList
          tasks={tasksToDo}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
          isCompleted={false}
        />
        <TaskList
          tasks={tasksCompleted}
          onDelete={handleDeleteTask}
          onMoveToPending={handleMoveToPending}
          isCompleted={true}
        />
      </div>
    </div>
  );
};

export default Todo;
