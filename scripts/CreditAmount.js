// this javaScript file is taking input about user transaction and save them on localStorage 
let db = []
let trsnId = []
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
    const amountInput = document.getElementById('Credited-amountInput').value;
    const categoryInput = document.getElementById('Credited-TransactionCatagory').value;
    const reasonInput = document.getElementById('Credited-TransactionReason').value;

    // Check if amount is a valid number and greater than 0
    if (isNaN(amountInput) || amountInput <= 0) {
        changeWarningBox('Amount should be greater than 0 or a valid number', true);
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


function saveCreditTransaction() {
    let today = new Date();
    transaction =
        `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()} | (${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}) | Credit | ${Number.parseInt(document.getElementById('Credited-amountInput').value)} | ${document.getElementById('Credited-TransactionCatagory').value} | ${document.getElementById('Credited-TransactionReason').value}`;
    localStorage.setItem(findUniqueTrsnId(), transaction)

}



try {
    const payBtn = document.getElementById('payBtn');
    payBtn.addEventListener('click', () => {
        window.location.href = './Pay_from_account.html';
    });

    const BackBtn = document.getElementById('backBtn');
    BackBtn.addEventListener('click', () => {
        window.location.href = './Home.html';
    })

    document.getElementById('CreditForm').addEventListener('submit', (e) => {
        /*  :: This is Event Listener on form > save btn.
            -> one of the biggest reponsible function because all small-function are connects with this one.
            -> e.preventDefault : for ensure that no default actions are perform during event listening.
            -> for saving transaction which are credited by other people to users account. amount will be increment into total balance. 
            -> contains error handing to ensure program flow can't be break during run state. */
        e.preventDefault();
        changeWarningBox(null, false);

        // check or verify data for transactio is valid 
        if (checkTransactionData()) {
            // confirm the transation 
            let TransactionConfirm = confirm('ARE YOU SURE ABOUT SAVING TRANSACTION?');
            if (TransactionConfirm) {
                let amount = document.getElementById('Credited-amountInput').value;
                if (updateBalance(amount, true)) {
                    saveCreditTransaction();
                }
            } else {
                alert('Transaction was cancelled!');
            }
        }
    });
}
catch (error) {
    // All event listener error are handle here 
    console.error(error.name)
    console.warn('warning : ' + error.message)
}