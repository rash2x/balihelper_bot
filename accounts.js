const AccountController = require('./controllers/AccountController');
const Account = require('./models/Account');

let accountsCache = [];

module.exports = {
    add: (contact) => {
        Account.find({}, (err, accounts) => {
            if (err) console.log(err);

            const accountExisted = accounts.find(account => account.userId === contact.user_id);

            if (accountExisted) {
                console.log(accountExisted.firstName + '\'s account with number ' + accountExisted.phoneNumber + ' is already exist.');
                return;
            }

            AccountController.createNewTask({
                phoneNumber: contact.phone_number,
                firstName: contact.first_name,
                lastName: contact.last_name,
                userId: contact.user_id
            });
        });
    },
    get: (msg) => {
        return new Promise((resolve, reject) => {
            const accountExisted = accountsCache.find(account => account.userId === msg.chat.id);

            if(accountExisted) {
                resolve(accountExisted);
                return;
            }

            Account.find({}, (err, accounts) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const accountExisted = accounts.find(account => account.userId === msg.chat.id);

                if(accountExisted)
                    accountsCache.push(accountExisted);

                resolve(accountExisted ? accountExisted : false);
            });
        });
    },
    check: (msg) => {
        return new Promise((resolve, reject) => {
            Account.find({}, (err, accounts) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve(accounts.findIndex(account => account.userId === msg.chat.id) >= 0);
            });
        });
    }
};

