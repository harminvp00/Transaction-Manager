
// array to store diffrent transaction lists
let db = [];
let categoryFound = [];
let trsnCatagoryTotalAmount = 0;
let TransactionMode = '';
let toggleCatagoryMode = 'Pay';
let saveInputDates = {}

let handleCatagorys = {
    /*  this represent catagory names or total amount used/earn by/from catagory.
        catagoryName can be used to make search suggestions
        amount can be used for store catagory money temppraily
        setCatagoryAmount used to set catagory total based on algorithm  */
    CatagoryData: [
        // Credits Catagoies
        { catagoryName: 'Bank', amount: 0, mode: 'Credit' },
        { catagoryName: 'Business', amount: 0, mode: 'Credit' },
        { catagoryName: 'Freelance', amount: 0, mode: 'Credit' },
        { catagoryName: 'Home', amount: 0, mode: 'Credit' },
        { catagoryName: 'Investment Returns', amount: 0, mode: 'Credit' },
        { catagoryName: 'Loan Received', amount: 0, mode: 'Credit' },
        { catagoryName: 'Online Income', amount: 0, mode: 'Credit' },
        { catagoryName: 'Rent Income', amount: 0, mode: 'Credit' },
        { catagoryName: 'Reward', amount: 0, mode: 'Credit' },
        { catagoryName: 'Salary', amount: 0, mode: 'Credit' },
        { catagoryName: 'Scholarship', amount: 0, mode: 'Credit' },
        { catagoryName: 'Taken', amount: 0, mode: 'Credit' },
        // Paids Catagoies
        { catagoryName: 'Bill Payments', amount: 0, mode: 'Pay' },
        { catagoryName: 'Business Expenses', amount: 0, mode: 'Pay' },
        { catagoryName: 'Eating', amount: 0, mode: 'Pay' },
        { catagoryName: 'Education', amount: 0, mode: 'Pay' },
        { catagoryName: 'Entertainment', amount: 0, mode: 'Pay' },
        { catagoryName: 'Family', amount: 0, mode: 'Pay' },
        { catagoryName: 'Given', amount: 0, mode: 'Pay' },
        { catagoryName: 'Investment Expenses', amount: 0, mode: 'Pay' },
        { catagoryName: 'Loan Payments', amount: 0, mode: 'Pay' },
        { catagoryName: 'Medical', amount: 0, mode: 'Pay' },
        { catagoryName: 'Rent Expenses', amount: 0, mode: 'Pay' },
        { catagoryName: 'Repairing', amount: 0, mode: 'Pay' },
        { catagoryName: 'Shopping', amount: 0, mode: 'Pay' },
        { catagoryName: 'Travel', amount: 0, mode: 'Pay' },
        { catagoryName: 'Untracked Expense', amount: 0, mode: 'Pay' },
        
    ],

    // Used to set total amount used by catagory 
    setCatagoryAmount: (catagory_name, total_amount) => {
        handleCatagorys.CatagoryData.find((catagory) => catagory.catagoryName === catagory_name).amount = total_amount;
    },

    getModeName: (catagory_name) => {
        return handleCatagorys.CatagoryData.find((catagory) => catagory.catagoryName == catagory_name).mode;
    }
}

// this are all button status - unclick? or cliked?
let ButtonsClickStatus = {
    lastNDays: false,
    betweenDays: false,
    filterCatagory: false
}

// HTML elements else Buttons
const searchInput = document.getElementById('searchCatagory'); // serach input
const UL_element = document.getElementById('trsn-catagory-list'); // UL Unordered list element 
const mainPage = document.getElementById('main-page'); // main div id
const suggestionBox = document.getElementById('suggestionBox');

// Buttons 
const hidePopupButtons = document.getElementById('hidePopupButtons'); // hide custom dialog
const catagorySearchBtn = document.getElementById('catagorySearchBtn'); // serach button
const customPopupBox = document.getElementById('customPopupBox'); // custom dialog box
const searchTrsnByDates = document.getElementById('searchByDates'); // find transaction between two dates button
const filterCatagory = document.getElementById('filterCatagory'); // filter catagory button
const lastNDays = document.getElementById('lastNDays'); // last N days button
const betweenDays = document.getElementById('betweenDays'); // between two days button
let LI_element;

// this function is used to clearn array memory after use or at the end 
function freeArraySpace() {
    db = [];
    categoryFound = [];
}

// for find the last clicked button of analysis page 
function findLastClickedBtn() {
    UL_element.innerHTML = "";
    if (ButtonsClickStatus.lastNDays === true) {
        lastDaysCatagoryData();
    }
    if (ButtonsClickStatus.betweenDays === true) {
        filterTransactionsByDate(saveInputDates.startDate, saveInputDates.endDate);
    }
}

function checkValidCatagory(catagoryInput) {
    try {
        return (handleCatagorys.CatagoryData.find((catagory) => {
            return catagory.catagoryName.toLowerCase() == catagoryInput.toLowerCase();
        }).catagoryName.toLowerCase() == catagoryInput.toLowerCase()) ? true : false;
    }
    catch (error) {
        if (error.name == 'TypeError') {
            alert('This is not a catagory of our wallet')
        }
        return false;
    }
}

// function for filter the time data 
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

// function to get all transactions from localStorage 
function getTrsn() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === 'Total-Amount') {
            continue;
        } else {
            let trsnElement = `${localStorage.getItem(localStorage.key(i))}`;
            let [date, time, mode, amount, catagory, reason] = trsnElement.split(' | ');
            db.push({
                date: new Date(`${date}`),
                time: filterTime(time),
                trsnMode: mode,
                trsnAmount: amount,
                trsnCatagory: catagory,
                trsnReason: reason
            });
        }
    }
}

function displayCatagoryData(catagoryInput) {
    getTrsn();
    UL_element.innerHTML = '';

    // Calculate total amount for each category in the filtered transactions
    for (let i = 0; i < handleCatagorys.CatagoryData.length; i++) {
        trsnCatagoryTotalAmount = 0;
        if (handleCatagorys.CatagoryData[i].catagoryName.toLowerCase() == catagoryInput.toLowerCase()) {
            for (let j = 0; j < db.length; j++) {
                if (db[j].trsnCatagory.toLowerCase() == handleCatagorys.CatagoryData[i].catagoryName.toLowerCase()) {
                    catagory = handleCatagorys.CatagoryData[i].catagoryName;
                    trsnCatagoryTotalAmount += Number.parseInt(db[j].trsnAmount);
                }
            }
            handleCatagorys.setCatagoryAmount(handleCatagorys.CatagoryData[i].catagoryName, trsnCatagoryTotalAmount);

            if (handleCatagorys.CatagoryData[i].amount > 0) {
                UL_element.innerHTML = `
                <div class="w-90 mx-auto d-flex flex-column bg-primary rounded Shadow">
                    <h1 class="h5 text-light text-center pt-3 pb-2"> <b>Time Duration :</b> All Time </h1>
                    <div class="d-flex align-items-center w-90 mx-auto bg-whitesmoke mb-4 pt-2 rounded">
                    <div class="h3 text-dark fw-bold px-2 flex-1"> ${handleCatagorys.CatagoryData.find(catagory => catagory.catagoryName.toLowerCase() == catagoryInput.toLowerCase()).catagoryName.toUpperCase()}  </div>
                    <div class="h3 text-${(handleCatagorys.getModeName(handleCatagorys.CatagoryData.find(catagory => catagory.catagoryName.toLowerCase() == catagoryInput.toLowerCase()).catagoryName) == 'Pay') ? 'danger' : 'success'} px-3"> ${handleCatagorys.CatagoryData.find(catagory => catagory.catagoryName.toLowerCase() == catagoryInput.toLowerCase()).amount} </div>
                    </div>
                </div>`;
            } else {
                let message = `You are not saved any trasaction for "${handleCatagorys.CatagoryData[i].catagoryName}" catagory till now!.`,
                    pageAddsress = (handleCatagorys.CatagoryData[i].mode == 'Pay') ? "./Pay_from_account.html" : "./Credit_account.html",
                    linkContent = (handleCatagorys.CatagoryData[i].mode == 'Pay') ? `Pay money for "${handleCatagorys.CatagoryData[i].catagoryName}" category` : `Credit money into "${handleCatagorys.CatagoryData[i].catagoryName}" category`;
                displayNoTransactionYet(message, pageAddsress, linkContent);
            }
            break;
        }
    }   
    freeArraySpace();
}


// function is used to create a list element for each catagory
function createListElement(trsnCatagoryName, trsnCatagoryAmount, mode) {
    UL_element.style.transitionDuration = '2s';
    LI_element = document.createElement('li');
    LI_element.className = 'd-flex align-items-center Shadow mtb-5 rounded bg-light w-90 mx-auto py-2 px-3';
    LI_element.innerHTML = `<div class="flex-1"> ${trsnCatagoryName} </div>
            <div class="text-${(mode == 'Pay') ? 'danger' : 'success'}"> ${(mode == 'Pay') ? `-${trsnCatagoryAmount}` : `+${trsnCatagoryAmount}`} </div>`;
    UL_element.append(LI_element);
}

// This function is used to rank category based on how much amount is used or get from that particular category in the last 7 days
function lastDaysCatagoryData() {
    db = [];
    getTrsn();
    if (db.length === 0) {
        displayNoTransactionYet(
            "You are not done any transaction yet! please make your wallet credit first!",
            "./Credit_account.html",
            "make your first transaction now!"
        );
        return;
    }
    const currentDate = new Date();
    const last7DaysDate = new Date();
    last7DaysDate.setDate(currentDate.getDate() - 7);
    // Filter transactions from the last 7 days
    let last7DaysTransactions = db.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= last7DaysDate && transactionDate <= currentDate;
    });
    // Calculate total amount for each category in the last 7 days
    handleCatagorys.CatagoryData.forEach(catagory => {
        TransactionMode = ""
        trsnCatagoryTotalAmount = 0;
        last7DaysTransactions.forEach(transaction => {
            if (catagory.catagoryName === transaction.trsnCatagory) {
                TransactionMode = transaction.trsnMode;
                trsnCatagoryTotalAmount += Number.parseInt(transaction.trsnAmount);
            } else {
                TransactionMode = transaction.trsnMode;
            }
        });

        handleCatagorys.setCatagoryAmount(catagory.catagoryName, trsnCatagoryTotalAmount);
    });

    // Sort category data based on amount (highest to lowest)
    handleCatagorys.CatagoryData.sort((a, b) => b.amount - a.amount);

    // Create list element for each category
    handleCatagorys.CatagoryData.forEach(catagory => {
        if (ButtonsClickStatus.filterCatagory == true) {
            if (handleCatagorys.getModeName(catagory.catagoryName) == toggleCatagoryMode) {
                if (catagory.amount > 0) {
                    categoryFound.push((handleCatagorys.getModeName(catagory.catagoryName) == toggleCatagoryMode));
                    createListElement(catagory.catagoryName, catagory.amount, handleCatagorys.getModeName(catagory.catagoryName));
                }
            }
        } else {
            if (catagory.amount > 0) {
                createListElement(catagory.catagoryName, catagory.amount, handleCatagorys.getModeName(catagory.catagoryName));
            }
        }
    });


    // if any transactions for paid or credits are not done for that 
    if (ButtonsClickStatus.filterCatagory == true && toggleCatagoryMode == 'Pay' && categoryFound.length == 0) {
        displayNoTransactionYet(
            `No results are found for "${toggleCatagoryMode}"`,
            './Pay_from_account.html',
            'Save your first paid transactions'
        )
        return;
    }

    last7DaysTransactions = [];
    freeArraySpace(); // free the array memory after use
}

// Function to filter transactions between two dates
function filterTransactionsByDate(startDate, endDate) {
    db = []
    getTrsn(); // get all transactions from localStorage
    if (db.length === 0) {
        displayNoTransactionYet(
            "You are not done any transaction yet! please make your wallet credit first!",
            "./Credit_account.html",
            "make your first transaction now!"
        );
        return;
    }
    // Filter transactions between the specified dates
    const filteredTransactions = db.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });

    if (filteredTransactions.length === 0) {
        displayNoTransactionYet(
            `No results are found between "${startDate}" to "${endDate}".`,
            "./Credit_account.html",
            "Save New Transactions!"
        );
        freeArraySpace();
        return;
    } 

    // Calculate total amount for each category in the filtered transactions
    handleCatagorys.CatagoryData.forEach(catagory => {
        trsnCatagoryTotalAmount = 0;
        filteredTransactions.forEach(transaction => {
            if (catagory.catagoryName === transaction.trsnCatagory) {
                trsnCatagoryTotalAmount += Number.parseInt(transaction.trsnAmount);
            }
        });
        handleCatagorys.setCatagoryAmount(catagory.catagoryName, trsnCatagoryTotalAmount);
    });
    // Sort category data based on amount (highest to lowest)
    handleCatagorys.CatagoryData.sort((a, b) => b.amount - a.amount);
    // Create list element for each category
    // Create list element for each category
    handleCatagorys.CatagoryData.forEach(catagory => {
        if (ButtonsClickStatus.filterCatagory == true) {
            if (handleCatagorys.getModeName(catagory.catagoryName) == toggleCatagoryMode) {
                if (catagory.amount > 0) {
                    categoryFound.push((handleCatagorys.getModeName(catagory.catagoryName) == toggleCatagoryMode));
                    createListElement(catagory.catagoryName, catagory.amount, handleCatagorys.getModeName(catagory.catagoryName));
                }
            }
        } else {
            if (catagory.amount > 0) {
                createListElement(catagory.catagoryName, catagory.amount, handleCatagorys.getModeName(catagory.catagoryName));
            }
        }
    });

    // if any transactions for paid or credits are not done for that 
    if (ButtonsClickStatus.filterCatagory == true && toggleCatagoryMode == 'Pay' && categoryFound.length == 0) {
        displayNoTransactionYet(
            `No results are found for "${toggleCatagoryMode}"`,
            './Pay_from_account.html',
            'Save your first paid transactions'
        )
        return;
    }
    freeArraySpace(); // free the array memory after use
}


// Event Listners
document.addEventListener('click', (event) => {
    if (!suggestionBox.contains(event.target) && event.target !== searchInput) {
        suggestionBox.classList.add('d-none');
    }
});

// remove ul animation on every button click 
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        // Trigger the animation
        UL_element.style.animation = 'none';
        UL_element.offsetHeight; // Trigger reflow
        UL_element.style.animation = null;
    });
});

/* algorithm of serach catagory by name
       1. start : input the catagory name
       2. click serach button (click event listner)
           - check that catagory was available or not if not give alert
           - else continue process
       3. Now we have catagory find total amount spend on that catagory 
       4. end : display data on DOM */
catagorySearchBtn.addEventListener('click', () => {
    if (checkValidCatagory(searchInput.value)) {
        displayCatagoryData(searchInput.value);
    } else {
        return;
    }
})

searchInput.addEventListener('input', () => {
    const input = searchInput.value.toLowerCase();
    suggestionBox.innerHTML = '';
    if (input) {
        const filteredCategories = handleCatagorys.CatagoryData.filter(category => category.catagoryName.toLowerCase().includes(input));
        filteredCategories.forEach(category => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item p-2 border-bottom border-1 c-pointer';
            suggestionItem.textContent = category.catagoryName;
            suggestionItem.setAttribute('id', category.catagoryName);

            // for mouse enter effect 
            suggestionItem.addEventListener('mouseenter', () => {
                suggestionItem.style.opacity = 0.7;
                suggestionItem.style.background = '#000';
                suggestionItem.style.color = '#fff';
            })
            // for mouse leave effect 
            suggestionItem.addEventListener('mouseleave', () => {
                suggestionItem.style.opacity = 1;
                suggestionItem.style.background = 'unset';
                suggestionItem.style.color = 'unset';
            })

            suggestionItem.addEventListener('click', () => {
                searchInput.value = category.catagoryName;
                suggestionBox.innerHTML = '';
                suggestionBox.classList.add('d-none');
            });
            suggestionBox.appendChild(suggestionItem);
        });
        suggestionBox.classList.remove('d-none');
    } else {
        suggestionBox.classList.add('d-none');
    }
});

// element is a button for filterCatagory 
filterCatagory.addEventListener('click', () => {
    getTrsn();
    ButtonsClickStatus.filterCatagory = true;
    UL_element.innerHTML = ''; // Clear the UL element data before adding new data 
    if (toggleCatagoryMode === 'Credit') {
        toggleCatagoryMode = 'Pay';
        findLastClickedBtn();
    } else {
        toggleCatagoryMode = 'Credit';
        findLastClickedBtn();
    }
    ButtonsClickStatus.filterCatagory = false;
});


// transaction analysis page have custom dialog box for take input of two dates, and this event lister used to hide that custom dialog box. 
hidePopupButtons.addEventListener('click', () => {
    customPopupBox.classList.toggle('d-none');
    mainPage.style.transitionDuration = '.5s';
    mainPage.style.opacity = '100%';
    getTrsn();
    if (ButtonsClickStatus.betweenDays === true) {
        ButtonsClickStatus.betweenDays = false;
    }
    ButtonsClickStatus.lastNDays = true;
    UL_element.innerHTML = ''; // Clear the UL element data before adding new data
    lastDaysCatagoryData()
});


// find button : input to dates (start or end) to find transaction between that two dates 
searchTrsnByDates.addEventListener('click', () => {
    customPopupBox.classList.toggle('d-none');
    mainPage.style.transitionDuration = '.5s';
    mainPage.style.opacity = '100%';
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (new Date(startDate) == "Invalid Date" || new Date(endDate) == "Invalid Date") {
        displayNoTransactionYet(
            'Invalid Dates! Please Re-enter proper dates!',
            "./Home.html",
            "go back!"
        );
    } else {
        saveInputDates = { startDate, endDate };
        filterTransactionsByDate(startDate, endDate);
    }
});

// this buttons shows last N day's catagory data 
lastNDays.addEventListener('click', () => {
    getTrsn();
    if (ButtonsClickStatus.betweenDays === true) {
        ButtonsClickStatus.betweenDays = false;
        ButtonsClickStatus.filterCatagory = false;
    }
    ButtonsClickStatus.lastNDays = true;
    UL_element.innerHTML = ''; // Clear the UL element data before adding new data
    lastDaysCatagoryData()
});

// this buttons shows catagory data between two dates 
betweenDays.addEventListener('click', () => {
    getTrsn();
    if (db.length === 0) {
        displayNoTransactionYet(
            "You are not done any transaction yet! please make your wallet credit first!",
            "./Credit_account.html",
            "make your first transaction now!"
        );
        return;
    }
    customPopupBox.classList.toggle('d-none');
    mainPage.style.transitionDuration = '.5s';
    mainPage.style.opacity = '40%';
    UL_element.innerHTML = ''; // Clear the UL element data before adding new data 
    if (ButtonsClickStatus.lastNDays === true) {
        ButtonsClickStatus.lastNDays = false;
        ButtonsClickStatus.filterCatagory = false;
    }
    ButtonsClickStatus.betweenDays = true;
});


function displayNoTransactionYet(meassage, link, linkContent) {
    UL_element.innerHTML = "";
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
    UL_element.append(div)
}

// main code start here 
getTrsn();
ButtonsClickStatus.lastNDays = true;
ButtonsClickStatus.betweenDays = false;
ButtonsClickStatus.filterCatagory = false;
UL_element.innerHTML = ''; // Clear the UL element data before adding new data
lastDaysCatagoryData()