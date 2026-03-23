# Flower landing (static)

Це статичний лендінг, який працює без збірки.

## Локально
Відкрий `index.html` у браузері або підніми локальний сервер:

```bash
python3 -m http.server 8080
```

Потім відкрий: `http://localhost:8080/`

## Деплой у веб
Оскільки це чисті файли `index.html` + `styles.css` + `script.js`, достатньо розмістити їх у корені сайту.

### Варіант 1: Netlify (найпростіше)
1. Відкрий [Netlify](https://www.netlify.com/) → **Add new site** → **Deploy manually**
2. Обери “publish directory” = поточна папка з `index.html` (тобто корінь `flower`)
3. Build command залиш порожнім
4. Натисни **Deploy**

### Варіант 2: GitHub Pages
1. Створи репозиторій
2. Запуш `index.html`, `styles.css`, `script.js` у корінь репо
3. У GitHub: **Settings → Pages** → source = гілка `main` / root

## Примітка
Сайт використовує `#anchors` (якорі) для навігації, тому додаткова конфігурація маршрутизатора не потрібна.

