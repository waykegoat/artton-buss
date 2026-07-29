# Art Ton

Многостраничный сайт Art Ton для услуг в Заречном, Пензе и Пензенской области.

## Стек

- Vue 3.5, Composition API, TypeScript strict
- Vite 8, Vite SSG, Vue Router
- Pinia, vue-i18n, Unhead
- Vitest, ESLint flat config, Prettier
- Worker API, SQL-хранилище и объектное хранилище медиа

## Локальная разработка

```bash
npm ci
npm run dev
npm run check
npm run build
```

## Демо на GitHub Pages

Ветка `main` автоматически проверяется, собирается и публикуется через GitHub Actions.
Для ручной проверки сборки из подпапки репозитория:

```bash
$env:VITE_BASE_PATH="/artton-buss/"
$env:VITE_DEMO_MODE="true"
$env:VITE_SITE_URL="https://waykegoat.github.io/artton-buss"
npm run build:pages
```

GitHub Pages обслуживает только публичную демо-версию. Отправка заявок и вход в админку
подключаются после размещения Worker API и хранилищ. Все четыре публичные страницы имеют
собственный статический HTML и работают по прямым ссылкам.

## Серверная часть

Worker API реализует:

- отдельную авторизацию администратора с защищённой cookie-сессией;
- хранение и статусы заявок;
- редактируемые факты и цены;
- загрузку изображений портфолио;
- уведомления о новых заявках в Telegram;
- ограничение частоты запросов, аудит действий и антиспам-проверки.

Начальная SQL-миграция находится в `migrations/0000_initial.sql`. Для рабочей версии
статические страницы и Worker API размещаются на одном домене совместимой edge-платформы:
это сохраняет безопасную cookie-сессию админки и защиту запросов по origin.

## Защищённые настройки

Скопируйте `.env.example` в локальный `.env` и заполните значения. `.env` исключён из Git.

- `ADMIN_USERNAME` — отдельный логин администратора;
- `ADMIN_PASSWORD_HASH` — PBKDF2-хеш, создаётся командой `npm run password:hash`;
- `SESSION_SECRET` — длинная случайная строка для подписи сессий;
- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота;
- `TELEGRAM_CHAT_ID` — идентификатор чата для заявок.

Пароль, токен Telegram и секрет сессии нельзя добавлять в исходный код или публичный
репозиторий.
