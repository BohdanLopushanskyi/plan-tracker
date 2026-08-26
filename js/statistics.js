function getTaskProgress(task) {

    if (
        !task.completed ||
        task.completed.length === 0
    ) {

        return 0;

    }


    const completed =
        task.completed.filter(
            Boolean
        ).length;


    return Math.round(
        (
            completed /
            state.days
        ) * 100
    );

}


function getOverallProgress() {

    if (state.tasks.length === 0) {
        return 0;
    }


    let completed = 0;

    let total = 0;


    state.tasks.forEach(task => {

        completed +=
            task.completed.filter(
                Boolean
            ).length;

        total += state.days;

    });


    if (total === 0) {
        return 0;
    }


    return Math.round(
        (completed / total) * 100
    );

}


function getTodayProgress() {

    if (state.tasks.length === 0) {
        return 0;
    }


    const completed =
        state.tasks.filter(
            task =>
                task.completed[0] === true
        ).length;


    return Math.round(
        (
            completed /
            state.tasks.length
        ) * 100
    );

}


function getCurrentStreak() {

    if (state.tasks.length === 0) {
        return 0;
    }

    let currentStreak = 0;
    let longestStreak = 0;

    /*
        Go through ALL days.

        Example:

        ✓ ✓ ✗ ✓ ✓ ✓ ✓

        Result:

        first streak  = 2
        second streak = 4

        We return 4.
    */

    for (let day = 0; day < state.days; day++) {

        const allTasksCompleted =
            state.tasks.every(task => {

                return (
                    Array.isArray(task.completed) &&
                    task.completed[day] === true
                );

            });


        if (allTasksCompleted) {

            currentStreak++;

            /*
                Save the longest continuous streak.
            */

            if (currentStreak > longestStreak) {

                longestStreak = currentStreak;

            }

        } else {

            /*
                A missed day resets the
                CURRENT sequence.

                But we keep longestStreak.
            */

            currentStreak = 0;

        }

    }

    return longestStreak;
}

function updateStatistics() {

    document.getElementById(
        "taskCount"
    ).textContent =
        state.tasks.length;


    document.getElementById(
        "overallProgress"
    ).textContent =
        `${getOverallProgress()}%`;


    document.getElementById(
        "todayProgress"
    ).textContent =
        `${getTodayProgress()}%`;


    document.getElementById(
        "streakValue"
    ).textContent =
        `${getCurrentStreak()} days`;

}