const STORAGE_KEY = "plan_tracker_v2";


const defaultState = {

    tasks: [],

    days: 30,

    theme: "dark",

    currentDate:
        new Date().toISOString(),

    finance: []

};


function loadState() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            return {
                ...defaultState,
                tasks: [],
                finance: []
            };

        }


        const parsed =
            JSON.parse(saved);


        return {
            ...defaultState,
            ...parsed,
            tasks:
                Array.isArray(parsed.tasks)
                    ? parsed.tasks
                    : [],
            finance:
                Array.isArray(parsed.finance)
                    ? parsed.finance
                    : []
        };

    } catch (error) {

        console.error(
            "Failed to load data:",
            error
        );


        return {
            ...defaultState,
            tasks: [],
            finance: []
        };

    }

}


function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    } catch (error) {

        console.error(
            "Failed to save data:",
            error
        );

    }

}


function exportState() {

    const data =
        JSON.stringify(
            state,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "plan-tracker-backup.json";


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


function importState(file) {

    const reader =
        new FileReader();


    reader.onload =
        event => {

            try {

                const imported =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !imported ||
                    !Array.isArray(
                        imported.tasks
                    )
                ) {

                    throw new Error(
                        "Invalid backup file"
                    );

                }


                state = {

                    ...defaultState,

                    ...imported,

                    tasks:
                        Array.isArray(
                            imported.tasks
                        )
                            ? imported.tasks
                            : [],

                    finance:
                        Array.isArray(
                            imported.finance
                        )
                            ? imported.finance
                            : []

                };


                saveState();

                renderApp();

            } catch (error) {

                console.error(
                    "Import error:",
                    error
                );


                alert(
                    "Invalid Plan Tracker backup file."
                );

            }

        };


    reader.readAsText(file);

}
