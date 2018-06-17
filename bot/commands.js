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

        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Новый клиент на такси');
            bot.sendContact(GROUP_ID, account.phoneNumber, account.firstName);
        });

        bot.sendMessage(msg.chat.id, MESSAGES['CHAT_TAXI'], {
            'reply_markup': {
                keyboard: KEYBOARDS['TAXI']
            }
        });
    },
    'CANCEL_TAXI': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Клиент с номером ' + account.phoneNumber + ' отменил такси');
        });

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
    'RENT_BIKE_SENT': (bot, msg) => {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Клиент хочет байк — ' + msg.text);
            bot.sendContact(GROUP_ID, account.phoneNumber, account.firstName);
        });

        bot.sendMessage(msg.chat.id, MESSAGES['RENT_BIKE_SENT'], {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
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
    'CALL_INSTRUCTOR': (bot, msg) => {
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
    },
    'BACK': (bot, msg) => {
        CommandStore.add(msg.chat.id, msg.text);

        bot.sendMessage(msg.chat.id, 'Возвращаем обратно', {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    },
    'AUTH_THANKS': (bot, msg) => {
        Accounts.add(msg.contact);

        bot.sendMessage(msg.chat.id, MESSAGES['AUTH_THANKS'], {
            'reply_markup': {
                keyboard: KEYBOARDS['START']
            }
        });
    }
};

class Commands {
    sendLocation(bot, msg) {
        Accounts.get(msg).then(account => {
            if (!account) return;

            bot.sendMessage(GROUP_ID, 'Клиент с номером ' + account.phoneNumber + ' отправил его локацию');
            bot.sendLocation(GROUP_ID, msg.location.latitude, msg.location.longitude);
        });
    };

    send(bot, msg) {
        const bikes = [].concat(KEYBOARDS['BIKES'][0], KEYBOARDS['BIKES'][1]);
        const isBike = bikes.findIndex(name => name === msg.text);
        const isAuth = msg.hasOwnProperty('contact');
        const isLocation = msg.hasOwnProperty('location');

        if (msg.text === ACTIONS['START']) _commands['START'](bot, msg);
        if (msg.text === ACTIONS['AUTH']) _commands['AUTH'](bot, msg);
        if (msg.text === ACTIONS['CALL_TAXI']) _commands['CALL_TAXI'](bot, msg);
        if (msg.text === ACTIONS['CANCEL_TAXI']) _commands['CANCEL_TAXI'](bot, msg);
        if (msg.text === ACTIONS['RENT_BIKE']) _commands['RENT_BIKE'](bot, msg);
        if (msg.text === ACTIONS['INSTRUCTOR']) _commands['INSTRUCTOR'](bot, msg);
        if (msg.text === ACTIONS['CALL_INSTRUCTOR']) _commands['CALL_INSTRUCTOR'](bot, msg);
        if (msg.text === ACTIONS['BACK']) _commands['BACK'](bot, msg);

        if (isBike >= 0) _commands['RENT_BIKE_SENT'](bot, msg);
        if (isAuth) _commands['AUTH_THANKS'](bot, msg);

        if (isLocation) this.sendLocation(bot, msg);

        CommandStore.add(msg.chat.id, msg.text);
    }
}

module.exports = Commands;