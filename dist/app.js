"use strict";
const themeBtn = document.querySelector(".button-theme");
const root = document.querySelector(":root");
const moonIcon = document.querySelector(".moon-icon");
const sunIcon = document.querySelector(".sun-icon");
const mobileImg = document.getElementById("mobile-img");
const desktopImg = document.getElementById("desktop-img");
const image = document.querySelector(".landing__image");
const changeColors = (...colors) => {
    const [c1, c2, c3, c4, c5, c6] = colors;
    root.style.setProperty("--bg-primary", c1);
    root.style.setProperty("--color-primary", c2);
    root.style.setProperty("--color-secondary", c3);
    root.style.setProperty("--text-primary", c4);
    root.style.setProperty("--text-secondary", c5);
    root.style.setProperty("--text-secondary-hover", c6);
};
const darkTheme = () => {
    changeColors("#161722", "#25273c", "#4d5066", "#cacde8", "#393a4c", "#e4e5f1");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    mobileImg.setAttribute("srcset", "./images/bg-mobile-dark.jpg");
    desktopImg.setAttribute("srcset", "./images/bg-desktop-dark.jpg");
    image.setAttribute("src", "./images/bg-mobile-dark.jpg");
};
const lightTheme = () => {
    changeColors("#e4e5f1", "#fafafa", "#e4e5f1", "#484b6a", "#d2d3db", "#9394a5");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    mobileImg.setAttribute("srcset", "./images/bg-mobile-light.jpg");
    desktopImg.setAttribute("srcset", "./images/bg-desktop-light.jpg");
    image.setAttribute("src", "./images/bg-mobile-light.jpg");
};
const switchTheme = () => {
    if (window.getComputedStyle(root).getPropertyValue("--color-primary") ===
        " #fafafa" ||
        window.getComputedStyle(root).getPropertyValue("--color-primary") ===
            "#fafafa") {
        darkTheme();
    }
    else {
        lightTheme();
    }
};
themeBtn.addEventListener("click", switchTheme);
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
    constructor() { }
    createTask(validate) {
        this.allTasks.push({
            taskName: validate.taskName,
            taskId: validate.taskId,
            status: validate.status,
        });
        this.callSelectedTasks();
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
        this.addCompletedTaskBtn();
        this.addBtnDelete();
        this.addDraggItems();
    }
    clearCompletedTasks() {
        this.completedTasks = [];
        const clearedTasks = this.allTasks.filter((el) => el.status === TaskStatus.ACTIVE);
        this.allTasks = clearedTasks;
        this.callSelectedTasks();
    }
    callSelectedTasks() {
        if (this.visibleTasks === "all")
            this.showSelectedTasks("all");
        if (this.visibleTasks === TaskStatus.ACTIVE)
            this.showSelectedTasks(TaskStatus.ACTIVE);
        if (this.visibleTasks === TaskStatus.COMPLETED)
            this.showSelectedTasks(TaskStatus.COMPLETED);
    }
    insertTask(validate) {
        return `<li draggable="true" data-task=${validate.taskName} data-status=${validate.status} data-taskId=${validate.taskId} class="task-row">
    <button id=${validate.status === TaskStatus.ACTIVE ? null : "checked-btn"} class="button-task">
    <svg id="check-icon" class=${validate.status === TaskStatus.ACTIVE ? "hidden" : null} xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
    </button>
    <button class="button-content-text">
      <p id=${validate.status === TaskStatus.ACTIVE ? null : "crossed-text"} class="content-text">${validate.taskName}</p>
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
            console.log(afterElement);
            const draggable = document.querySelector(".dragging");
            if (afterElement != null) {
                this.taskSection.insertBefore(draggable, afterElement);
            }
        });
    }
    addBtnDelete() {
        const btnDeleteTask = [
            ...document.querySelectorAll(".button-delete"),
        ];
        btnDeleteTask.forEach((btn) => btn.addEventListener("click", (event) => {
            const arrEl = event.composedPath();
            const liEl = arrEl.find((el) => el.className === "task-row");
            const id = liEl.dataset.taskid;
            const filteredArr = this.allTasks.filter((task) => task.taskId !== id);
            this.allTasks = filteredArr;
            this.callSelectedTasks();
        }));
    }
    addCompletedTaskBtn() {
        const btnCheckTask = [...document.querySelectorAll(".button-task")];
        const btnCheckText = [
            ...document.querySelectorAll(".button-content-text"),
        ];
        const switchingTaskStatus = (event) => {
            const arrEl = event.composedPath();
            const liEl = arrEl.find((el) => el.className === "task-row");
            const arrOfChildEl = [...liEl.childNodes];
            const btnCheck = arrOfChildEl.find((el) => el.className === "button-task");
            const arrOfChildBtnCheck = [...btnCheck.childNodes];
            const checkSvg = arrOfChildBtnCheck.find((el) => el.id === "check-icon");
            const btnCheckText = arrOfChildEl.find((el) => el.className === "button-content-text");
            if (liEl.dataset.status === TaskStatus.ACTIVE) {
                checkSvg.classList.remove("hidden");
                liEl.dataset.status = TaskStatus.COMPLETED;
                btnCheck.id = "checked-btn";
                btnCheckText.id = "crossed-text";
                const task = this.allTasks.find((task) => task.taskId === liEl.dataset.taskid);
                task.status = TaskStatus.COMPLETED;
            }
            else if (liEl.dataset.status === TaskStatus.COMPLETED) {
                liEl.dataset.status = TaskStatus.ACTIVE;
                checkSvg.classList.add("hidden");
                btnCheck.id = "";
                btnCheckText.id = "";
                const task = this.allTasks.find((task) => task.taskId === liEl.dataset.taskid);
                task.status = TaskStatus.ACTIVE;
            }
            this.callSelectedTasks();
        };
        btnCheckTask.forEach((btn) => {
            btn.addEventListener("click", switchingTaskStatus);
        });
        btnCheckText.forEach((btn) => {
            btn.addEventListener("click", switchingTaskStatus);
        });
    }
    showNumOfTasks(wantedTasks) {
        const itemsLeft = document.querySelector(".content_footer-items");
        itemsLeft.textContent =
            wantedTasks.length > 0
                ? `${wantedTasks.length} item${wantedTasks.length === 1 ? "" : "s"} left`
                : "No tasks";
        return true;
    }
}
const app = new Task();
const inputTask = document.querySelector("form");
inputTask.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskId = Math.random().toString();
    const inputValue = document.getElementById("task");
    app.createTask({
        taskId,
        taskName: inputValue.value,
        status: TaskStatus.ACTIVE,
    });
    inputValue.value = "";
});
const allTasksBtn = document.querySelector(".all");
const activeTasksBtn = document.querySelector(".active");
const finishedTasksBtn = document.querySelector(".completed");
const checkShownTasks = (activeBtn, inactiveBtn1, inactiveBtn2) => {
    if (!activeBtn.classList.contains("active-btn"))
        activeBtn.classList.add("active-btn");
    if (inactiveBtn1.classList.contains("active-btn"))
        inactiveBtn1.classList.remove("active-btn");
    if (inactiveBtn2.classList.contains("active-btn"))
        inactiveBtn2.classList.remove("active-btn");
};
allTasksBtn.addEventListener("click", () => {
    app.showSelectedTasks("all");
    checkShownTasks(allTasksBtn, activeTasksBtn, finishedTasksBtn);
});
activeTasksBtn.addEventListener("click", () => {
    app.showSelectedTasks(TaskStatus.ACTIVE);
    checkShownTasks(activeTasksBtn, allTasksBtn, finishedTasksBtn);
});
finishedTasksBtn.addEventListener("click", () => {
    app.showSelectedTasks(TaskStatus.COMPLETED);
    checkShownTasks(finishedTasksBtn, allTasksBtn, activeTasksBtn);
});
const clearCompletedBtn = document.querySelector(".button-clear");
clearCompletedBtn.addEventListener("click", () => {
    app.clearCompletedTasks();
});
