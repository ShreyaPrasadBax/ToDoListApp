import "bootstrap/dist/css/bootstrap.min.css"; 
import { v4 as uuid } from "uuid";

import './style.css'

import TaskItem from "./model/TaskItem";
import TaskListController from "./controller/TaskListController";
import TaskListView from "./view/TaskListView.ts";

const taskListController = new TaskListController();
const taskListView = new TaskListView(taskListController);
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
const showCompletedTask = document.getElementById("completed-btn") as HTMLButtonElement;
const showTaskToComplete = document.getElementById("pending-tasks-btn") as HTMLButtonElement;
const showAllTask = document.getElementById("view-tasks-btn") as HTMLButtonElement;

const initApp = () => {
  const allTask = taskListController.getTaskList();
  taskListView.render(allTask);
};

if (todoForm) {
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(todoForm);
    const todoValue = formData.get("new-todo") as string;
    if (todoValue == null || todoValue?.toString().trim() === "") return;
    const newTask = new TaskItem(uuid(), todoValue.trim());

    taskListController.addTask(newTask);

    clearBtn.addEventListener("click", () => {
      taskListController.clearTask();
      taskListView.clear();
    })

    showCompletedTask.addEventListener("click", () => {
      const completedTask = taskListController.getCompletedTask();
      taskListView.render(completedTask);
    })

    showTaskToComplete.addEventListener("click", () => {
      const taskToComplete = taskListController.getPendingTask();
      taskListView.render(taskToComplete);
    })

    initApp();
    todoForm.reset();
  })  
}

/*
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    
  </div>
`
*/