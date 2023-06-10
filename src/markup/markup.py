from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def main_menu_markup():
    inline_kb = InlineKeyboardMarkup(row_width=2)
    inline_btn_1 = InlineKeyboardButton(
        'WOW', callback_data='wow'
    )

    inline_kb.add(inline_btn_1)

    return inline_kb
