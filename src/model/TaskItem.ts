// Defining a task and getter and setter methods to access and update its parameters

export interface SingleTask { 
    id: string,
    task: string,
    note: string,
    project: string,
    date: string,
    //time: string,
    completed: boolean,
}

export default class TaskItem implements SingleTask {
    constructor (
        private _id: string = "",
        private _task: string = "",
        private _note: string = "",
        private _project: string = "",
        private _date: string = "",
        //private _time: string = "",
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
    get project(): string {
        return this._project;
    }
    set project(project: string) {
        this._project = project;
    }
    get date(): string {
        return this._date;
    }
    set date(date: string) {
        this._date = date;
    }
    /*
    get time(): string {
        return this._time;
    }
    set time(time: string) {
        this._time = time;
    }
        */
    get completed(): boolean {
        return this._completed;
    }
    set completed(completed: boolean) {
        this._completed = completed;
    }
}