
let db = []
let INCOME = 0,
    EXPANCE = 0;

const info = document.getElementById('info');
const tableHead = document.getElementById('tableHead');
const title = document.getElementById('title');
const table = document.getElementById('recentTransactionTable');
const creditWalletLink = document.getElementById('creditWalletLink');
const Dashboard = document.getElementById('DashBoard');
const TODAY_DATE = document.getElementById('todaysDate');

// todays variable for dom 
const todayCredits = document.getElementById('todayCredits');
const todayPaid = document.getElementById('todayPaid');
const todayBalance = document.getElementById('todayBalance');
// month variable for dom 
const monthName = document.getElementById('monthName');
const monthCredits = document.getElementById('monthCredits');
const monthPaids = document.getElementById('monthPaids');
const monthBalance = document.getElementById('monthBalance');

let today = new Date();
let StringDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
let todaydate = new Date(StringDate);
TODAY_DATE.innerHTML = `${todaydate}`.slice(0, 15);
monthName.innerHTML = todaydate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });



// function for filter the time  
function filterTime(time) {
    let formatedTime = `${time}`;
    let hour = formatedTime.substring(1, 3);
    let minute = formatedTime.substring(4, 6);
    let seconds = formatedTime.substring(7, 9)
    if (Number.parseInt(formatedTime.substring(1, 3)) > 12) {
        hour -= 12;
        return (hour >= 10) ? `${hour}:${minute}:${seconds} PM` : `0${hour}:${minute}:${seconds} PM`;
    } else {
        if (Number.parseInt(hour) == 0) { hour = '12'; }
        return `${hour}:${minute}:${seconds} AM`;
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
                date: new Date(`${date}`),
                time: filterTime(time),
                trsnMode: trsnType,
                trsnAmount: usedAmount,
                trsnCatagory: usedCatagory,
                trsnReason: resonForThat
            });
        }
    }
}


function findRecentTransactions() {
    let freshTransactions = [];
    freshTransactions = db.sort((trsn1, trsn2) => {
        return trsn2.date - trsn1.date;
    })

    let endLength = 3;

    if (db.length == 2) {
        endLength = 2;
    }
    if (db.length == 1) {
        endLength = 1;
    }

    for (let i = 0; i < endLength; i++) {
        let amount = freshTransactions[i].trsnAmount;
        let mode = freshTransactions[i].trsnMode;
        let category = freshTransactions[i].trsnCatagory;
        let reason = freshTransactions[i].trsnReason;

        let row = document.getElementsByClassName('tableRow')[i];
        row.classList.toggle('d-none');
        let amountColumn = document.getElementsByClassName('trsnAmount')[i];
        let categoryColumn = document.getElementsByClassName('trsnCatagory')[i];
        let reasonColumn = document.getElementsByClassName('trsnReason')[i];

        amountColumn.innerText = (mode == 'Pay') ? `-${amount}` : `+${amount}`;
        amountColumn.style.color = (mode == 'Pay') ? `red` : `green`;
        categoryColumn.innerText = category;
        reasonColumn.innerText = reason;
    }
}


function activateDashboardToday() {
    // 1 Day = 1 day * 24 hour * 60 minute * 60 seconds * 1000 mili seconds
    let yesterday = new Date(todaydate.getTime() - (1 * 24 * 60 * 60 * 1000));
    let tommorrow = new Date(todaydate.getTime() + (1 * 24 * 60 * 60 * 1000));

    let todayTransactions = db.filter((transaction) => {
        return transaction.date > yesterday && transaction.date < tommorrow;
    })

    INCOME = 0, EXPANCE = 0; // to ensure that no other amounts includes else todays transactions 
    todayTransactions.forEach((transaction) => {
        if (transaction.trsnMode == 'Pay') {
            EXPANCE += Number.parseInt(transaction.trsnAmount);
        } else {
            INCOME += Number.parseInt(transaction.trsnAmount);
        }
    })

    todayCredits.innerText = `+${INCOME}`;
    todayPaid.innerText = `-${EXPANCE}`;
    todayBalance.innerText = (INCOME-EXPANCE);
}

function activateDashboardMonth() {
    const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
 
    let thisMonthTransactions = db.filter((transaction) => {
        return transaction.date >= firstDate && transaction.date <= lastDate;
    });

    INCOME = 0, EXPANCE = 0; // to ensure that no other amounts includes else todays transactions 
    thisMonthTransactions.forEach((transaction) => {
        if (transaction.trsnMode == 'Pay') {
            EXPANCE += Number.parseInt(transaction.trsnAmount);
        } else {
            INCOME += Number.parseInt(transaction.trsnAmount);
        }
    })

    // add data 
    monthCredits.innerText = `+${INCOME}`;
    monthPaids.innerText = `-${EXPANCE}`;
    monthBalance.innerText = `${(INCOME - EXPANCE)}`;
}



info.addEventListener('click', () => {
    // button for switch page to info.html 
    window.location.href = './info.html';
})

// main program has run from here!
getTrsn()
if (db.length > 0) {
    title.innerText = 'Some of your recent transaction are these!';
    table.classList.toggle('d-none');
    activateDashboardToday();
    activateDashboardMonth();
    findRecentTransactions();

} else {
    // table.classList.toggle('d-none');
    creditWalletLink.classList.toggle('d-none');
    title.style.marginTop = '30px';
    title.textContent = 'You are not done any transaction yet, First make your wallet credit !';
}
db = []