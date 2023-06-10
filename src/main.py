import hashlib
import logging

from aiogram import Bot, types
from aiogram.dispatcher import Dispatcher
from aiogram.utils import executor
from aiogram.types import (
    InlineQuery,
    CallbackQuery,
    InputTextMessageContent,
    InlineQueryResultArticle
)

from markup.markup import main_menu_markup

from config import API_TOKEN
from text.constants import MAIN_MENU_TEXT

logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)


@dp.inline_handler()
async def inline_echo(inline_query: InlineQuery):
    text = inline_query.query or 'echo'
    input_content = InputTextMessageContent(text)
    result_id: str = hashlib.md5(text.encode()).hexdigest()
    item = InlineQueryResultArticle(
        id=result_id,
        title=f'Result {text!r}',
        input_message_content=input_content,
    )

    await bot.answer_inline_query(inline_query.id, results=[item], cache_time=1)


@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
    await bot.send_message(message.chat.id, MAIN_MENU_TEXT, reply_markup=main_menu_markup())


@dp.callback_query_handler(lambda c: c.data == 'wow')
async def process_callback_menu(callback_query: CallbackQuery):
    await bot.answer_callback_query(callback_query.id)
    await bot.send_message(callback_query.from_user.id, 'You pressed the wow button.')


if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
