// SWITCHING LIGHT DARK THEME
type SvgInHtml = HTMLElement & SVGElement;

const themeBtn = document.querySelector(".button-theme") as HTMLButtonElement;
const root = document.querySelector(":root") as HTMLElement;
const moonIcon = document.querySelector(".moon-icon") as SvgInHtml;
const sunIcon = document.querySelector(".sun-icon") as SvgInHtml;
const mobileImg = document.getElementById("mobile-img") as HTMLSourceElement;
const desktopImg = document.getElementById("desktop-img") as HTMLSourceElement;
const image = document.querySelector(".landing__image") as HTMLImageElement;

const changeColors = (...colors: string[]): void => {
  const [c1, c2, c3, c4, c5, c6] = colors;

  root.style.setProperty("--bg-primary", c1);
  root.style.setProperty("--color-primary", c2);
  root.style.setProperty("--color-secondary", c3);
  root.style.setProperty("--text-primary", c4);
  root.style.setProperty("--text-secondary", c5);
  root.style.setProperty("--text-secondary-hover", c6);
};

const darkTheme = (): void => {
  changeColors(
    "#161722",
    "#25273c",
    "#4d5066",
    "#cacde8",
    "#393a4c",
    "#e4e5f1"
  );
  sunIcon.classList.remove("hidden");
  moonIcon.classList.add("hidden");
  mobileImg.setAttribute("srcset", "./images/bg-mobile-dark.jpg");
  desktopImg.setAttribute("srcset", "./images/bg-desktop-dark.jpg");
  image.setAttribute("src", "./images/bg-mobile-dark.jpg");
};

const lightTheme = (): void => {
  changeColors(
    "#e4e5f1",
    "#fafafa",
    "#e4e5f1",
    "#484b6a",
    "#d2d3db",
    "#9394a5"
  );
  sunIcon.classList.add("hidden");
  moonIcon.classList.remove("hidden");
  mobileImg.setAttribute("srcset", "./images/bg-mobile-light.jpg");
  desktopImg.setAttribute("srcset", "./images/bg-desktop-light.jpg");
  image.setAttribute("src", "./images/bg-mobile-light.jpg");
};

const switchTheme = (): void => {
  if (
    window.getComputedStyle(root).getPropertyValue("--color-primary") ===
      " #fafafa" ||
    window.getComputedStyle(root).getPropertyValue("--color-primary") ===
      "#fafafa"
  ) {
    darkTheme();
  } else {
    lightTheme();
  }
};

themeBtn.addEventListener("click", switchTheme);

// TASK CREATION
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
  private allTasks: ValidateTask[] = [];
  private activeTasks: ValidateTask[] = [];
  private completedTasks: ValidateTask[] = [];
  private taskSection = document.querySelector(
    ".section__content"
  ) as HTMLUListElement;
  private visibleTasks: TaskVisibility = "all";

  constructor() {}

  public createTask(validate: ValidateTask) {
    this.allTasks.push({
      taskName: validate.taskName,
      taskId: validate.taskId,
      status: validate.status,
    });
    this.callSelectedTasks();
  }

  public showSelectedTasks(status: TaskVisibility) {
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
    if (this.visibleTasks !== status) this.visibleTasks = status;
    this.addCompletedTaskBtn();
    this.addBtnDelete();
    this.addDraggItems();
  }

  public clearCompletedTasks() {
    this.completedTasks = [];
    const clearedTasks = this.allTasks.filter(
      (el) => el.status === TaskStatus.ACTIVE
    );
    this.allTasks = clearedTasks;
    this.callSelectedTasks();
  }

  private callSelectedTasks() {
    if (this.visibleTasks === "all") this.showSelectedTasks("all");
    if (this.visibleTasks === TaskStatus.ACTIVE)
      this.showSelectedTasks(TaskStatus.ACTIVE);
    if (this.visibleTasks === TaskStatus.COMPLETED)
      this.showSelectedTasks(TaskStatus.COMPLETED);
  }

  private insertTask(validate: ValidateTask): any {
    return `<li draggable="true" data-task=${validate.taskName} data-status=${
      validate.status
    } data-taskId=${validate.taskId} class="task-row">
    <button id=${
      validate.status === TaskStatus.ACTIVE ? null : "checked-btn"
    } class="button-task">
    <svg id="check-icon" class=${
      validate.status === TaskStatus.ACTIVE ? "hidden" : null
    } xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
    </button>
    <button class="button-content-text">
      <p id=${
        validate.status === TaskStatus.ACTIVE ? null : "crossed-text"
      } class="content-text">${validate.taskName}</p>
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
      console.log(afterElement);
      const draggable = document.querySelector(".dragging") as HTMLLIElement;
      if (afterElement != null) {
        this.taskSection.insertBefore(draggable, afterElement);
      }
    });
  }

  private addBtnDelete(): void {
    const btnDeleteTask: any[] = [
      ...document.querySelectorAll(".button-delete"),
    ];
    btnDeleteTask.forEach((btn) =>
      btn.addEventListener("click", (event: Event) => {
        const arrEl: any[] = event.composedPath();
        const liEl = arrEl.find(
          (el) => el.className === "task-row"
        ) as HTMLLIElement;
        const id = liEl.dataset.taskid;
        const filteredArr = this.allTasks.filter((task) => task.taskId !== id);
        this.allTasks = filteredArr;
        this.callSelectedTasks();
      })
    );
  }

  private addCompletedTaskBtn(): void {
    const btnCheckTask: any[] = [...document.querySelectorAll(".button-task")];
    const btnCheckText: any[] = [
      ...document.querySelectorAll(".button-content-text"),
    ];

    const switchingTaskStatus = (event: Event) => {
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
      if (liEl.dataset.status === TaskStatus.ACTIVE) {
        checkSvg.classList.remove("hidden");
        liEl.dataset.status = TaskStatus.COMPLETED;
        btnCheck.id = "checked-btn";
        btnCheckText.id = "crossed-text";
        const task = this.allTasks.find(
          (task) => task.taskId === liEl.dataset.taskid
        ) as ValidateTask;
        task.status = TaskStatus.COMPLETED;
      } else if (liEl.dataset.status === TaskStatus.COMPLETED) {
        liEl.dataset.status = TaskStatus.ACTIVE;
        checkSvg.classList.add("hidden");
        btnCheck.id = "";
        btnCheckText.id = "";
        const task = this.allTasks.find(
          (task) => task.taskId === liEl.dataset.taskid
        ) as ValidateTask;
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

  private showNumOfTasks(wantedTasks: ValidateTask[]): boolean {
    const itemsLeft = document.querySelector(
      ".content_footer-items"
    ) as HTMLSpanElement;
    itemsLeft.textContent =
      wantedTasks.length > 0
        ? `${wantedTasks.length} item${
            wantedTasks.length === 1 ? "" : "s"
          } left`
        : "No tasks";

    return true;
  }
}

const app = new Task();

// Rendering Tasks on submit
const inputTask = document.querySelector("form") as HTMLFormElement;

inputTask.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  const taskId = Math.random().toString();
  const inputValue = document.getElementById("task") as HTMLInputElement;
  app.createTask({
    taskId,
    taskName: inputValue.value,
    status: TaskStatus.ACTIVE,
  });
  inputValue.value = "";
});

// Showing different tasks
const allTasksBtn = document.querySelector(".all") as HTMLButtonElement;
const activeTasksBtn = document.querySelector(".active") as HTMLButtonElement;
const finishedTasksBtn = document.querySelector(
  ".completed"
) as HTMLButtonElement;

const checkShownTasks = (
  activeBtn: HTMLButtonElement,
  inactiveBtn1: HTMLButtonElement,
  inactiveBtn2: HTMLButtonElement
): void => {
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

// Clearing completed tasks
const clearCompletedBtn = document.querySelector(
  ".button-clear"
) as HTMLButtonElement;
clearCompletedBtn.addEventListener("click", () => {
  app.clearCompletedTasks();
});
