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
const showAllProject = document.getElementById ("dropdown-btn") as HTMLButtonElement;
const showAllTask = document.getElementById("view-tasks-btn") as HTMLButtonElement;
const showOverdueTask = document.getElementById("overdue-tasks-btn") as HTMLButtonElement;

// Popup window to add new task
const openPopup = document.getElementById("add-new-task-btn");
const popup = document.getElementById("popup");
const popupBg = document.getElementById("popup-background");
const closePopup = document.getElementById("close-popup");

//// Clear the fields on closing the popup 
if (popup != null && popupBg != null && openPopup != null && closePopup != null) {
  openPopup.addEventListener("click", () => {
    console.log("Add element button activated");
    popupBg.style.display = 'block';
  });
  closePopup.addEventListener("click", () => {
    popupBg.style.display = 'none';
  });
}

// Light mode and dark mode swap 
// If checked, theme becomes dark else light 
const body = document.getElementById("body-id") as HTMLElement;
const checkTheme = document.getElementById("checkboxTheme") as HTMLInputElement;
checkTheme.addEventListener("change", () => {
  if (checkTheme.checked) {
    body.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  }
})

// SIDENAV NOT FUNCTIONING AS OF YET 
// Sidenav dropdown feature 
/*
const dropdownSideNav = document.getElementsByClassName("dropdown-btn");
var i;

for (i=0 ; i<dropdownSideNav.length ; i++) {
  dropdownSideNav[i].addEventListener("click", () => {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}
*/

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
    const projectValue = formData.get("new-project") as string;
    const dateValue = formData.get("new-date") as string;
    if (todoValue == null || todoValue?.toString().trim() === "") return;
    const newTask = new TaskItem(uuid(), todoValue.trim(), noteValue, projectValue, dateValue);

    console.log(`Task: ${todoValue}, Note: ${noteValue}, Project: ${projectValue}, Date: ${dateValue}`);
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
  console.log(`Tasks cleared`);
});

showOverdueTask.addEventListener("click", () => {
  const overdueTask = taskListController.getOverdueTask();
  taskListView.render(overdueTask);
  console.log(`Overdue tasks: ${overdueTask}`);
})

showCompletedTask.addEventListener("click", () => {
  const completedTask = taskListController.getCompletedTask();
  taskListView.render(completedTask);
  console.log(`Completed task: ${completedTask}`);
});

showTaskToComplete.addEventListener("click", () => {
  const taskToComplete = taskListController.getPendingTask();
  taskListView.render(taskToComplete);
  console.log(`Pending tasks: ${taskToComplete}`);
});

showAllTask.addEventListener("click", () => {
  const taskList = taskListController.getTaskList();
  taskListView.render(taskList);
  console.log(`Task list: ${taskList}`);
});