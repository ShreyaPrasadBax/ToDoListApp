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
        const editNoteInput = this.createEditNoteInput();
        const editDateInput = this.createEditDateInput();
        const deleteButton = this.createDeleteButton(task);
        const label = this.createLabel(task);
        const noteLabel = this.createNoteLabel(task);
        const dateLabel = this.createDateLabel(task);
        const [editButton, saveButton] = this.createEditSaveButton(
            editTaskInput,
            editNoteInput, 
            editDateInput,
            label,
            noteLabel,
            dateLabel,
            task,
        );

        li.append (
            checkBox,
            editTaskInput,
            editNoteInput,
            editDateInput,
            label,
            noteLabel,
            dateLabel,
            editButton, 
            saveButton,
            deleteButton
        );
        return li;
    }

    private createCheckBox(task: TaskItem): HTMLInputElement {
        const checkBox = document.createElement("input") as HTMLInputElement;
        checkBox.type = "checkbox";
        checkBox.className = "checkbox";
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

    // Creates input field to modify date time 
    private createEditDateInput(): HTMLInputElement {
        const editDateInput = document.createElement("input") as HTMLInputElement;
        editDateInput.hidden = true;
        editDateInput.type = "date";
        editDateInput.className = "form-date";
        return editDateInput;
    }

    private createEditNoteInput(): HTMLInputElement {
        const editNoteInput = document.createElement("input") as HTMLInputElement;
        editNoteInput.hidden = true;
        editNoteInput.type = "string";
        editNoteInput.className = "form-note";
        return editNoteInput;
    }

    // Create separate procedures for edit and save
    private createEditSaveButton(
        editedTask: HTMLInputElement,
        editNoteInput: HTMLInputElement,
        editDateInput: HTMLInputElement,
        label: HTMLLabelElement,
        noteLabel: HTMLLabelElement,
        dateLabel: HTMLLabelElement,
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
            editNoteInput.hidden = false;
            editNoteInput.value = task.note;
            editDateInput.hidden = false;
            editDateInput.value = task.date;
            label.innerHTML = "";  // It's an empty string otherwise
            dateLabel.innerHTML = "";
            noteLabel.innerHTML = "";
            editButton.hidden = true;
        })

        saveButton.addEventListener("click", () => {
            const updatedTaskText = editedTask.value;
            task.task = updatedTaskText;
            const updatedNote = editNoteInput.value;
            task.note = updatedNote;
            const updatedDate = editDateInput.value;
            task.date = updatedDate;
            this.taskListController.editTask(task.id, updatedTaskText, updatedNote, updatedDate);
            editButton.hidden = false;
            editedTask.hidden = true;
            editNoteInput.hidden = true;
            editDateInput.hidden = true;
            saveButton.hidden = true;
            this.render(this.taskListController.getTaskList());

            console.log(`Task: ${editedTask.value}, Note: ${editNoteInput.value}, Date: ${editDateInput.value}`);

        })

        return [editButton, saveButton];
    }

    // Create delete element for each task 
    private createDeleteButton(task: TaskItem): HTMLButtonElement {
        const deleteButton = document.createElement("button") as HTMLButtonElement;

        deleteButton.className = "btn-primary";
        deleteButton.textContent = "-";

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

    private createDateLabel(task: TaskItem): HTMLLabelElement {
        const dateLabel = document.createElement("label") as HTMLLabelElement;
        dateLabel.textContent = task.date;
        dateLabel.htmlFor = task.id;
        return dateLabel;
    }

    private createNoteLabel(task: TaskItem): HTMLLabelElement {
        const noteLabel = document.createElement("label") as HTMLLabelElement;
        noteLabel.textContent = task.note;
        noteLabel.htmlFor = task.id;
        return noteLabel;
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