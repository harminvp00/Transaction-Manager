
// this javaScript file is taking input about user transaction and save them on localStorage 
let db = [], trsnId = [];
let transaction = "";
let warning = document.getElementsByClassName('customWarning');


// to clean up memory used by arrays 
function freeArraySpace() {
    db = [];
    trsnId = [];
}

// for display warnign or prevent unvalid date input 
function changeWarningBox(content, warning) {
    if (warning == true) {
        warningBox.style.color = '#f00';
        warningBox.innerText = content;
    }
    if (content == null) {
        warningBox.style.color = '#000';
        warningBox.innerText = "fill the following details!";
    }
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
        }
        if (localStorage.key(i).includes('AccountTrsn')) {

        } else {
            let trsnElement = `${localStorage.getItem(localStorage.key(i))}`;
            let [date, time, trsnType, usedAmount, usedCatagory, resonForThat] = trsnElement.split(' | ');
            trsnId.push(localStorage.key(i));
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

function checkTransactionData() {
    const amountInput = document.getElementById('Pay-amountInput').value;
    const categoryInput = document.getElementById('Pay-TransactionCatagory').value;
    const reasonInput = document.getElementById('Pay-TransactionReason').value;

    // Check if amount is a valid number and greater than 0
    if (isNaN(amountInput) || amountInput <= 0) {
        changeWarningBox('Aamount should be greater than 0 or a valid number', true);
        return false;
    }

    // Check if category is not selected
    if (categoryInput === 'default') {
        changeWarningBox('Select a valid active Category.', true);
        return false;
    }

    // Check if reason is not empty and does not contain numbers
    if (!/^[a-zA-Z\D\s]+$/.test(reasonInput)) {
        changeWarningBox('This field does not allow number or empty', true);
        return false;
    }

    return true;
}


function findUniqueTrsnId() {
    getTrsn(); // get all transactions of local Storage 
    let found, len = db.length + 1; // to save unique founded transaction and length of db (trsn array)
    for (let index = 1; index <= len; index++) {
        found = trsnId.find((id) => {
            return id == `transaction-${index}`;
        });
        if (found == undefined) {
            return `transaction-${index}`;
        }
        found = ''
    }
    freeArraySpace(); // claen memory
}

function savePayTransaction() {
    let today = new Date();

    transaction =
        `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()} | (${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}) | Pay | ${document.getElementById('Pay-amountInput').value} | ${document.getElementById('Pay-TransactionCatagory').value} | ${document.getElementById('Pay-TransactionReason').value}`;
    localStorage.setItem(findUniqueTrsnId(), transaction)
}



try {

    const CreditFormBtn = document.getElementById('creditBtn');
    CreditFormBtn.addEventListener('click', () => {
        window.location.href = './Credit_account.html';
    });

    const BackBtn = document.getElementById('backBtn');
    BackBtn.addEventListener('click', () => {
        window.location.href = './Home.html';
    })

    document.getElementById('PayForm').addEventListener('submit', (e) => {
        /*  :: This is Event Listener on form > save btn.
            -> one of the biggest reponsible function because all small-function are connects with this one.
            -> e.preventDefault : for ensure that no default actions are perform during event listening.
            -> this function is just save the transactions which are payed to other people from user.
            -> contains error handing to ensure program flow can't be break during run state. */
        e.preventDefault();
        changeWarningBox('fill the following details!', false);
        if (checkTransactionData()) {
            let amount = document.getElementById('Pay-amountInput').value;
            if (payRequest(amount)) {
                let TransactionConfirm = confirm('ARE YOU SURE ABOUT SAVING TRANSACTION?');
                if (TransactionConfirm) {
                    if (updateBalance(amount, false)) {
                        savePayTransaction();
                    }
                } else {
                    alert('Transaction was cancelled!');
                    return;
                }
            }
            else {
                alert('you dont have money to proceed.');
                return;
            }

        }
    });
}
catch (error) {
    // All event listener error are handle here 
    console.error(error.name)
    console.warn('warning : ' + error.message)
}
