"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["ACTIVE"] = "active";
    TaskStatus["COMPLETED"] = "completed";
})(TaskStatus || (TaskStatus = {}));
class Task {
    allTasks = [];
    activeTasks = [];
    completedTasks = [];
    taskSection = document.querySelector(".section__content");
    visibleTasks = "all";
    constructor() {
        const tasks = localStorage.getItem("tasks");
        if (tasks) {
            const convertedTasks = JSON.parse(tasks);
            this.allTasks = convertedTasks;
            this.showSelectedTasks("all");
        }
    }
    createTask(validate) {
        this.allTasks.push({
            taskName: validate.taskName,
            taskId: validate.taskId,
            status: validate.status,
        });
        const el = this.insertTask({ taskName: validate.taskName,
            taskId: validate.taskId,
            status: validate.status, });
        if (this.visibleTasks === "all") {
            this.taskSection.insertAdjacentHTML("beforeend", el);
            this.showNumOfTasks(this.allTasks);
            this.addDraggItems();
        }
        if (this.visibleTasks === TaskStatus.ACTIVE) {
            this.taskSection.insertAdjacentHTML("beforeend", el);
            const activeTasksArr = this.allTasks.filter(task => task.status === TaskStatus.ACTIVE);
            this.activeTasks = activeTasksArr;
            this.showNumOfTasks(this.activeTasks);
            this.addDraggItems();
        }
        const tasksUl = [...this.taskSection.childNodes];
        const liEl = tasksUl.find(el => el.dataset.taskid === validate.taskId);
        const btnTask = liEl.querySelector(".button-task");
        const btnText = liEl.querySelector(".button-content-text");
        const btnDelete = liEl.querySelector(".button-delete");
        btnTask.addEventListener("click", this.toggleFinishActiveTask.bind(this));
        btnText.addEventListener("click", this.toggleFinishActiveTask.bind(this));
        btnDelete.addEventListener("click", this.deleteTask.bind(this));
    }
    showSelectedTasks(status) {
        if (status === "all") {
            this.filteredTasks(this.allTasks);
            this.showNumOfTasks(this.allTasks);
        }
        if (status === TaskStatus.ACTIVE) {
            this.filteredTasks(this.activeTasks, TaskStatus.ACTIVE);
            this.showNumOfTasks(this.activeTasks);
        }
        if (status === TaskStatus.COMPLETED) {
            this.filteredTasks(this.completedTasks, TaskStatus.COMPLETED);
            this.showNumOfTasks(this.completedTasks);
        }
        if (this.visibleTasks !== status)
            this.visibleTasks = status;
        this.addDraggItems();
    }
    clearCompletedTasks() {
        this.completedTasks = [];
        const clearedTasks = this.allTasks.filter((el) => el.status === TaskStatus.ACTIVE);
        this.allTasks = clearedTasks;
        if (this.visibleTasks === "all") {
            const shownTasks = [...this.taskSection.childNodes];
            shownTasks.forEach(el => {
                if (el.dataset.status === TaskStatus.COMPLETED)
                    el.remove();
            });
            this.allTasks = this.allTasks.filter(el => el.status !== TaskStatus.COMPLETED);
            this.showNumOfTasks(this.allTasks);
        }
        if (this.visibleTasks === TaskStatus.COMPLETED)
            this.showSelectedTasks(TaskStatus.COMPLETED);
    }
    insertTask(validate) {
        return `<li draggable="true" data-status=${validate.status} data-taskId=${validate.taskId} class="task-row">
    <button id=${validate.status === TaskStatus.ACTIVE ? null : "checked-btn"} class="button-task">
    <svg id="check-icon" class=${validate.status === TaskStatus.ACTIVE ? "hidden" : null} xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
    </button>
    <button id=${validate.status === TaskStatus.ACTIVE ? null : "crossed-text"} class="button-content-text">
      <p class="content-text">${validate.taskName}</p>
    </button>
    <button class="button-delete">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path
          fill="#494C6B"
          fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
      </svg>
    </button>
  </li>`;
    }
    filteredTasks(wantedTasks, taskStatus) {
        if (taskStatus) {
            const filteredArr = this.allTasks.filter((task) => task.status === taskStatus);
            taskStatus === "active"
                ? (this.activeTasks = filteredArr)
                : (this.completedTasks = filteredArr);
            wantedTasks = filteredArr;
        }
        const tasksArr = wantedTasks.map((task) => this.insertTask({
            taskId: task.taskId,
            taskName: task.taskName,
            status: task.status,
        }));
        this.taskSection.innerHTML = tasksArr.toString().replaceAll(",", "");
        const btnCheckTask = [...document.querySelectorAll(".button-task")];
        const btnCheckText = [
            ...document.querySelectorAll(".button-content-text"),
        ];
        const btnDeleteTask = [
            ...document.querySelectorAll(".button-delete"),
        ];
        btnCheckTask.forEach(btnEl => btnEl.addEventListener("click", this.toggleFinishActiveTask.bind(this)));
        btnCheckText.forEach(btnEl => btnEl.addEventListener("click", this.toggleFinishActiveTask.bind(this)));
        btnDeleteTask.forEach(btnEl => btnEl.addEventListener("click", this.deleteTask.bind(this)));
    }
    addDraggItems() {
        const draggableItems = document.querySelectorAll(".task-row");
        const getDragAfterElement = (y) => {
            const draggableElements = [
                ...this.taskSection.querySelectorAll(".task-row:not(.dragging)"),
            ];
            const returnedEl = draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                }
                else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY });
            return returnedEl.element;
        };
        draggableItems.forEach((draggable) => {
            draggable.addEventListener("dragstart", () => {
                draggable.classList.add("dragging");
            });
            draggable.addEventListener("dragend", () => {
                draggable.classList.remove("dragging");
                const arrOrder = [...this.taskSection.childNodes];
                let changedArr = [];
                arrOrder.forEach((el) => {
                    const pEl = el.querySelector(".content-text");
                    changedArr.push({
                        taskId: el.dataset.taskid,
                        taskName: pEl.textContent,
                        status: el.dataset.status,
                    });
                });
                if (this.visibleTasks === "all")
                    this.allTasks = changedArr;
                if (this.visibleTasks === TaskStatus.ACTIVE)
                    this.activeTasks = changedArr;
                if (this.visibleTasks === TaskStatus.COMPLETED)
                    this.completedTasks = changedArr;
            });
        });
        this.taskSection.addEventListener("dragover", (event) => {
            event.preventDefault();
            const afterElement = getDragAfterElement(event.clientY);
            const draggable = document.querySelector(".dragging");
            if (afterElement != null) {
                this.taskSection.insertBefore(draggable, afterElement);
            }
        });
    }
    deleteTask(event) {
        const arrEl = event.composedPath();
        const liEl = arrEl.find((el) => el.className === "task-row");
        const id = liEl.dataset.taskid;
        const filteredArr = this.allTasks.filter((task) => task.taskId !== id);
        this.allTasks = filteredArr;
        liEl.remove();
        if (this.visibleTasks === "all") {
            this.allTasks = this.allTasks.filter((task) => task.taskId !== id);
            this.allTasks = filteredArr;
            this.showNumOfTasks(this.allTasks);
        }
        if (this.visibleTasks === TaskStatus.ACTIVE) {
            this.activeTasks = this.activeTasks.filter((task) => task.taskId !== id);
            this.showNumOfTasks(this.activeTasks);
        }
        if (this.visibleTasks === TaskStatus.COMPLETED) {
            this.completedTasks = this.completedTasks.filter((task) => task.taskId !== id);
            this.showNumOfTasks(this.completedTasks);
        }
    }
    toggleFinishActiveTask(event) {
        const arrEl = event.composedPath();
        const liEl = arrEl.find((el) => el.className === "task-row");
        const arrOfChildEl = [...liEl.childNodes];
        const btnCheck = arrOfChildEl.find((el) => el.className === "button-task");
        const arrOfChildBtnCheck = [...btnCheck.childNodes];
        const checkSvg = arrOfChildBtnCheck.find((el) => el.id === "check-icon");
        const btnCheckText = arrOfChildEl.find((el) => el.className === "button-content-text");
        if (liEl.dataset.status === TaskStatus.ACTIVE) {
            liEl.dataset.status = TaskStatus.COMPLETED;
            checkSvg.classList.remove("hidden");
            btnCheck.id = "checked-btn";
            btnCheckText.id = "crossed-text";
            const task = this.allTasks.find((taskEl) => taskEl.taskId === liEl.dataset.taskid);
            task.status = TaskStatus.COMPLETED;
            if (this.visibleTasks === TaskStatus.ACTIVE) {
                liEl.remove();
                const filteredArr = this.activeTasks.filter((task) => task.taskId !== liEl.dataset.taskid);
                this.activeTasks = filteredArr;
                this.showNumOfTasks(this.activeTasks);
            }
        }
        else {
            liEl.dataset.status = TaskStatus.ACTIVE;
            checkSvg.classList.add("hidden");
            btnCheck.id = "";
            btnCheckText.id = "";
            const task = this.allTasks.find((task) => task.taskId === liEl.dataset.taskid);
            task.status = TaskStatus.ACTIVE;
            if (this.visibleTasks === TaskStatus.COMPLETED) {
                liEl.remove();
                const filteredArr = this.completedTasks.filter((task) => task.taskId !== liEl.dataset.taskid);
                this.completedTasks = filteredArr;
                this.showNumOfTasks(this.completedTasks);
            }
        }
    }
    ;
    showNumOfTasks(wantedTasks) {
        const itemsLeft = document.querySelector(".content_footer-items");
        itemsLeft.textContent =
            wantedTasks.length > 0
                ? `${wantedTasks.length} item${wantedTasks.length === 1 ? "" : "s"} left`
                : "No tasks";
        return true;
    }
}
__decorate([
    autobind
], Task.prototype, "deleteTask", null);
__decorate([
    autobind
], Task.prototype, "toggleFinishActiveTask", null);
const app = new Task();
const inputTask = document.querySelector("form");
const inputEl = inputTask.querySelector(".task");
inputTask.addEventListener("submit", (event) => {
    const inputValue = document.getElementById("task");
    event.preventDefault();
    if (inputValue.value === "")
        return;
    const taskId = Math.random().toString();
    app.createTask({
        taskId,
        taskName: inputValue.value,
        status: TaskStatus.ACTIVE,
    });
    inputValue.value = "";
});
const [allBtn1, allBtn2] = [...document.querySelectorAll(".all")];
const [activeBtn1, activeBtn2] = [...document.querySelectorAll(".active")];
const [finishedBtn1, finishedBtn2] = [...document.querySelectorAll(".completed")];
const checkShownTasks = (activeBtn, inactiveBtn1, inactiveBtn2) => {
    if (!activeBtn.classList.contains("active-btn"))
        activeBtn.classList.add("active-btn");
    if (inactiveBtn1.classList.contains("active-btn"))
        inactiveBtn1.classList.remove("active-btn");
    if (inactiveBtn2.classList.contains("active-btn"))
        inactiveBtn2.classList.remove("active-btn");
};
allBtn1.addEventListener("click", () => {
    app.showSelectedTasks("all");
    checkShownTasks(allBtn1, activeBtn1, finishedBtn1);
    inputEl.removeAttribute("disabled");
});
allBtn2.addEventListener("click", () => {
    app.showSelectedTasks("all");
    checkShownTasks(allBtn2, activeBtn2, finishedBtn2);
    inputEl.removeAttribute("disabled");
});
activeBtn1.addEventListener("click", () => {
    app.showSelectedTasks(TaskStatus.ACTIVE);
    checkShownTasks(activeBtn1, allBtn1, finishedBtn1);
    inputEl.removeAttribute("disabled");
});
activeBtn2.addEventListener("click", () => {
    app.showSelectedTasks(TaskStatus.ACTIVE);
    checkShownTasks(activeBtn2, allBtn2, finishedBtn2);
    inputEl.removeAttribute("disabled");
});
finishedBtn1.addEventListener("click", () => {
    app.showSelectedTasks(TaskStatus.COMPLETED);
    checkShownTasks(finishedBtn1, allBtn1, activeBtn1);
    inputEl.setAttribute("disabled", "");
});
finishedBtn2.addEventListener("click", () => {
    app.showSelectedTasks(TaskStatus.COMPLETED);
    checkShownTasks(finishedBtn2, allBtn2, activeBtn2);
    inputEl.setAttribute("disabled", "");
});
const clearCompletedBtn = document.querySelector(".button-clear");
clearCompletedBtn.addEventListener("click", () => {
    app.clearCompletedTasks();
});
const btn = document.querySelector(".test");
window.addEventListener("beforeunload", () => {
    const convertedArr = JSON.stringify(app.allTasks);
    localStorage.setItem("tasks", convertedArr);
});
