const Accounts = require('./accounts');
const CommandStore = require('./commandStore');
const ACTIONS = require('./actions');
const KEYBOARDS = require('./keyboards');
const MESSAGES = require('./messages');

const GROUP_ID = -232611552;

const _commands = {
    'START': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        Accounts.check(msg).then(status => {
            if (status) {
                bot.sendMessage(msg.chat.id, MESSAGES['START'], {
                    'reply_markup': {
                        keyboard: KEYBOARDS['START']
                    }
                });
            } else {
                bot.sendMessage(msg.chat.id, MESSAGES['AUTH'], {
                    'reply_markup': {
                        keyboard: KEYBOARDS['AUTH']
                    }
                });
            }
        });
    },
    'AUTH': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, MESSAGES['AUTH'], {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    },
    'CALL_TAXI': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, MESSAGES['CHAT_TAXI'], {
            'reply_markup': {
                keyboard: KEYBOARDS['TAXI']
            }
        });
    },
    'CANCEL_TAXI': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, MESSAGES['CANCEL_TAXI'], {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    },
    'RENT_BIKE': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, MESSAGES['RENT_BIKE'], {
            'reply_markup': {
                keyboard: KEYBOARDS['BIKES']
            }
        });
    },
    'INSTRUCTOR': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, MESSAGES['INSTRUCTOR'], {
            'reply_markup': {
                keyboard: KEYBOARDS['INSTRUCTOR']
            }
        });
    },
    'BACK': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, 'Возвращаем обратно', {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    }
};

class Commands {
    callTaxi(bot, msg) {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Новый клиент на такси');
            bot.sendContact(GROUP_ID, account.phoneNumber, account.firstName);
        });
    };

    cancelTaxi(bot, msg) {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Клиент с номером ' + account.phoneNumber + ' отменил такси');
        });
    }

    rentBike(bot, msg) {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Клиент хочет байк — ' + msg.text);
            bot.sendContact(GROUP_ID, account.phoneNumber, account.firstName);
        });
    };

    sendLocation(bot, msg) {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Клиент с номером ' + account.phoneNumber + ' отправил его локацию');
            bot.sendLocation(GROUP_ID, msg.location.longitude, msg.location.latitude);
        });
    };

    callInstructor(bot, msg) {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Еще одному нужен инструктор');
            bot.sendContact(GROUP_ID, account.phoneNumber, account.firstName);

            bot.sendMessage(msg.chat.id, MESSAGES['INSTRUCTOR_SENT'], {
                'reply_markup': {
                    keyboard: KEYBOARDS['START']
                }
            });
        });
    };

    rentBikeSent(bot, msg) {
        bot.sendMessage(msg.chat.id, MESSAGES['RENT_BIKE_SENT'], {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    };

    auth(bot, msg) {
        Accounts.add(msg.contact);

        bot.sendMessage(msg.chat.id, MESSAGES['AUTH_THANKS'], {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    };

    send(bot, msg) {
        const bikes = [].concat(KEYBOARDS['BIKES'][0], KEYBOARDS['BIKES'][1]);
        const isBike = bikes.findIndex(name => name === msg.text);
        const isAuth = msg.hasOwnProperty('contact');
        const isLocation = msg.hasOwnProperty('location');
        const isCallTaxi = msg.text === ACTIONS['CALL_TAXI'];
        const isCancelTaxi = msg.text === ACTIONS['CANCEL_TAXI'];
        const isRentBike = msg.text === ACTIONS['RENT_BIKE'];
        const isCallInstructor = msg.text === ACTIONS['CALL_INSTRUCTOR'];

        if (msg.text === ACTIONS['START']) _commands['START'](bot, msg);
        if (msg.text === ACTIONS['AUTH']) _commands['AUTH'](bot, msg);
        if (msg.text === ACTIONS['CALL_TAXI']) _commands['CALL_TAXI'](bot, msg);
        if (msg.text === ACTIONS['CANCEL_TAXI']) _commands['CANCEL_TAXI'](bot, msg);
        if (msg.text === ACTIONS['RENT_BIKE']) _commands['RENT_BIKE'](bot, msg);
        if (msg.text === ACTIONS['INSTRUCTOR']) _commands['INSTRUCTOR'](bot, msg);
        if (msg.text === ACTIONS['BACK']) _commands['BACK'](bot, msg);

        if (isBike >= 0) this.rentBikeSent(bot, msg);
        if (isAuth) this.auth(bot, msg);
        if (isCallTaxi) this.callTaxi(bot, msg);
        if (isRentBike) this.rentBike(bot, msg);
        if (isCancelTaxi) this.cancelTaxi(bot, msg);
        if (isLocation) this.sendLocation(bot, msg);
        if (isCallInstructor) this.callInstructor(bot, msg);

        CommandStore.add(msg.chat.id, msg.text);
    }
}

module.exports = Commands;