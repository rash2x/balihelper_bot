require('./configs/db');
require('dotenv').load();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.telegramToken ? process.env.telegramToken : '618660015:AAE6Kll-1niJgZwWsPnsqVgi8VGw194pV6Y';
const bot = new TelegramBot(token, {polling: true});

let Commands = require('./commands');
Commands = new Commands;

bot.on('message', (msg) => {
    Commands.send(bot, msg);
});

return true;