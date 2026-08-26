function createTask() {

    const task = {

        id: generateId(),

        name: "New habit",

        completed:
            Array(state.days).fill(false)

    };


    state.tasks.push(task);

    saveState();

    renderTracker();


    setTimeout(() => {

        const inputs =
            document.querySelectorAll(
                ".task-input"
            );


        if (inputs.length) {

            const input =
                inputs[
                    inputs.length - 1
                ];

            input.focus();

            input.select();

        }

    }, 30);

}


function deleteTask(taskId) {

    const task =
        state.tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    if (
        !confirm(
            `Delete "${task.name}"?`
        )
    ) {

        return;

    }


    state.tasks =
        state.tasks.filter(
            task =>
                task.id !== taskId
        );


    saveState();

    renderTracker();

}


function updateTaskName(
    taskId,
    value
) {

    const task =
        state.tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    task.name = value;

    saveState();

}


function toggleTaskDay(
    taskId,
    day
) {

    const task =
        state.tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    task.completed[day] =
        !task.completed[day];


    saveState();


    /*
        Update ONLY the clicked cell.
        We don't redraw the entire table.
    */

    const cell =
        document.querySelector(
            `[data-cell-task="${taskId}"][data-cell-day="${day}"]`
        );


    const button =
        cell.querySelector(
            ".check-button"
        );


    const completed =
        task.completed[day];


    cell.classList.toggle(
        "completed",
        completed
    );


    button.classList.toggle(
        "checked",
        completed
    );


    updateTaskProgressUI(task);

    updateStatistics();

}


function updateTaskProgressUI(task) {

    const progress =
        getTaskProgress(task);


    const progressText =
        document.querySelector(
            `[data-progress-text="${task.id}"]`
        );


    const progressFill =
        document.querySelector(
            `[data-progress-fill="${task.id}"]`
        );


    if (progressText) {

        progressText.textContent =
            `${progress}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }

}


function resizeTasks() {

    state.tasks.forEach(task => {

        if (
            task.completed.length <
            state.days
        ) {

            while (
                task.completed.length <
                state.days
            ) {

                task.completed.push(false);

            }

        }


        if (
            task.completed.length >
            state.days
        ) {

            task.completed =
                task.completed.slice(
                    0,
                    state.days
                );

        }

    });


    saveState();

}


function renderHeader() {

    const head =
        document.getElementById(
            "tableHead"
        );


    let html = `
        <tr>

            <th class="task-header">
                HABIT
            </th>
    `;


    for (
        let i = 0;
        i < state.days;
        i++
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() + i
        );


        html += `
            <th class="day-header">

                <span class="day-number">
                    ${date.getDate()}
                </span>

                <span class="day-name">
                    ${getDayName(date)}
                </span>

            </th>
        `;

    }


    html += `
            <th class="progress-header">
                PROGRESS
            </th>

        </tr>
    `;


    head.innerHTML = html;

}


function renderBody() {

    const body =
        document.getElementById(
            "tableBody"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    if (state.tasks.length === 0) {

        body.innerHTML = "";

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    let html = "";


    state.tasks.forEach(task => {

        const progress =
            getTaskProgress(task);


        html += `
            <tr data-task-row="${task.id}">

                <td class="task-cell">

                    <div class="task-wrapper">

                        <input
                            class="task-input"
                            value="${escapeHTML(task.name)}"
                            data-task-id="${task.id}"
                        >

                        <button
                            class="delete-task"
                            data-delete-id="${task.id}"
                            title="Delete"
                        >
                            ×
                        </button>

                    </div>

                </td>
        `;


        for (
            let day = 0;
            day < state.days;
            day++
        ) {

            const checked =
                task.completed[day];


            html += `
                <td
                    class="check-cell ${
                        checked
                            ? "completed"
                            : ""
                    }"
                    data-cell-task="${task.id}"
                    data-cell-day="${day}"
                >

                    <button
                        class="check-button ${
                            checked
                                ? "checked"
                                : ""
                        }"
                        data-toggle-task="${task.id}"
                        data-toggle-day="${day}"
                    >
                    </button>

                </td>
            `;

        }


        html += `
                <td class="progress-cell">

                    <div
                        class="progress-value"
                        data-progress-text="${task.id}"
                    >
                        ${progress}%
                    </div>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            data-progress-fill="${task.id}"
                            style="width:${progress}%"
                        ></div>

                    </div>

                </td>

            </tr>
        `;

    });


    body.innerHTML = html;

}


function renderTracker() {

    resizeTasks();

    renderHeader();

    renderBody();

    updateStatistics();

}
