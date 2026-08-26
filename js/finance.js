/* ========================================
   FINANCE
======================================== */


/* ========================================
   FORMAT MONEY
======================================== */

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "en-GB",
        {
            style: "currency",
            currency: "GBP"
        }
    ).format(amount);

}


/* ========================================
   GET FINANCE DATA
======================================== */

function getFinanceData() {

    if (!Array.isArray(state.finance)) {

        state.finance = [];

    }

    return state.finance;

}


/* ========================================
   CALCULATE TOTALS
======================================== */

function getFinanceTotals() {

    const transactions =
        getFinanceData();


    let income = 0;

    let expenses = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                );


            if (
                transaction.type ===
                "income"
            ) {

                income += amount;

            } else {

                expenses += amount;

            }

        }
    );


    return {

        income,

        expenses,

        balance:
            income - expenses,

        savings:
            income - expenses

    };

}


/* ========================================
   UPDATE FINANCE STATS
======================================== */

function updateFinanceStats() {

    const totals =
        getFinanceTotals();


    const balance =
        document.getElementById(
            "financeBalance"
        );


    const income =
        document.getElementById(
            "financeIncome"
        );


    const expenses =
        document.getElementById(
            "financeExpenses"
        );


    const savings =
        document.getElementById(
            "financeSavings"
        );


    if (balance) {

        balance.textContent =
            formatMoney(
                totals.balance
            );

    }


    if (income) {

        income.textContent =
            formatMoney(
                totals.income
            );

    }


    if (expenses) {

        expenses.textContent =
            formatMoney(
                totals.expenses
            );

    }


    if (savings) {

        savings.textContent =
            formatMoney(
                totals.savings
            );

    }

}


/* ========================================
   ADD TRANSACTION
======================================== */

function addTransaction(
    transaction
) {

    if (
        !Array.isArray(
            state.finance
        )
    ) {

        state.finance = [];

    }


    state.finance.unshift({

        id:
            generateId(),

        type:
            transaction.type,

        amount:
            Number(
                transaction.amount
            ),

        category:
            transaction.category,

        description:
            transaction.description,

        date:
            transaction.date

    });


    saveState();

    renderFinance();

}


/* ========================================
   DELETE TRANSACTION
======================================== */

function deleteTransaction(
    transactionId
) {

    const confirmed =
        confirm(
            "Delete this transaction?"
        );


    if (!confirmed) {
        return;
    }


    state.finance =
        getFinanceData().filter(
            transaction =>
                transaction.id !==
                transactionId
        );


    saveState();

    renderFinance();

}


/* ========================================
   RENDER TRANSACTIONS
======================================== */

function renderTransactions() {

    const list =
        document.getElementById(
            "transactionList"
        );


    const empty =
        document.getElementById(
            "financeEmpty"
        );


    if (!list || !empty) {
        return;
    }


    const transactions =
        getFinanceData();


    if (
        transactions.length === 0
    ) {

        list.innerHTML = "";

        empty.style.display =
            "flex";

        return;

    }


    empty.style.display =
        "none";


    let html = "";


    transactions.forEach(
        transaction => {

            const isIncome =
                transaction.type ===
                "income";


            const sign =
                isIncome
                    ? "+"
                    : "-";


            const amountClass =
                isIncome
                    ? "transaction-income"
                    : "transaction-expense";


            const date =
                new Date(
                    `${transaction.date}T00:00:00`
                );


            const formattedDate =
                new Intl.DateTimeFormat(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                ).format(date);


            html += `
                <div
                    class="transaction-row"
                    data-transaction-id="${transaction.id}"
                >

                    <div class="transaction-date">
                        ${formattedDate}
                    </div>


                    <div>

                        <span class="transaction-category">
                            ${escapeHTML(
                                transaction.category
                            )}
                        </span>

                    </div>


                    <div class="transaction-description">
                        ${escapeHTML(
                            transaction.description
                        )}
                    </div>


                    <div
                        class="
                            transaction-amount
                            ${amountClass}
                        "
                    >
                        ${sign}${formatMoney(
                            transaction.amount
                        )}
                    </div>


                    <button
                        class="transaction-delete"
                        data-delete-transaction="${transaction.id}"
                        title="Delete transaction"
                    >
                        ×
                    </button>

                </div>
            `;

        }
    );


    list.innerHTML =
        html;

}


/* ========================================
   RENDER FINANCE
======================================== */

function renderFinance() {

    updateFinanceStats();

    renderTransactions();

}


/* ========================================
   MODAL
======================================== */

const transactionModal =
    document.getElementById(
        "transactionModal"
    );


const openTransactionModal =
    document.getElementById(
        "openTransactionModal"
    );


const emptyTransactionButton =
    document.getElementById(
        "emptyTransactionButton"
    );


const closeTransactionModal =
    document.getElementById(
        "closeTransactionModal"
    );


function openFinanceModal() {

    transactionModal.classList.add(
        "show"
    );


    const dateInput =
        document.getElementById(
            "transactionDate"
        );


    if (!dateInput.value) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        dateInput.value =
            `${year}-${month}-${day}`;

    }


    document
        .getElementById(
            "transactionAmount"
        )
        .focus();

}


function closeFinanceModal() {

    transactionModal.classList.remove(
        "show"
    );

}


if (openTransactionModal) {

    openTransactionModal.addEventListener(
        "click",
        openFinanceModal
    );

}


if (emptyTransactionButton) {

    emptyTransactionButton.addEventListener(
        "click",
        openFinanceModal
    );

}


if (closeTransactionModal) {

    closeTransactionModal.addEventListener(
        "click",
        closeFinanceModal
    );

}


if (transactionModal) {

    transactionModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                transactionModal
            ) {

                closeFinanceModal();

            }

        }
    );

}


/* ========================================
   FORM
======================================== */

document
    .getElementById(
        "transactionForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const type =
                document.querySelector(
                    'input[name="transactionType"]:checked'
                ).value;


            const amount =
                Number(
                    document.getElementById(
                        "transactionAmount"
                    ).value
                );


            const category =
                document.getElementById(
                    "transactionCategory"
                ).value;


            const description =
                document.getElementById(
                    "transactionDescription"
                ).value.trim();


            const date =
                document.getElementById(
                    "transactionDate"
                ).value;


            if (
                !amount ||
                amount <= 0 ||
                !category ||
                !description ||
                !date
            ) {

                return;

            }


            addTransaction({

                type,

                amount,

                category,

                description,

                date

            });


            event.target.reset();


            closeFinanceModal();

        }
    );


/* ========================================
   DELETE
======================================== */

document
    .getElementById(
        "transactionList"
    )
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-delete-transaction]"
                );


            if (!button) {
                return;
            }


            deleteTransaction(
                button.dataset.deleteTransaction
            );

        }
    );