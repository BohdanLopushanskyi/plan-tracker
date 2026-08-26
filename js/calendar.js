let calendarDate = new Date();


function getCalendarDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function getCalendarProgress(date) {

    /*
        At this stage we connect the calendar
        with the tracker data.

        Later we will move everything to
        date-based storage.
    */

    const trackerStart =
        new Date();

    trackerStart.setHours(
        0, 0, 0, 0
    );


    const target =
        new Date(date);

    target.setHours(
        0, 0, 0, 0
    );


    const difference =
        Math.round(
            (
                target -
                trackerStart
            ) /
            86400000
        );


    if (
        difference < 0 ||
        difference >= state.days
    ) {

        return null;

    }


    if (
        state.tasks.length === 0
    ) {

        return 0;

    }


    let completed = 0;


    state.tasks.forEach(task => {

        if (
            task.completed[difference] === true
        ) {

            completed++;

        }

    });


    return Math.round(
        (
            completed /
            state.tasks.length
        ) * 100
    );

}


function renderCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );


    const monthLabel =
        document.getElementById(
            "calendarMonth"
        );


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    monthLabel.textContent =
        new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(calendarDate);


    /*
        First day of month.
    */

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    /*
        Convert Sunday=0 to
        Monday=0.
    */

    let startDay =
        firstDay.getDay() - 1;


    if (startDay < 0) {
        startDay = 6;
    }


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    let html = "";


    /*
        Previous month days
    */

    for (
        let i = startDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousMonthDays - i;


        const date =
            new Date(
                year,
                month - 1,
                day
            );


        html += createCalendarDay(
            date,
            true
        );

    }


    /*
        Current month
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        html += createCalendarDay(
            date,
            false
        );

    }


    /*
        Next month days
    */

    const totalCells =
        startDay +
        daysInMonth;


    const remaining =
        Math.ceil(
            totalCells / 7
        ) * 7 -
        totalCells;


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        const date =
            new Date(
                year,
                month + 1,
                day
            );


        html += createCalendarDay(
            date,
            true
        );

    }


    grid.innerHTML = html;

}


function createCalendarDay(
    date,
    otherMonth
) {

    const today =
        new Date();


    const isToday =
        date.toDateString() ===
        today.toDateString();


    const progress =
        getCalendarProgress(date);


    const dateKey =
        getCalendarDateKey(date);


    let percentage =
        progress === null
            ? ""
            : `${progress}%`;


    let status = "";


    if (progress !== null) {

        if (progress === 100) {

            status = "Complete";

        } else if (progress > 0) {

            status = "In progress";

        } else {

            status = "Not started";

        }

    }


    return `
        <div
            class="
                calendar-day
                ${otherMonth ? "other-month" : ""}
                ${isToday ? "today" : ""}
            "
            data-calendar-date="${dateKey}"
        >

            <div class="calendar-date">
                ${date.getDate()}
            </div>

            ${
                progress !== null
                    ? `
                        <div class="calendar-percentage">
                            ${percentage}
                        </div>

                        <div class="calendar-status">
                            ${status}
                        </div>

                        <div class="calendar-progress">

                            <div
                                class="calendar-progress-fill"
                                style="width:${progress}%"
                            ></div>

                        </div>
                    `
                    : ""
            }

        </div>
    `;
}


function showCalendarDetails(
    dateKey
) {

    const details =
        document.getElementById(
            "calendarDetails"
        );


    const date =
        new Date(
            `${dateKey}T00:00:00`
        );


    const progress =
        getCalendarProgress(date);


    if (progress === null) {

        details.innerHTML = `
            <div class="details-empty">

                <h3>
                    No tracker data
                </h3>

                <p>
                    This date is outside your
                    current tracking range.
                </p>

            </div>
        `;

        return;

    }


    let completed =
        0;


    let tasksHTML = "";


    const trackerStart =
        new Date();

    trackerStart.setHours(
        0, 0, 0, 0
    );


    const target =
        new Date(date);

    target.setHours(
        0, 0, 0, 0
    );


    const difference =
        Math.round(
            (
                target -
                trackerStart
            ) /
            86400000
        );


    state.tasks.forEach(task => {

        const isCompleted =
            task.completed[difference] === true;


        if (isCompleted) {
            completed++;
        }


        tasksHTML += `
            <div class="detail-task">

                <span class="detail-task-name">
                    ${escapeHTML(task.name)}
                </span>

                <span
                    class="
                        detail-task-status
                        ${
                            isCompleted
                                ? "completed"
                                : "incomplete"
                        }
                    "
                >
                    ${
                        isCompleted
                            ? "✓"
                            : "×"
                    }
                </span>

            </div>
        `;

    });


    const formattedDate =
        new Intl.DateTimeFormat(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        ).format(date);


    details.innerHTML = `

        <div class="details-header">

            <h3>
                ${formattedDate}
            </h3>

            <p>
                ${completed}
                of
                ${state.tasks.length}
                habits completed
            </p>

        </div>


        ${tasksHTML}


        <div class="details-progress">

            <div class="details-progress-top">

                <span>
                    Daily completion
                </span>

                <span class="details-progress-value">
                    ${progress}%
                </span>

            </div>


            <div class="details-progress-bar">

                <div
                    class="details-progress-fill"
                    style="width:${progress}%"
                ></div>

            </div>

        </div>

    `;

}


document
    .getElementById(
        "calendarGrid"
    )
    .addEventListener(
        "click",
        event => {

            const day =
                event.target.closest(
                    "[data-calendar-date]"
                );


            if (!day) {
                return;
            }


            document
                .querySelectorAll(
                    ".calendar-day"
                )
                .forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


            day.classList.add(
                "selected"
            );


            showCalendarDetails(
                day.dataset.calendarDate
            );

        }
    );


document
    .getElementById(
        "calendarPrevious"
    )
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById(
        "calendarNext"
    )
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


document
    .getElementById(
        "calendarToday"
    )
    .addEventListener(
        "click",
        () => {

            calendarDate =
                new Date();

            renderCalendar();

        }
    );