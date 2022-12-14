// TASK CREATION
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

type SvgInHtml = HTMLElement & SVGElement;

enum TaskStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

interface ValidateTask {
  taskId: string;
  taskName: string;
  status: TaskStatus.ACTIVE | TaskStatus.COMPLETED;
}

type TaskVisibility = "all" | TaskStatus.ACTIVE | TaskStatus.COMPLETED;

class Task {
  public allTasks: ValidateTask[] = [];
  private activeTasks: ValidateTask[] = [];
  private completedTasks: ValidateTask[] = [];
  private taskSection = document.querySelector(
    ".section__content"
  ) as HTMLUListElement;
  private visibleTasks: TaskVisibility = "all";

  constructor() {
    const tasks = localStorage.getItem("tasks");

    if (tasks) {
      const convertedTasks: ValidateTask[] = JSON.parse(tasks);
      this.allTasks = convertedTasks;
      this.showSelectedTasks("all");
    }
  }

  public createTask(validate: ValidateTask) {
    this.allTasks.push({
      taskName: validate.taskName,
      taskId: validate.taskId,
      status: validate.status,
    });
    const el = this.insertTask({
      taskName: validate.taskName,
      taskId: validate.taskId,
      status: validate.status,
    });

    if (this.visibleTasks === "all") {
      this.taskSection.insertAdjacentHTML("beforeend", el);
    }
    if (this.visibleTasks === TaskStatus.ACTIVE) {
      this.taskSection.insertAdjacentHTML("beforeend", el);
      const activeTasksArr = this.allTasks.filter(
        (task) => task.status === TaskStatus.ACTIVE
      );
      this.activeTasks = activeTasksArr;
    }
    this.addDraggItems();
    this.showNumOfTasks();
    const tasksUl = [...this.taskSection.childNodes] as HTMLElement[];
    const liEl = tasksUl.find(
      (el) => el.dataset.taskid === validate.taskId
    ) as HTMLLIElement;
    const btnTask = liEl.querySelector(".button-task") as HTMLButtonElement;
    const btnText = liEl.querySelector(
      ".button-content-text"
    ) as HTMLButtonElement;
    const btnDelete = liEl.querySelector(".button-delete") as HTMLButtonElement;
    btnTask.addEventListener("click", this.toggleFinishActiveTask);
    btnText.addEventListener("click", this.toggleFinishActiveTask);
    btnDelete.addEventListener("click", this.deleteTask);
  }

  public showSelectedTasks(status: TaskVisibility) {
    if (status === "all") {
      this.filteredTasks(this.allTasks);
    }
    if (status === TaskStatus.ACTIVE) {
      this.filteredTasks(this.activeTasks, TaskStatus.ACTIVE);
    }
    if (status === TaskStatus.COMPLETED) {
      this.filteredTasks(this.completedTasks, TaskStatus.COMPLETED);
    }
    if (this.visibleTasks !== status) this.visibleTasks = status;
    this.addDraggItems();
    this.showNumOfTasks();
  }

  public clearCompletedTasks() {
    this.completedTasks = [];
    const clearedTasks = this.allTasks.filter(
      (el) => el.status === TaskStatus.ACTIVE
    );
    this.allTasks = clearedTasks;
    if (this.visibleTasks === "all") {
      const shownTasks = [...this.taskSection.childNodes] as HTMLElement[];
      shownTasks.forEach((el) => {
        if (el.dataset.status === TaskStatus.COMPLETED) el.remove();
      });
      this.allTasks = this.allTasks.filter(
        (el) => el.status !== TaskStatus.COMPLETED
      );
    }
    this.showNumOfTasks();
    if (this.visibleTasks === TaskStatus.COMPLETED)
      this.showSelectedTasks(TaskStatus.COMPLETED);
  }

  private insertTask(validate: ValidateTask): any {
    return `<li draggable="true" data-status=${validate.status} data-taskId=${
      validate.taskId
    } class="task-row" aria-label="${validate.status} task">
    <button id=${
      validate.status === TaskStatus.ACTIVE ? null : "checked-btn"
    } class="button-task" title="change task status" aria-label="${
      validate.status
    } task">
    <svg aria-hidden="true" id="check-icon" class=${
      validate.status === TaskStatus.ACTIVE ? "hidden" : null
    } xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
    </button>
    <button id=${
      validate.status === TaskStatus.ACTIVE ? null : "crossed-text"
    } class="button-content-text" title="change task status" aria-label="${
      validate.status
    } task">
      <p class="content-text">${validate.taskName}</p>
    </button>
    <button class="button-delete" title="delete task">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path
          fill="#494C6B"
          fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
      </svg>
    </button>
  </li>`;
  }

  private filteredTasks(
    wantedTasks: ValidateTask[],
    taskStatus?: TaskStatus.ACTIVE | TaskStatus.COMPLETED
  ) {
    if (taskStatus) {
      const filteredArr = this.allTasks.filter(
        (task) => task.status === taskStatus
      );
      taskStatus === "active"
        ? (this.activeTasks = filteredArr)
        : (this.completedTasks = filteredArr);
      wantedTasks = filteredArr;
    }
    const tasksArr = wantedTasks.map((task) =>
      this.insertTask({
        taskId: task.taskId,
        taskName: task.taskName,
        status: task.status,
      })
    );
    this.taskSection.innerHTML = tasksArr.toString().replaceAll(",", "");
    const btnCheckTask: any[] = [...document.querySelectorAll(".button-task")];
    const btnCheckText: any[] = [
      ...document.querySelectorAll(".button-content-text"),
    ];
    const btnDeleteTask: any[] = [
      ...document.querySelectorAll(".button-delete"),
    ];

    btnCheckTask.forEach((btnEl) =>
      btnEl.addEventListener("click", this.toggleFinishActiveTask)
    );
    btnCheckText.forEach((btnEl) =>
      btnEl.addEventListener("click", this.toggleFinishActiveTask)
    );
    btnDeleteTask.forEach((btnEl) =>
      btnEl.addEventListener("click", this.deleteTask)
    );
  }

  private addDraggItems(): void {
    const draggableItems = document.querySelectorAll(".task-row");

    const getDragAfterElement = (y: any) => {
      const draggableElements = [
        ...this.taskSection.querySelectorAll(".task-row:not(.dragging)"),
      ];

      const returnedEl: any = draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      );
      return returnedEl.element;
    };

    draggableItems.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
      });
      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
        const arrOrder = [...this.taskSection.childNodes] as HTMLElement[];
        let changedArr: ValidateTask[] = [];
        arrOrder.forEach((el) => {
          const pEl = el.querySelector(".content-text") as HTMLParagraphElement;
          changedArr.push({
            taskId: el.dataset.taskid as string,
            taskName: pEl.textContent as string,
            status: el.dataset.status as TaskStatus,
          });
        });
        if (this.visibleTasks === "all") this.allTasks = changedArr;
        if (this.visibleTasks === TaskStatus.ACTIVE)
          this.activeTasks = changedArr;
        if (this.visibleTasks === TaskStatus.COMPLETED)
          this.completedTasks = changedArr;
      });
    });

    this.taskSection.addEventListener("dragover", (event: MouseEvent) => {
      event.preventDefault();
      const afterElement = getDragAfterElement(event.clientY);
      const draggable = document.querySelector(".dragging") as HTMLLIElement;
      if (afterElement != null) {
        this.taskSection.insertBefore(draggable, afterElement);
      }
    });
  }

  @autobind
  private deleteTask(event: Event): void {
    const arrEl: any[] = event.composedPath();
    const liEl = arrEl.find(
      (el) => el.className === "task-row"
    ) as HTMLLIElement;
    const id = liEl.dataset.taskid;
    const filteredArr = this.allTasks.filter((task) => task.taskId !== id);
    this.allTasks = filteredArr;
    liEl.remove();
    if (this.visibleTasks === "all") {
      this.allTasks = this.allTasks.filter((task) => task.taskId !== id);
      this.allTasks = filteredArr;
    }
    if (this.visibleTasks === TaskStatus.ACTIVE) {
      this.activeTasks = this.activeTasks.filter((task) => task.taskId !== id);
    }
    if (this.visibleTasks === TaskStatus.COMPLETED) {
      this.completedTasks = this.completedTasks.filter(
        (task) => task.taskId !== id
      );
    }
    this.showNumOfTasks();
  }

  @autobind
  private toggleFinishActiveTask(event: Event): void {
    const arrEl: any[] = event.composedPath();
    const liEl = arrEl.find(
      (el) => el.className === "task-row"
    ) as HTMLLIElement;
    const arrOfChildEl = [...liEl.childNodes] as HTMLElement[];
    const btnCheck = arrOfChildEl.find(
      (el) => el.className === "button-task"
    ) as HTMLButtonElement;
    const arrOfChildBtnCheck = [...btnCheck.childNodes] as HTMLElement[];
    const checkSvg = arrOfChildBtnCheck.find(
      (el) => el.id === "check-icon"
    ) as SvgInHtml;
    const btnCheckText = arrOfChildEl.find(
      (el) => el.className === "button-content-text"
    ) as HTMLButtonElement;

    const toggleStatusChange = (status: TaskStatus) => {
      liEl.dataset.status = status;
      liEl.ariaLabel = `${status} task`;
      btnCheck.ariaLabel = `${status} task`;
      btnCheckText.ariaLabel = `${status} task`;
      if (status === TaskStatus.COMPLETED) checkSvg.classList.remove("hidden");
      if (status === TaskStatus.ACTIVE) checkSvg.classList.add("hidden");
      btnCheck.id = status === TaskStatus.COMPLETED ? "checked-btn" : "";
      btnCheckText.id = status === TaskStatus.COMPLETED ? "crossed-text" : "";
    };

    if (liEl.dataset.status === TaskStatus.ACTIVE) {
      toggleStatusChange(TaskStatus.COMPLETED);
      const task = this.allTasks.find(
        (taskEl) => taskEl.taskId === liEl.dataset.taskid
      ) as ValidateTask;
      task.status = TaskStatus.COMPLETED;
      if (this.visibleTasks === TaskStatus.ACTIVE) {
        liEl.remove();
        const filteredArr = this.activeTasks.filter(
          (task) => task.taskId !== liEl.dataset.taskid
        );
        this.activeTasks = filteredArr;
      }
    } else {
      toggleStatusChange(TaskStatus.ACTIVE);
      const task = this.allTasks.find(
        (task) => task.taskId === liEl.dataset.taskid
      ) as ValidateTask;
      task.status = TaskStatus.ACTIVE;
      if (this.visibleTasks === TaskStatus.COMPLETED) {
        liEl.remove();
        const filteredArr = this.completedTasks.filter(
          (task) => task.taskId !== liEl.dataset.taskid
        );
        this.completedTasks = filteredArr;
      }
    }
    this.showNumOfTasks();
  }

  private showNumOfTasks(): boolean {
    const itemsLeft = document.querySelector(
      ".content_footer-items"
    ) as HTMLSpanElement;
    const activeTasks = this.allTasks.filter(
      (tasks) => tasks.status === TaskStatus.ACTIVE
    );
    itemsLeft.textContent =
      activeTasks.length > 0
        ? `${activeTasks.length} item${
            activeTasks.length === 1 ? "" : "s"
          } left`
        : "No tasks";

    return true;
  }
}

const app = new Task();

// Rendering Tasks on submit
const inputTask = document.querySelector("form") as HTMLFormElement;
const inputEl = inputTask.querySelector(".task") as HTMLInputElement;

inputTask.addEventListener("submit", (event: Event) => {
  const inputValue = document.getElementById("task") as HTMLInputElement;
  event.preventDefault();
  if (inputValue.value === "") return;
  const taskId = Math.random().toString();
  app.createTask({
    taskId,
    taskName: inputValue.value,
    status: TaskStatus.ACTIVE,
  });
  inputValue.value = "";
});

// Showing different tasks
const [allBtn1, allBtn2] = [
  ...document.querySelectorAll(".all"),
] as HTMLButtonElement[];
const [activeBtn1, activeBtn2] = [
  ...document.querySelectorAll(".active"),
] as HTMLButtonElement[];
const [finishedBtn1, finishedBtn2] = [
  ...document.querySelectorAll(".completed"),
] as HTMLButtonElement[];

const checkShownTasks = (
  activeBtn: HTMLButtonElement,
  inactiveBtn1: HTMLButtonElement,
  inactiveBtn2: HTMLButtonElement
) => {
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

// Clearing completed tasks
const clearCompletedBtn = document.querySelector(
  ".button-clear"
) as HTMLButtonElement;
clearCompletedBtn.addEventListener("click", () => {
  app.clearCompletedTasks();
});

// Saving tasks in local storage
const btn = document.querySelector(".test") as HTMLButtonElement;

window.addEventListener("beforeunload", (): void => {
  const convertedArr: string = JSON.stringify(app.allTasks);
  localStorage.setItem("tasks", convertedArr);
});
