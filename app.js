const TelegramBot = require('node-telegram-bot-api');
const ACTIONS = require('./actions');
const KEYBOARDS = require('./keyboards');
const MESSAGES = require('./messages');
const CommandStore = require('./commandStore');
const Accounts = require('./accounts.js');

let Commands = require('./commands');
Commands = new Commands;

const token = '618660015:AAE6Kll-1niJgZwWsPnsqVgi8VGw194pV6Y';
const bot = new TelegramBot(token, {polling: true});

// db instance connection
require("./configs/db");

bot.onText(new RegExp(ACTIONS['START']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    Accounts.check(msg).then(status => {
        if(status) {
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

});

bot.onText(new RegExp(ACTIONS['AUTH']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    bot.sendMessage(msg.chat.id, MESSAGES['AUTH'], {
        'reply_markup': {
            keyboard: KEYBOARDS['START']
        }
    });
});

bot.onText(new RegExp(ACTIONS['CALL_TAXI']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    bot.sendMessage(msg.chat.id, MESSAGES['CHAT_TAXI'], {
        'reply_markup': {
            keyboard: KEYBOARDS['TAXI']
        }
    });
});

bot.onText(new RegExp(ACTIONS['CANCEL_TAXI']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    bot.sendMessage(msg.chat.id, MESSAGES['CANCEL_TAXI'], {
        'reply_markup': {
            keyboard: KEYBOARDS['START']
        }
    });
});

bot.onText(new RegExp(ACTIONS['RENT_BIKE']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    bot.sendMessage(msg.chat.id, MESSAGES['RENT_BIKE'], {
        'reply_markup': {
            keyboard: KEYBOARDS['BIKES']
        }
    });
});

bot.onText(new RegExp(ACTIONS['INSTRUCTOR']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    bot.sendMessage(msg.chat.id, MESSAGES['INSTRUCTOR'], {
        'reply_markup': {
            keyboard: KEYBOARDS['INSTRUCTOR']
        }
    });
});

bot.onText(new RegExp(ACTIONS['BACK']), (msg) => {
    CommandStore.add(msg.chat.id, msg.text);

    bot.sendMessage(msg.chat.id, 'Возвращаем обратно', {
        'reply_markup': {
            keyboard: KEYBOARDS['START']
        }
    });
});

bot.on('message', (msg) => {
    Commands.send(bot, msg);
});