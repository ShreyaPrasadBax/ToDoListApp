// View interacts with the user/client directly 
// It requests processes to Controller and receives response for the same

import TaskListController from "../controller/TaskListController";
import TaskItem from "../model/TaskItem";

interface DOMList {
    clear(): void;
    render(allTasks: TaskItem[]): void;
}

export default class TaskListView implements DOMList {
    private taskListController: TaskListController; 
    private ul: HTMLUListElement;
    constructor (taskListController: TaskListController) {
        this.ul = document.getElementById("taskList") as HTMLUListElement;
        this.taskListController = taskListController;

        if (!this.ul)
            throw console.error("Unordered list not found in document");
    }

    clear(): void {
        this.ul.innerHTML = "";
    }

    private createTaskListElement(task: TaskItem): HTMLLIElement {
        const li = document.createElement("li") as HTMLLIElement;
        li.className = "list-group-item";
        li.dataset.taskId = task.id;

        const checkBox = this.createCheckBox(task);
        const editTaskInput = this.createEditTaskInput();
        const deleteButton = this.createDeleteButton(task);
        const label = this.createLabel(task);
        const [editButton, saveButton] = this.createEditSaveButton(
            editTaskInput,
            label,
            task,
        );

        li.append (
            checkBox,
            editTaskInput,
            label,
            editButton, 
            saveButton,
            deleteButton
        );
        return li;
    }

    private createCheckBox(task: TaskItem): HTMLInputElement {
        const checkBox = document.createElement("input") as HTMLInputElement;
        checkBox.type = "checkbox";
        checkBox.checked = task.completed;
        checkBox.addEventListener("click", () => {
            this.taskListController.toggleTask(task.id);
        })
        return checkBox;
    }

    // Creates the input field on clicking edit task  
    // className is used to get/set value 
    // class is used to access html element  
    private createEditTaskInput(): HTMLInputElement {
        const editTaskInput = document.createElement("input") as HTMLInputElement;
        editTaskInput.hidden = true;
        editTaskInput.type = "string";
        editTaskInput.className = "form-control";
        return editTaskInput;
    }

    // Create separate procedures for edit and save
    private createEditSaveButton(
        editedTask: HTMLInputElement,
        label: HTMLLabelElement,
        task: TaskItem
        ): HTMLButtonElement[] {

        const editButton = document.createElement("button") as HTMLButtonElement;
        editButton.hidden = false;
        editButton.textContent = "Edit";
        editButton.className = "btn-success";

        const saveButton = document.createElement("button") as HTMLButtonElement;
        saveButton.hidden = true;
        saveButton.textContent = "Save";
        saveButton.className = "btn-warning";

        editButton.addEventListener("click", () => {
            saveButton.hidden = false;
            editedTask.hidden = false;
            editedTask.value = task.task;
            label.innerHTML = "Add task";  // It's an empty string otherwise
            editButton.hidden = true;
        })

        saveButton.addEventListener("click", () => {
            const updatedTaskText = editedTask.value;
            task.task = updatedTaskText;
            this.taskListController.editTask(task.id, updatedTaskText);
            editButton.hidden = false;
            editedTask.hidden = true;
            saveButton.hidden = true;
            this.render(this.taskListController.getTaskList());
        })

        return [editButton, saveButton];
    }

    // Create delete element for each task 
    private createDeleteButton(task: TaskItem): HTMLButtonElement {
        const deleteButton = document.createElement("button") as HTMLButtonElement;

        deleteButton.className = "btn-primary";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener('click', () => {
            this.taskListController.deleteTask(task.id);
            this.render(this.taskListController.getTaskList());
        });

        return deleteButton;
    }

    private createLabel(task: TaskItem): HTMLLabelElement {
        const label = document.createElement("label") as HTMLLabelElement;
        label.textContent = task.task;
        label.htmlFor = task.id;
        return label;
    }

    // Render all tasks as unordered list elements 
    render(allTasks: TaskItem[]): void {
        this.clear();

        allTasks.forEach((task) => {
            const li = this.createTaskListElement(task);
            this.ul.append(li);
        })
    }   
}