// Defining a task and getter and setter methods to access and update its parameters

export interface SingleTask { 
    id: string,
    task: string,
    note: string,
    date: string,
    completed: boolean,
}

export default class TaskItem implements SingleTask {
    constructor (
        private _id: string = "",
        private _task: string = "",
        private _note: string = "",
        private _date: string = "",
        private _completed: boolean = false
    ) {}

    get id(): string {
        return this._id;
    }
    set id(id: string) {
        this._id = id;
    }
    get task(): string {
        return this._task;
    }
    set task(task: string) {
        this._task = task;
    }
    get note(): string {
        return this._note;
    }
    set note(note: string) {
        this._note = note;
    }
    get date(): string {
        return this._date;
    }
    set date(date: string) {
        this._date = date;
    }
    get completed(): boolean {
        return this._completed;
    }
    set completed(completed: boolean) {
        this._completed = completed;
    }
}