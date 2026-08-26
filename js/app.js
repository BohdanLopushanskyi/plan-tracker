let state = loadState();


function renderApp() {

    applyTheme();

    renderTracker();

    updateMonthLabel();

}


function updateMonthLabel() {

    const date =
        new Date(
            state.currentDate
        );


    document.getElementById(
        "monthLabel"
    ).textContent =
        getMonthName(date);

}


/* =========================
   ADD TASK
========================= */

document
    .getElementById(
        "addTaskButton"
    )
    .addEventListener(
        "click",
        createTask
    );


document
    .getElementById(
        "topAddTask"
    )
    .addEventListener(
        "click",
        createTask
    );


document
    .getElementById(
        "emptyAddButton"
    )
    .addEventListener(
        "click",
        createTask
    );


/* =========================
   DAYS
========================= */

document
    .getElementById(
        "daysSelect"
    )
    .addEventListener(
        "change",
        event => {

            state.days =
                Number(
                    event.target.value
                );


            resizeTasks();

            renderTracker();

        }
    );


/* =========================
   TABLE EVENTS
========================= */

document
    .getElementById(
        "tableBody"
    )
    .addEventListener(
        "click",
        event => {

            const deleteButton =
                event.target.closest(
                    "[data-delete-id]"
                );


            if (deleteButton) {

                deleteTask(
                    deleteButton.dataset.deleteId
                );

                return;

            }


            const checkButton =
                event.target.closest(
                    "[data-toggle-task]"
                );


            if (checkButton) {

                toggleTaskDay(
                    checkButton.dataset.toggleTask,
                    Number(
                        checkButton.dataset.toggleDay
                    )
                );

            }

        }
    );


/* =========================
   EDIT TASK
========================= */

document
    .getElementById(
        "tableBody"
    )
    .addEventListener(
        "input",
        event => {

            if (
                event.target.classList.contains(
                    "task-input"
                )
            ) {

                updateTaskName(
                    event.target.dataset.taskId,
                    event.target.value
                );

            }

        }
    );


/* =========================
   THEME
========================= */

document
    .getElementById(
        "themeButton"
    )
    .addEventListener(
        "click",
        toggleTheme
    );


/* =========================
   EXPORT
========================= */

document
    .getElementById(
        "exportButton"
    )
    .addEventListener(
        "click",
        exportState
    );


/* =========================
   IMPORT
========================= */

document
    .getElementById(
        "importButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "importFile"
                )
                .click();

        }
    );


document
    .getElementById(
        "importFile"
    )
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (file) {

                importState(file);

            }

        }
    );


/* =========================
   MOBILE SIDEBAR
========================= */

/* =========================
   MOBILE SIDEBAR
========================= */

const sidebar =
    document.getElementById(
        "sidebar"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

const mobileOverlay =
    document.getElementById(
        "mobileOverlay"
    );


function toggleMobileSidebar() {

    const isOpen =
        sidebar.classList.toggle(
            "open"
        );


    mobileOverlay.classList.toggle(
        "show",
        isOpen
    );

}


function closeMobileSidebar() {

    sidebar.classList.remove(
        "open"
    );

    mobileOverlay.classList.remove(
        "show"
    );

}


mobileMenu.addEventListener(
    "click",
    toggleMobileSidebar
);


mobileOverlay.addEventListener(
    "click",
    closeMobileSidebar
);


/* =========================
   NAVIGATION
========================= */

/* =========================
   NAVIGATION
========================= */

const trackerCard =
    document.querySelector(
        ".tracker-card"
    );

const calendarView =
    document.getElementById(
        "calendarView"
    );

const financeView =
    document.getElementById(
        "financeView"
    );

const pageHeader =
    document.querySelector(
        ".page-header"
    );

const statsGrid =
    document.querySelector(
        ".stats-grid"
    );


function hideAllViews() {

    if (trackerCard) {

        trackerCard.style.display =
            "none";

    }


    if (pageHeader) {

        pageHeader.style.display =
            "none";

    }


    if (statsGrid) {

        statsGrid.style.display =
            "none";

    }


    if (calendarView) {

        calendarView.style.display =
            "none";

    }


    if (financeView) {

        financeView.style.display =
            "none";

    }

}


function showTrackerView() {

    hideAllViews();


    if (pageHeader) {

        pageHeader.style.display =
            "flex";

    }


    if (statsGrid) {

        statsGrid.style.display =
            "grid";

    }


    if (trackerCard) {

        trackerCard.style.display =
            "block";

    }


    renderTracker();

}


function showCalendarView() {

    hideAllViews();


    if (calendarView) {

        calendarView.style.display =
            "block";

    }


    renderCalendar();

}


function showFinanceView() {

    hideAllViews();


    if (financeView) {

        financeView.style.display =
            "block";

    }


    renderFinance();

}


document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                button.classList.add(
                    "active"
                );


                closeMobileSidebar();


                const view =
                    button.dataset.view;


                if (
                    view ===
                    "calendar"
                ) {

                    showCalendarView();

                } else if (
                    view ===
                    "finance"
                ) {

                    showFinanceView();

                } else {

                    /*
                        Dashboard + Habits
                        currently show tracker.
                    */

                    showTrackerView();

                }

            }
        );

    });
/* =========================
   START APP
========================= */

renderApp();