function applyTheme() {

    if (state.theme === "light") {

        document.body.classList.add(
            "light"
        );

        document.getElementById(
            "themeIcon"
        ).textContent = "☾";

    } else {

        document.body.classList.remove(
            "light"
        );

        document.getElementById(
            "themeIcon"
        ).textContent = "☀";

    }

}


function toggleTheme() {

    state.theme =
        state.theme === "dark"
            ? "light"
            : "dark";


    saveState();

    applyTheme();

}
