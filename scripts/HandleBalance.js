let WALLET_BALANCE = document.getElementById('totalAmount');
let accBalance = Number.parseInt();

let data = [],
    creditTransaction = [],
    paidTransactions = [];

let Balance = 0,
    totalCreditedAmount = 0,
    totalPaidAmount = 0;


if (getLatestBalance() < 0) {
    initTotal();
}

function getLatestBalance() {
    return Number.parseInt(localStorage.getItem('Total-Amount'))
}
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


function getTransactions() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === 'Total-Amount') {
            continue;
        } else {
            let trsnElement = `${localStorage.getItem(localStorage.key(i))}`;
            let [date, time, trsnType, usedAmount, usedCatagory, resonForThat] = trsnElement.split(' | ');
            data.push({
                date: new Date(`${date}`),
                time: filterTime(time),
                trsnMode: trsnType,
                trsnAmount: Number.parseInt(usedAmount),
                trsnCatagory: usedCatagory,
                trsnReason: resonForThat
            });
        }
    }
}

function displapWalletAmount() {
    WALLET_BALANCE.innerText = `₹ ${getLatestBalance()}.00`;
}

function payRequest(requested_Amount) {
    return (getLatestBalance() >= requested_Amount) ? true : false;
}

function updateBalance(Amount, isCredit) {
    let currentBalance = Number.parseInt(localStorage.getItem('Total-Amount')) || 0; // Fetch latest balance

    if (isCredit) {
        currentBalance += Number.parseInt(Amount);
        alert(`₹ ${Amount}.00 has added in wallet!`)
    } else {
        if (currentBalance >= Amount) {
            currentBalance -= Amount;
            alert(`₹ ${Amount}.00 is paid from wallet!`)
        } else {
            alert('Insufficient balance! Transaction cannot proceed.');
            return false;
        }
    }

    localStorage.setItem('Total-Amount', currentBalance);
    displapWalletAmount();
    return true;
}
 

function initTotal() {
    getTransactions();
    // store the credit or paid Transaction in two seperate array 
    creditTransaction = data.filter((Transaction) => {
        return Transaction.trsnMode == 'Credit';
    });
    paidTransactions = data.filter((Transaction) => {
        return Transaction.trsnMode == 'Pay';
    });

    if (creditTransaction.length == 0 && paidTransactions.length == 0) {
        localStorage.setItem('Total-Amount', Balance);
        displapWalletAmount();
        return;
    }
    // geting credit or paid money additions 
    creditTransaction.map((Transaction) => {
        totalCreditedAmount = totalCreditedAmount + Transaction.trsnAmount;
    })
    paidTransactions.map((Transaction) => {
        totalPaidAmount = totalPaidAmount + Transaction.trsnAmount;
    })

    Balance = totalCreditedAmount - totalPaidAmount;
    localStorage.setItem('Total-Amount', Balance);
    displapWalletAmount();
}

initTotal();
