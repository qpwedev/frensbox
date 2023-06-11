from aiogram import Bot, Dispatcher, types
from config import BOT_TOKEN, START_MESSAGE
from aiogram.types.web_app_info import WebAppInfo
from db.db import Database

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

db = Database('database.db')


@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    db.insert_user(message.from_user.id, message.from_user.username)

    web_app = WebAppInfo()
    web_app.url = "https://3695-62-168-58-186.ngrok-free.app"

    keyboard = types.InlineKeyboardMarkup()
    button = types.InlineKeyboardButton(
        'Run FrensBox',
        web_app=web_app
    )
    keyboard.add(button)

    await bot.send_message(message.chat.id, START_MESSAGE, reply_markup=keyboard, parse_mode='HTML')

if __name__ == '__main__':
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)
