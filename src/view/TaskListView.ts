// View interacts with the user/client directly 
// It requests processes to Controller and receives response for the same

import { stringify } from "uuid";
import TaskListController from "../controller/TaskListController";
import TaskItem from "../model/TaskItem";
import TaskList from "../model/TaskList";

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
        const editProjectInput = this.createEditProjectInput();
        const editDateInput = this.createEditDateInput();
        //const editTimeInput = this.createEditTimeInput();
        const deleteButton = this.createDeleteButton(task);
        const label = this.createLabel(task);
        const noteLabel = this.createNoteLabel(task);
        const projectLabel = this.createProjectLabel(task);
        const dateLabel = this.createDateLabel(task);
        //const timeLabel = this.createTimeLabel(task);
        const [editButton, saveButton] = this.createEditSaveButton(
            editTaskInput,
            editNoteInput, 
            editProjectInput,
            editDateInput,
            //editTimeInput,
            label,
            noteLabel,
            projectLabel,
            dateLabel,
            //timeLabel,
            task,
        );

        li.append (
            checkBox,
            editTaskInput,
            editNoteInput,
            editProjectInput,
            editDateInput,
            //editTimeInput,
            label,
            noteLabel,
            projectLabel,
            dateLabel,
            //timeLabel,
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
        editTaskInput.id = "form-control-edit";
        return editTaskInput;
    }

    // Creates input field to modify note 
    private createEditNoteInput(): HTMLInputElement {
        const editNoteInput = document.createElement("input") as HTMLInputElement;
        editNoteInput.hidden = true;
        editNoteInput.type = "string";
        editNoteInput.className = "form-note";
        editNoteInput.id = "form-note-edit";
        return editNoteInput;
    }

    // Creates input field to modify project 
    private createEditProjectInput(): HTMLInputElement {
        const editProjectInput = document.createElement("input") as HTMLInputElement;
        editProjectInput.hidden = true;
        editProjectInput.type = "string";
        editProjectInput.className = "form-project";
        editProjectInput.id = "form-project-edit";
        return editProjectInput;
    }

    // Creates input field to modify date  
    private createEditDateInput(): HTMLInputElement {
        const editDateInput = document.createElement("input") as HTMLInputElement;
        editDateInput.hidden = true;
        editDateInput.type = "date";
        editDateInput.className = "form-date";
        return editDateInput;
    }

    // Create input field to modify time 
    // Not in use 
    private createEditTimeInput(): HTMLInputElement {
        const editTimeInput = document.createElement("input") as HTMLInputElement;
        editTimeInput.hidden = true;
        editTimeInput.type = "time";
        editTimeInput.className = "form-time";
        return editTimeInput;
    }

    // Create separate procedures for edit and save
    private createEditSaveButton(
        editedTask: HTMLInputElement,
        editNoteInput: HTMLInputElement,
        editProjectInput: HTMLInputElement,
        editDateInput: HTMLInputElement,
        //editTimeInput: HTMLInputElement,
        label: HTMLLabelElement,
        noteLabel: HTMLLabelElement,
        projectLabel: HTMLLabelElement,
        dateLabel: HTMLLabelElement,
        //timeLabel: HTMLLabelElement,
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
            editProjectInput.hidden = false;
            editProjectInput.value = task.project;
            editDateInput.hidden = false;
            editDateInput.value = task.date;
            //editTimeInput.hidden = false;
            //editTimeInput.value = task.time;
            label.innerHTML = "";  // It's an empty string otherwise
            noteLabel.innerHTML = "";
            projectLabel.innerHTML = "";
            dateLabel.innerHTML = "";
            //timeLabel.innerHTML = "";
            editButton.hidden = true;
        })

        saveButton.addEventListener("click", () => {
            const updatedTaskText = editedTask.value;
            task.task = updatedTaskText;
            const updatedNote = editNoteInput.value;
            task.note = updatedNote;
            const updatedProject = editProjectInput.value;
            task.project = updatedProject;
            const updatedDate = editDateInput.value;
            task.date = updatedDate;
            //const updatedTime = editTimeInput.value;
            //task.time = updatedTime;
            this.taskListController.editTask(task.id, updatedTaskText, updatedNote, updatedProject, updatedDate);
            editButton.hidden = false;
            editedTask.hidden = true;
            editNoteInput.hidden = true;
            editProjectInput.hidden = true;
            editDateInput.hidden = true;
            //editTimeInput.hidden = true;
            saveButton.hidden = true;
            this.render(this.taskListController.getTaskList());

            console.log(`Task: ${editedTask.value}, Note: ${editNoteInput.value}, Project: ${editProjectInput.value}, Date: ${editDateInput.value}`);

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
        label.className = "task-label";
        return label;
    }

    private createNoteLabel(task: TaskItem): HTMLLabelElement {
        const noteLabel = document.createElement("label") as HTMLLabelElement;
        noteLabel.textContent = task.note;
        noteLabel.htmlFor = task.id;
        noteLabel.className = "note-label";
        return noteLabel;
    }

    private createProjectLabel(task: TaskItem): HTMLLabelElement {
        const projectLabel = document.createElement("label") as HTMLLabelElement;
        projectLabel.textContent = task.project;
        projectLabel.htmlFor = task.id;
        projectLabel.className = "project-label";
        return projectLabel;
    }

    private createDateLabel(task: TaskItem): HTMLLabelElement {
        const dateLabel = document.createElement("label") as HTMLLabelElement;
        dateLabel.textContent = task.date;
        dateLabel.htmlFor = task.id;
        dateLabel.className = "date-label";
        return dateLabel;
    }

    // Not in use
    /*
    private createTimeLabel(task: TaskItem): HTMLLabelElement {
        const timeLabel = document.createElement("label") as HTMLLabelElement;
        timeLabel.textContent = task.time;
        timeLabel.htmlFor = task.id;
        return timeLabel;
    }
    */
    
    // Render all tasks as unordered list elements 
    render(allTasks: TaskItem[]): void {
        this.clear();

        allTasks.forEach((task) => {
            const li = this.createTaskListElement(task);
            this.ul.append(li);
        })
    }   

    /*
    // Create task tile for each task and append new task in tile 
    private createTaskTile(task: TaskItem): HTMLDivElement{
        const taskTile = document.createElement("div") as HTMLDivElement;
        taskTile.className = "task-box";
        const taskTileContainer = document.createElement("div") as HTMLDivElement;
        taskTileContainer.className = "task-box-container";
        const fragment = document.createDocumentFragment();
        
        const taskTitle = document.createElement("p") as HTMLParagraphElement;
        taskTitle.innerHTML = task.task;
        const taskNote = document.createElement("p") as HTMLParagraphElement;
        taskNote.innerHTML = task.note;
        const taskProject = document.createElement("p") as HTMLParagraphElement;
        taskProject.innerHTML = task.project;
        const taskDate = document.createElement("p") as HTMLParagraphElement;
        taskDate.innerHTML = task.date;
        const taskTime = document.createElement("p") as HTMLParagraphElement;
        taskTime.innerHTML = task.time;

        fragment.appendChild(taskTitle);
        fragment.appendChild(taskNote);
        fragment.appendChild(taskProject);
        fragment.appendChild(taskDate);
        fragment.appendChild(taskTime);
        taskTileContainer.appendChild(fragment);
        taskTile.appendChild(taskTileContainer);

        return taskTile;
        
        // Alternative
        if (taskTile) {
            taskTitle.textContent = task.task.toString();
            taskNote.textContent = task.note.toString();
            taskProject.textContent = task.project.toString();
            taskDate.textContent = task.date.toString();
            taskTime.textContent = task.time.toString();
        }
        return taskTile;
    }

    render(allTasks: TaskItem[]): void {
        this.clear();

        allTasks.forEach((task) => {
            const li = this.createTaskListElement(task);
            const container = document.createElement("div") as HTMLDivElement;
            container.className = "task-box";
            container.appendChild(li);
            this.ul.append(li);
            
            // Alternative 
            console.log("List elements:");
            console.log(li);
            console.log()

            const taskTile = this.createTaskTile(li);
            taskTile
            
        })
    }
    */
}