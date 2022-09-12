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
   const el = this.insertTask({ taskName: validate.taskName,
      taskId: validate.taskId,
      status: validate.status,})

      if(this.visibleTasks === "all") {
        this.taskSection.insertAdjacentHTML("beforeend", el);
        this.showNumOfTasks(this.allTasks);
        this.addDraggItems();
        }
      if(this.visibleTasks === TaskStatus.ACTIVE) {
        this.taskSection.insertAdjacentHTML("beforeend", el);
        const activeTasksArr = this.allTasks.filter(task => task.status === TaskStatus.ACTIVE )
        this.activeTasks = activeTasksArr
        this.showNumOfTasks(this.activeTasks);
        this.addDraggItems();
        }
        const tasksUl = [...this.taskSection.childNodes] as HTMLElement[];
        const liEl = tasksUl.find(el => el.dataset.taskid === validate.taskId) as HTMLLIElement;
        const btnTask = liEl.querySelector(".button-task") as HTMLButtonElement;
        const btnText = liEl.querySelector(".button-content-text") as HTMLButtonElement;
        const btnDelete = liEl.querySelector(".button-delete") as HTMLButtonElement;
        btnTask.addEventListener("click", this.toggleFinishActiveTask.bind(this));
        btnText.addEventListener("click", this.toggleFinishActiveTask.bind(this));
        btnDelete.addEventListener("click", this.deleteTask.bind(this));
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
    this.addDraggItems();
  }

  public clearCompletedTasks() {
    this.completedTasks = [];
    const clearedTasks = this.allTasks.filter(
      (el) => el.status === TaskStatus.ACTIVE
    );
    this.allTasks = clearedTasks;
    if (this.visibleTasks === "all") {
     const shownTasks = [...this.taskSection.childNodes] as HTMLElement[];
     shownTasks.forEach(el => {
      if(el.dataset.status === TaskStatus.COMPLETED) el.remove();
     })
     this.allTasks = this.allTasks.filter(el => el.status !== TaskStatus.COMPLETED);
     this.showNumOfTasks(this.allTasks);
    }
    if (this.visibleTasks === TaskStatus.COMPLETED)
      this.showSelectedTasks(TaskStatus.COMPLETED);
  }

  private insertTask(validate: ValidateTask): any {
    return `<li draggable="true" data-status=${
      validate.status
    } data-taskId=${validate.taskId} class="task-row">
    <button id=${
      validate.status === TaskStatus.ACTIVE ? null : "checked-btn"
    } class="button-task">
    <svg id="check-icon" class=${
      validate.status === TaskStatus.ACTIVE ? "hidden" : null
    } xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
    </button>
    <button id=${
      validate.status === TaskStatus.ACTIVE ? null : "crossed-text"
    } class="button-content-text">
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

  btnCheckTask.forEach(btnEl => btnEl.addEventListener("click", this.toggleFinishActiveTask.bind(this)))
  btnCheckText.forEach(btnEl => btnEl.addEventListener("click", this.toggleFinishActiveTask.bind(this)))
  btnDeleteTask.forEach(btnEl => btnEl.addEventListener("click", this.deleteTask.bind(this)))
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
      if (liEl.dataset.status === TaskStatus.ACTIVE) {
        liEl.dataset.status = TaskStatus.COMPLETED;
        checkSvg.classList.remove("hidden");
        btnCheck.id = "checked-btn";
        btnCheckText.id = "crossed-text";
        const task = this.allTasks.find(
          (taskEl) => taskEl.taskId === liEl.dataset.taskid
        ) as ValidateTask;
        task.status = TaskStatus.COMPLETED;
        if (this.visibleTasks === TaskStatus.ACTIVE) {  
          liEl.remove();
          const filteredArr = this.activeTasks.filter((task) => task.taskId !== liEl.dataset.taskid);
          this.activeTasks = filteredArr;
          this.showNumOfTasks(this.activeTasks);
        }
      } else  {
        liEl.dataset.status = TaskStatus.ACTIVE;
        checkSvg.classList.add("hidden");
        btnCheck.id = "";
        btnCheckText.id = "";
        const task = this.allTasks.find(
          (task) => task.taskId === liEl.dataset.taskid
        ) as ValidateTask;
        task.status = TaskStatus.ACTIVE;
        if (this.visibleTasks === TaskStatus.COMPLETED) {  
          liEl.remove();
          const filteredArr = this.completedTasks.filter((task) => task.taskId !== liEl.dataset.taskid);
          this.completedTasks = filteredArr;
          this.showNumOfTasks(this.completedTasks);
        }
      }

    };

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
const inputEl = inputTask.querySelector(".task") as HTMLInputElement;

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
const [allBtn1, allBtn2] = [...document.querySelectorAll(".all")] as HTMLButtonElement[];
const [activeBtn1, activeBtn2] = [...document.querySelectorAll(".active")] as HTMLButtonElement[];
const [finishedBtn1, finishedBtn2] = [...document.querySelectorAll(
  ".completed"
)] as HTMLButtonElement[];

const checkShownTasks = (
  activeBtn: HTMLButtonElement,
  inactiveBtn1: HTMLButtonElement,
  inactiveBtn2: HTMLButtonElement) =>
{
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
