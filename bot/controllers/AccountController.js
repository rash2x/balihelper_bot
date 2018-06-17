const Account = require("../models/Account");

exports.createNewTask = (account) => {
    let newAccount = new Account(account);

    newAccount.save((err, account) => {
        if (err) {
            console.log(err)
        }

        console.log(account);
    });
};