/**
 * Один раз выставляет кнопку меню бота в Telegram (открытие Mini App).
 * Токен и URL не храните в репозитории.
 *
 * Запуск (подставь свой токен и URL выложенного Mini App):
 *   set TELEGRAM_BOT_TOKEN=123:ABC...
 *   set MINI_APP_URL=https://YOUR_USERNAME.github.io/tama/telegram-mini-app.html
 *   node scripts/set-telegram-menu.js
 *
 * Или создай .env с TELEGRAM_BOT_TOKEN и MINI_APP_URL и загружай через dotenv (опционально).
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.env.MINI_APP_URL;

if (!token || !url) {
  console.error('Нужны переменные: TELEGRAM_BOT_TOKEN и MINI_APP_URL');
  process.exit(1);
}

const api = `https://api.telegram.org/bot${token}/setChatMenuButton`;

async function main() {
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      menu_button: {
        type: 'web_app',
        text: 'Открыть',
        web_app: { url },
      },
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error('Ошибка Telegram API:', data);
    process.exit(1);
  }
  console.log('Кнопка меню бота установлена. URL Mini App:', url);
}

main();
