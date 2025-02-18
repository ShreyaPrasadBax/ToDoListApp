import "bootstrap/dist/css/bootstrap.min.css"; 
import { v4 as uuid } from "uuid";
import './style.css'
import TaskItem from "./model/TaskItem";
import TaskListController from "./controller/TaskListController";
import TaskListView from "./view/TaskListView.ts";

const taskListController = new TaskListController();
const taskListView = new TaskListView(taskListController);
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const clearBtn = document.getElementById("clear-all-btn") as HTMLButtonElement;
const showCompletedTask = document.getElementById("completed-btn") as HTMLButtonElement;
const showTaskToComplete = document.getElementById("pending-tasks-btn") as HTMLButtonElement;
const showAllTask = document.getElementById("view-tasks-btn") as HTMLButtonElement;
const showOverdueTask = document.getElementById("overdue-tasks-btn") as HTMLButtonElement;

// Additional features 
const openPopup = document.getElementById("add-new-task-btn");
const popup = document.getElementById("popup");
const popupBg = document.getElementById("popup-background");
const closePopup = document.getElementById("close-popup");

if (popup != null && popupBg != null && openPopup != null && closePopup != null) {
  openPopup.addEventListener("click", () => {
    popupBg.style.display = 'block';
  });
  closePopup.addEventListener("click", () => {
    popupBg.style.display = 'none';
  });
}

const initApp = () => {
  const allTask = taskListController.getTaskList();
  taskListView.render(allTask);
};
initApp();

if (todoForm) {
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();  // Prevents default form submission 
    const formData = new FormData(todoForm);
    const todoValue = formData.get("new-todo") as string;
    const noteValue = formData.get("new-note") as string;
    const dateValue = formData.get("new-date") as string;
    if (todoValue == null || todoValue?.toString().trim() === "") return;
    const newTask = new TaskItem(uuid(), todoValue.trim(), noteValue, dateValue);

    console.log(`Task: ${todoValue}, Note: ${noteValue}, Date: ${dateValue}`);
    taskListController.addTask(newTask);

    if (popupBg != null)
      popupBg.style.display = 'none';

    initApp();
    todoForm.reset();
  });
}

clearBtn.addEventListener("click", () => {
  taskListController.clearTask();
  taskListView.clear();
});

showOverdueTask.addEventListener("click", () => {
  const overdueTask = taskListController.getOverdueTask();
  taskListView.render(overdueTask);
})

showCompletedTask.addEventListener("click", () => {
  const completedTask = taskListController.getCompletedTask();
  taskListView.render(completedTask);
});

showTaskToComplete.addEventListener("click", () => {
  const taskToComplete = taskListController.getPendingTask();
  taskListView.render(taskToComplete);
});

showAllTask.addEventListener("click", () => {
  const taskList = taskListController.getTaskList();
  taskListView.render(taskList);
});