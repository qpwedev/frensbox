from aiogram import Bot, Dispatcher, types
from config import BOT_TOKEN
from aiogram.types.web_app_info import WebAppInfo

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)


@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):

    web_app = WebAppInfo()
    web_app.url = "https://example.com"

    keyboard = types.InlineKeyboardMarkup()
    button = types.InlineKeyboardButton(
        'Run FrensBox', web_app=web_app)
    keyboard.add(button)
    await bot.send_message(message.chat.id,  "<i>Seeking to maintain meaningful connections</i>?\n\nMeet <b>@FrensBoxBot</b>, your Telegram companion for sustaining genuine relationships.\n\nClick the <b>Run FrensBox</b> button, and let's bring back the charm of real conversations together 💖📦", reply_markup=keyboard, parse_mode='HTML')

if __name__ == '__main__':
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)
