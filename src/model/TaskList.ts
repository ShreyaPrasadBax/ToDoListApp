// Manages collection of task items and performs CRUD operations on them 
// Accesses database (JSON) to retrieve and update data as and when updated on View
import TaskItem from "./TaskItem";

interface AllTasks {
    tasks: TaskItem[];
    load(): void;
    save(): void;
    clearTask(): void;
    addTask(taskObj: TaskItem): void;
    removeTask(id: string): void;
    editTask(id: string, updatedString: string, updatedNote: string, updatedProject: string, updatedDate: string): void;
    toggleTaskChange(id: string): void;
    getCompletedTask(): TaskItem[];
    getTaskToComplete(): TaskItem[];
    getOverdueTask(): TaskItem[];
}

export default class TaskList implements AllTasks {
    private _tasks: TaskItem[] = [];

    get tasks(): TaskItem[] {
        return this._tasks;
    }

    // Load JSON data 
    load(): void {
        const storedTasks: string | null = localStorage.getItem("myTodo");
        if (!storedTasks) return;

        const parsedTaskList: {
            _id: string,
            _task: string, 
            _note: string, 
            _project: string,
            _date: string,
            //_time: string,
            _completed: boolean
        } [] = JSON.parse(storedTasks);

        parsedTaskList.forEach((obj) => {
            const newTaskItem = new TaskItem (
                obj._id,
                obj._task,
                obj._note,
                obj._project,
                obj._date,
                //obj._time, 
                obj._completed,
            );

            this.addTask(newTaskItem);
        });
    }

    // Save task data onto JSON file 
    save(): void {
        localStorage.setItem("myTodo", JSON.stringify(this._tasks));
    }

    // Delete all tasks 
    clearTask(): void {
        this._tasks = [];
        localStorage.removeItem("myTodo");
    }

    // Add a new task to the existing array of tasks 
    addTask(taskObj: TaskItem): void {
        this._tasks.push(taskObj);
        this.save();
    }

    // Remove a task from the list 
    removeTask(id: string): void {
        this._tasks = this._tasks.filter((task) => task.id != id);
        this.save();
    }

    // Modify the contents of an existing array of tasks 
    editTask(id: string, updatedString: string, updatedNote: string, updatedProject: string, updatedDate: string): void {
        // if (updatedString.trim === "") return;
        
        const taskEdit = this._tasks.find((task) => task.id === id);
        if (!taskEdit) return;
        taskEdit.task = updatedString;
        taskEdit.note = updatedNote;
        taskEdit.project = updatedProject;
        taskEdit.date = updatedDate;
        //taskEdit.time = updatedTime;
        this.save();
    }

    // Toggles completed property  
    toggleTaskChange(id: string): void {
        const toggleTask = this._tasks.find((task) => task.id === id);
        if (!toggleTask) return;
        toggleTask.completed = !toggleTask.completed;
        this.save();
    }
    
    // Return tasks that are completed 
    getCompletedTask(): TaskItem[] {
        const completedTask = this._tasks.filter((task) => task.completed);
        return completedTask; 
    }

    // Return tasks that are yet to be completed 
    getTaskToComplete(): TaskItem[] {
        const completedTask = this._tasks.filter((task) => !task.completed);
        return completedTask; 
    }

    //// CHECK TIME 
    // If deadline has surpassed and task is not completed 
    getOverdueTask(): TaskItem[] {
        const currDate = new Date();
        const overdueTask = this._tasks.filter((task) => new Date(task.date) < currDate && !task.completed);
        return overdueTask;
    }
}