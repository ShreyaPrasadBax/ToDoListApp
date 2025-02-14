// Bridges connection between model and view 
// Requests data from model and renders content onto view 

import TaskItem from "../model/TaskItem";
import TaskList from "../model/TaskList";

interface Controller {
    getTaskList(): TaskItem[];
    addTask(newTask: TaskItem): void;
    deleteTask(taskId: string): void;
    editTask(taskId: string, updatedTaskString: string): void;
    loadTask(): void;
    clearTask(): void;
    saveTask(): void;
    toggleTask(taskId: string): void;
    getPendingTask(): TaskItem[];
    getCompletedTask(): TaskItem[];
}

export default class TaskListController implements Controller {
    private _taskList: TaskList = new TaskList();

    constructor() {
        this.loadTask();
    }

    getTaskList(): TaskItem[] {
        return this._taskList.tasks;
    }

    addTask(newTask: TaskItem): void {
        this._taskList.addTask(newTask);
    }

    deleteTask(taskId: string): void {
        this._taskList.removeTask(taskId);
    }

    clearTask(): void {
        this._taskList.clearTask();
    }

    editTask(taskId: string, updatedTaskString: string): void {
        this._taskList.editTask(taskId, updatedTaskString);
    }

    loadTask(): void {
        this._taskList.load();
    }

    saveTask(): void {
        this._taskList.save();
    }

    toggleTask(taskId: string): void {
        this._taskList.toggleTaskChange(taskId);
    }

    getCompletedTask(): TaskItem[] {
        const completedTask = this._taskList.getCompletedTask();
        return completedTask;
    }

    getPendingTask(): TaskItem[] {
        const pendingTask = this._taskList.getTaskToComplete();
        return pendingTask;
    }
}
