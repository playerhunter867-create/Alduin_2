ALDUIN X — LIVE2D RESILIENT BUILD

Что исправлено:
- Live2D больше не зависит от одного CDN.
- runtime-loader.js автоматически пробует Fastly jsDelivr, UNPKG и jsDelivr.
- Cubism Core сначала берётся с официального Live2D URL, затем из резервных CDN.
- Используется cubism4.min.js, потому что он нужен для Cubism 3/4 и легче полного index bundle.
- JSZip тоже имеет резервные источники.
- Остальная часть сайта не зависит от успешной загрузки Live2D runtime.
- ZIP модели распаковывается в браузере; папка models в GitHub Pages не нужна.

Важно:
Live2D Cubism Core является отдельным runtime Live2D. Эта сборка НЕ подменяет его самодельной библиотекой. Если конкретная сеть блокирует все источники runtime, Live2D не сможет работать, но сам сайт и AI продолжат работать.

Для GitHub Pages:
1. Распакуй архив.
2. Загрузи ВСЕ файлы в корень репозитория.
3. Не переименовывай runtime-loader.js.
4. После публикации сделай полную перезагрузку страницы, чтобы старый Service Worker не держал старую версию.

Поддержка загрузки пользовательской модели:
- ZIP с .model3.json + .moc3 + textures + motions/expressions/physics.
- Вложенные папки внутри ZIP разрешены.
- Сайт автоматически ищет .model3.json и переписывает ссылки на Blob URL.
- Для Cubism 3/4 моделей папка models на GitHub не требуется.


MOBILE MULTI-MODEL UPDATE: added built-in Miku Sample and Miku Free. Model files are flat in site root so no model folders are required. Mobile AI dock is compact/collapsed by default and expands only when tapped.
