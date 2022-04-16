let db;

const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore("new_budgetItem", { autoIncrement: true });
};

request.onsuccess = function (e) {
    db = e.target.result;
    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (e) {
    console.log(e.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["new_budgetItem"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_budgetItem");
    budgetObjectStore.add(record);
};

function uploadBudget() {
    const transaction = db.transaction(["new_budgetItem"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_budgetItem");
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((serverResponse) => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(["new_budgetItem"], "readwrite");
                const budgetObjectStore = transaction.objectStore("new_budgetItem");

                budgetObjectStore.clear();

                alert("All saved entries have been submitted!")
            })
            .catch((err) => {console.log(err)});
        }
    };
};

window.addEventListener('online', uploadBudget);