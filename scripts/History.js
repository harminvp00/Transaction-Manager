// Js array variables
let db = [];
let sortedDB = [];
let tempTrsnDB = [];
let specificModeTrsn = [];
let transactionDate = ``;
let CurrentCatagoryMode = ``;

// form's elements 
const Form = document.getElementById('fetch-Customizations-Form');
const Trsn_Order = document.getElementById('sort');
const UL = document.getElementById('trsn-list');
const historyMessage = document.getElementById('historyMessage');
const SortingTitle = document.getElementById('SortingTitle');

// for custom dialog box to get dates input
// custom popup box 
const customPopupBox = document.getElementById('customPopupBox');
const mainPage = document.getElementById('main-page');
// date inputs 
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
// buttons 
const hidePopupButtons = document.getElementById('hidePopupButtons');
const searchByDates = document.getElementById('searchByDates');


sessionStorage.setItem('sortTechnique', 'New'); // default sort new 
// Buttons for Make sorting 
const sortByDates = document.getElementById('sortByDates'); // for sort new or old transactions
const sortByPrice = document.getElementById('sortByPrice'); // for sort high and low price transactions
const sortByMode = document.getElementById('sortByMode'); // for sort credits or paid transactions
const singleCatagory = document.getElementById('singleCatagory'); // for sort transaction of any one catagory 
const betweenDays = document.getElementById('betweenDays'); // for view transaction of between two days


// Catagorys data 
let CatagoryData = [
    // Credits Catagoies
    { catagoryName: 'Bank', mode: 'Credit' },
    { catagoryName: 'Business', mode: 'Credit' },
    { catagoryName: 'Freelance', mode: 'Credit' },
    { catagoryName: 'Home', mode: 'Credit' },
    { catagoryName: 'Home', mode: 'Credit' },
    { catagoryName: 'Investment Returns', mode: 'Credit' },
    { catagoryName: 'Loan Received', mode: 'Credit' },
    { catagoryName: 'Online Income', mode: 'Credit' },
    { catagoryName: 'Rent Income', mode: 'Credit' },
    { catagoryName: 'Reward', mode: 'Credit' },
    { catagoryName: 'Salary', mode: 'Credit' },
    { catagoryName: 'Scholarship', mode: 'Credit' },
    // Paids Catagoies
    { catagoryName: 'Bill Payments', mode: 'Pay' },
    { catagoryName: 'Business Expenses', mode: 'Pay' },
    { catagoryName: 'Eating', mode: 'Pay' },
    { catagoryName: 'Education', mode: 'Pay' },
    { catagoryName: 'Entertainment', mode: 'Pay' },
    { catagoryName: 'Family', mode: 'Pay' },
    { catagoryName: 'Investment Expenses', mode: 'Pay' },
    { catagoryName: 'Loan Payments', mode: 'Pay' },
    { catagoryName: 'Medical', mode: 'Pay' },
    { catagoryName: 'Rent Expenses', mode: 'Pay' },
    { catagoryName: 'Repairing', mode: 'Pay' },
    { catagoryName: 'Shopping', mode: 'Pay' },
    { catagoryName: 'Travel', mode: 'Pay' },
]
// for make array memory free
function freeArraySpace() {
    db = []
    sortedDB = []
    tempTrsnDB = []
    specificModeTrsn = []
}

// function for find catagory mode by its name
function findCatagoryType(catagory) {
    CatagoryData.forEach((catagoryDetails) => {
        if (catagoryDetails.catagoryName == catagory) {
            CurrentCatagoryMode = catagoryDetails.mode;
            return;
        }
    })
}

// function for filter the time  
function filterTime(time) {
    let formatedTime = `${time}`;
    let hour = formatedTime.substring(1, 3);
    let minute = formatedTime.substring(4, 6);
    if (Number.parseInt(formatedTime.substring(1, 3)) > 12) {
        hour -= 12;
        return (hour >= 10) ? `${hour}:${minute} PM` : `0${hour}:${minute} PM`;
    } else {
        if (Number.parseInt(hour) == 0) { hour = '12'; }
        return `${hour}:${minute} AM`;
    }
}



// function to get all transactions key from localStorage 
function getTrsn() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === 'Total-Amount') {
            continue;
        } else {
            let trsnElement = `${localStorage.getItem(localStorage.key(i))}`;
            let [date, time, trsnType, usedAmount, usedCatagory, resonForThat] = trsnElement.split(' | ');
            db.push({
                trsnId: localStorage.key(i),
                date: new Date(`${date}`),
                time: filterTime(time),
                trsnMode: trsnType,
                trsnAmount: usedAmount,
                trsnCatagory: usedCatagory,
                trsnReason: resonForThat,
            });
        }
    }

    if (db.length === 0) {
        displayNoTransactionYet(
            'You are not save any transactions yet! Please first save credit transaction to continue!',
            "./Credit_account.html",
            "Save a credit transaction now!"
        );
        freeArraySpace();
        return false;
    }
    return true;
}

function SortTrsnByDate(order = 'asc') {
    sortedDB = db.sort((a, b) => {
        return order === 'asc' ? a.date - b.date : b.date - a.date;
    });

    if (UL) { UL.innerHTML = ''; }

    for (let start = 0; start < sortedDB.length; start++) {
        // Create a list by using trsn data 
        createHistoryList(
            sortedDB[start].trsnId, // corrected here
            sortedDB[start].date,
            sortedDB[start].trsnMode,
            sortedDB[start].trsnAmount,
            sortedDB[start].trsnCatagory,
            sortedDB[start].trsnReason
        );
    }
    freeArraySpace();
}

function sortByTrsnPrices(priceLevel) {
    sortedDB = db.sort((a, b) => {
        return priceLevel === 'low' ? a.trsnAmount - b.trsnAmount : b.trsnAmount - a.trsnAmount;
    });

    if (UL) { UL.innerHTML = ''; }

    for (let start = 0; start < sortedDB.length; start++) {
        // Create a list by using trsn data 
        createHistoryList(
            sortedDB[start].trsnId,
            sortedDB[start].date,
            sortedDB[start].trsnMode,
            sortedDB[start].trsnAmount,
            sortedDB[start].trsnCatagory,
            sortedDB[start].trsnReason
        );
    }
    freeArraySpace();
}


function getCreditedTrsn() {
    tempTrsnDB = db.filter((trsn) => {
        return trsn.trsnMode === 'Credit';
    })

    if (UL) { UL.innerHTML = '' };

    specificModeTrsn = tempTrsnDB.sort((a, b) => {
        return b.date - a.date;
    });


    for (let start = 0; start < specificModeTrsn.length; start++) {
        // Create a list by using trsn data
        createHistoryList(
            specificModeTrsn[start].trsnId,
            specificModeTrsn[start].date,
            specificModeTrsn[start].trsnMode,
            specificModeTrsn[start].trsnAmount,
            specificModeTrsn[start].trsnCatagory,
            specificModeTrsn[start].trsnReason
        );
    }
    freeArraySpace();
}

function getPaidTrsn() {
    tempTrsnDB = db.filter((trsn) => {
        return trsn.trsnMode === 'Pay';
    })

    if (UL) { UL.innerHTML = '' };
    specificModeTrsn = tempTrsnDB.sort((a, b) => {
        return b.date - a.date;
    });

    if (specificModeTrsn.length === 0) {
        displayNoTransactionYet(
            "You are not saved any paid transaction!",
            "./Pay_from_account.html",
            "click to save now!"
        )
        freeArraySpace();
        return;
    }

    for (let start = 0; start < specificModeTrsn.length; start++) {
        // Create a list by using trsn data
        createHistoryList(
            specificModeTrsn[start].trsnId,
            specificModeTrsn[start].date,
            specificModeTrsn[start].trsnMode,
            specificModeTrsn[start].trsnAmount,
            specificModeTrsn[start].trsnCatagory,
            specificModeTrsn[start].trsnReason
        );
    }
    freeArraySpace();
}

// for sorting just only one catagorys transactions 
function CatagoryTransactions(catagory) {
    UL.innerHTML = "";
    if (db.length === 0) {
        displayNoTransactionYet(
            'You are not save any transactions yet! Please first save credit transaction to continue!',
            "./Credit_account.html",
            "Save a credit transaction now!"
        );
        freeArraySpace();
        return;
    }
    // get only transaction which catagory is match with requested 
    tempTrsnDB = db.filter((transaction) => {
        return transaction.trsnCatagory == catagory;
    })

    // sort transaction into new by dates 
    tempTrsnDB.sort((transaction1, transaction2) => {
        return transaction2.date - transaction1.date;
    })

    if (tempTrsnDB.length == 0) {
        findCatagoryType(catagory);
        let message = `No transaction are found for "${catagory}" catagory!`;
        let link = (CurrentCatagoryMode == 'Pay') ? './Pay_from_account.html' : './Credit_account.html';
        let linkContent = (CurrentCatagoryMode == 'Pay') ? `save paid transaction into "${catagory}".` : `save credit transaction into "${catagory}".`;
        displayNoTransactionYet(message, link, linkContent);
        freeArraySpace();
        return;
    }

    // create list element for every recived transactions 
    tempTrsnDB.forEach((transaction) => {
        createHistoryList(
            transaction.trsnId,
            transaction.date,
            transaction.trsnMode,
            transaction.trsnAmount,
            transaction.trsnCatagory,
            transaction.trsnReason,
        );
    })

    freeArraySpace(); // clean the array for prevent double insertion for transactions 
}

function TransactionBetweenTwoDates(startDate, endDate) {
    freeArraySpace();
    getTrsn(); // get all transactions
    UL.innerHTML = "";
    UL.style.animation = 'none';
    UL.offsetHeight; // Trigger reflow
    UL.style.animation = null;
    if (db.length === 0) {
        displayNoTransactionYet(
            'You are not save any transactions yet! Please first save credit transaction to continue!',
            "./Credit_account.html",
            "Save a credit transaction now!"
        );
        freeArraySpace();
        return;
    }
    tempTrsnDB = db.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
    tempTrsnDB.filter((transaction1, transaction2) => {
        return transaction2.date - transaction1.date;
    })

    if (tempTrsnDB.length == 0) {
        displayNoTransactionYet(
            `No Transactions are done between ${startDate} to ${endDate}`,
            `./Home.html`,
            'Goto Home'
        )
        freeArraySpace();
        return;
    }

    // create list element for every recived transactions 
    tempTrsnDB.forEach((transaction) => {
        createHistoryList(
            transaction.trsnId,
            transaction.date,
            transaction.trsnMode,
            transaction.trsnAmount,
            transaction.trsnCatagory,
            transaction.trsnReason,
        );
    })
    freeArraySpace(); // clean up array memory
}

// function for format date into date/month/year form 
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


function UpdateBalanceAfterDelete(deletedTransactionid) {
    let [, , type, amount, ...etc] = localStorage.getItem(deletedTransactionid).split(' | ');
    if (type == 'Credit') {
        let newBalance = Balance - Number.parseInt(amount);
        if (newBalance >= 0) {
            localStorage.setItem('Total-Amount', Balance - Number.parseInt(amount));
            displapWalletAmount();
        } else {
            return false;
        }
    } else {
        localStorage.setItem('Total-Amount', Balance + Number.parseInt(amount));
        displapWalletAmount();
    }
    return true;
}

// Add event listeners to delete buttons
function addDeleteEventListeners() {
    const deleteTranactionButtons = document.querySelectorAll('.deleteTranaction');
    deleteTranactionButtons.forEach((button) => {
        if (!button.dataset.listenerAdded) {
            button.addEventListener('click', function () {
                const li = button.closest("li");
                const removeId = li.id;
                if (confirm('Want to delete this transactions?')) {
                    if (UpdateBalanceAfterDelete(removeId)) {
                        localStorage.removeItem(removeId);
                        li.remove();
                        alert('Transaction is removed...');
                        displaySortingTitle(`results for "${sessionStorage.getItem('sortTechnique')}" transactions!`);
                        fetchHistory(sessionStorage.getItem('sortTechnique'));
                    } else {
                        alert('This transaction is cannot be deleted now!');
                    }
                } else {
                    alert('transaction is not removed...')
                }
                // li.remove(); // Remove the list item from the DOM
            });
            button.dataset.listenerAdded = 'true'; // Mark this button as having the listener added
        }
    });
}

// Create a new list at the end of ul 
function createHistoryList(trsnId, trsnDate, trsnMode, trsnAmount, trsnCatagory, trsnReason) {
    transactionDate = `${trsnDate}`;
    let li = document.createElement('li');
    li.className = 'd-flex align-items-center flex-wrap border shadow m-0 my-2 px-3 py-0';
    li.id = trsnId;
    li.innerHTML = `
        <div class="d-flex align-items-center justify-content-center mx-1">
            <img src="./icons/Categorys/${trsnCatagory}.png" alt="${trsnCatagory}">
        </div>

        <div class="d-flex flex-column flex-grow-1">
            <h1 class="fs-18 text-start fw-bold pt-3"> <b> ${trsnReason} </b> </h1>
            <p class="fs-12 text-start">
                <b class="text-${(trsnMode === 'Pay') ? `danger` : 'success'}">  
                ${(trsnMode === 'Pay') ? `-₹${trsnAmount}` : `+₹${trsnAmount}`}  </b>
                ${(trsnMode === 'Pay') ? ` into ${trsnCatagory}` : ` from ${trsnCatagory}`}
            </p>
        </div>

        <div class="d-flex flex-column align-items-center gap-2 fs-10">
            <button type="button" class="btn w-100 mt-1 d-flex align-items-center flex-grow-1 fs-14 deleteTranaction text-light bg-danger Shadow"> Remove </button>
            ${formatDate(transactionDate.substring(0, 15))}
        </div>`;

    UL.append(li);
    transactionDate = ``;
    addDeleteEventListeners();
}

// this function is used to display message when the transaction of paid or any other category are zero transaction to show on the screen 
function displayNoTransactionYet(meassage, link, linkContent) {
    UL.innerHTML = "";
    let div = document.createElement('div');
    let h1 = document.createElement('h1');
    let a = document.createElement('a');

    // add class to the elements 
    div.className = "analysisMeassageBox d-flex flex-column";
    h1.className = "h5 w-70 text-center fw-bold mx-auto";
    a.className = "mx-auto text-decoration-none text-center text-primary";

    // add text inside child elements 
    h1.innerHTML = meassage;
    a.innerText = linkContent;

    // add aditions attributes 
    a.href = link;
    div.style.marginTop = '100px';

    // animation effect like fad out
    div.style.opacity = '1%';
    div.style.transitionDuration = '1s';
    div.style.opacity = '100%';

    // append element to div and div into UL
    div.append(h1);
    div.append(a);
    UL.append(div)
}

function displaySortingTitle(title) {
    SortingTitle.innerText = title;
}

function fetchHistory(sortTechnique) {
    // get all transaction data into array
    UL.innerHTML = ""
    if (getTrsn()) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        switch (sortTechnique) {
            case 'New':
                SortTrsnByDate('desc');
                break;

            case 'Old':
                SortTrsnByDate('asc');
                break;

            case 'High':
                sortByTrsnPrices('high');
                break;

            case 'Low':
                sortByTrsnPrices('low');
                break;

            case 'Credit':
                getCreditedTrsn();
                break;

            case 'Paid':
                getPaidTrsn();
                break;

            case 'Categories':
                CatagoryTransactions(singleCatagory.value)
                break;

            case 'betweenDates':
                displaySortingTitle(`results for transactions from 21 Feb 2025 to 22 Feb 2025`);
                break;

            default:
                alert('There are some problem occurs! please try to do again!');
                break;
        }
    }
    freeArraySpace();
}

// for make dates input box hide 
hidePopupButtons.addEventListener('click', () => {
    customPopupBox.classList.toggle('d-none');
    mainPage.style.transitionDuration = '.5s';
    mainPage.style.opacity = '100%';
});


// buttons is given for make function call on date input 
searchByDates.addEventListener('click', () => {
    customPopupBox.classList.toggle('d-none');
    mainPage.style.transitionDuration = '.5s';
    mainPage.style.opacity = '100%';
    if (new Date(startDate.value) == "Invalid Date" || new Date(endDate.value) == "Invalid Date") {
        console.log('dates are wrong!');
        displaySortingTitle('Invalid Dates! Please Re-enter proper dates!');
        return;
    }
    displaySortingTitle(`results for transactions from "${startDate.value}" to "${endDate.value}".`);
    TransactionBetweenTwoDates(startDate.value, endDate.value);
});
// for show hide custom box
betweenDays.addEventListener('click', () => {
    customPopupBox.classList.toggle('d-none');
    mainPage.style.transitionDuration = '.5s';
    mainPage.style.opacity = '50%';

})

// for new or old transactions sorting 
sortByDates.addEventListener('click', () => {
    sessionStorage.setItem('sortTechnique', sortByDates.value);
    displaySortingTitle(`results for "${sortByDates.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
});

sortByDates.addEventListener('input', () => {
    sessionStorage.setItem('sortTechnique', sortByDates.value);
    displaySortingTitle(`results for "${sortByDates.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
});

// for higher or lower amount sorting 
sortByPrice.addEventListener('click', () => {
    sessionStorage.setItem('sortTechnique', sortByPrice.value);
    displaySortingTitle(`results for "${sortByPrice.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
})
sortByPrice.addEventListener('input', () => {
    sessionStorage.setItem('sortTechnique', sortByPrice.value);
    displaySortingTitle(`results for "${sortByPrice.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
})

// for just only credits or paid amount sorting 
sortByMode.addEventListener('click', () => {
    sessionStorage.setItem('sortTechnique', sortByMode.value);
    displaySortingTitle(`results for "${sortByMode.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
})
sortByMode.addEventListener('input', () => {
    sessionStorage.setItem('sortTechnique', sortByMode.value);
    displaySortingTitle(`results for "${sortByMode.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
})

// for specific one catagory 
singleCatagory.addEventListener('input', () => {
    sessionStorage.setItem('sortTechnique', 'Categories');
    displaySortingTitle(`results for "${singleCatagory.value}" transactions!`);
    fetchHistory(sessionStorage.getItem('sortTechnique'));
})

// code start here (check custom dialog box visibility)
if (customPopupBox.classList.contains('d-none')) {
    startDate.removeAttribute('required');
    endDate.removeAttribute('required');
} else {
    startDate.setAttribute('required', true);
    endDate.setAttribute('required', true);
}


// default sort 
displaySortingTitle(`results for "${sessionStorage.getItem('sortTechnique')}" transactions!`);
fetchHistory(sessionStorage.getItem('sortTechnique'));
