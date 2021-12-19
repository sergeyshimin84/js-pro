// Прописываем константы.
// Подключаем фреймворк express.
const express = require('express');
// Подключаем библиотеку для работы с файловой системой fs (встроена в Node.js).
const fs = require('fs');
// Подключаем библиотеку path. Формирует пути файлов относительно директории проекта. 
const path = require('path');
// Порт 3001 (выделенный адрес для программы). Для локальной разработки, можно использовать любой номер порта. 
const port = 3001
// Прописываем конфиругурационные переменные. Через библиотеку path.
const catalog_path = path.resolve(__dirname, './data/catalog.json')
const cart_path = path.resolve(__dirname, './data/cart.json')
// В папке public содержится html код и js. Для возможности запускать проект с одного домена.
const static_dir = path.resolve(__dirname, './public/')
// Создаем сервер. Копируем в переменную app.
const app = express()
// Подключаем плагин. Предоставляем возможность приложению распознавать запросы json.
app.use(express.json())
// Подключаем плагин. Прдоставляем возможность отдавать статические файлы.
app.use(express.static(static_dir))
// Создаем маршрут принимающий GET запросы на ./data/catalog.json.
// Получаем список товаров.
app.get('/catalogData', (req, res) => {
  fs.readFile(catalog_path, 'utf8', (err, data) => {
    res.send(data);
  })
});
// Получаем список товаров в корзине.
app.get('/cart', (req, res) => {
  fs.readFile(cart_path, 'utf8', (err, data) => {
    res.send(data);
  })
});
// Создаем маршрут принимающий GET запросы на ./data/cart.json.
// Получаем список товаров в корзине.
app.post('/addToCart', (req, res) => {
  fs.readFile(cart_path, 'utf8', (err, data) => {
    // Переводим строку в массив.
    let cart = JSON.parse(data);
    // Создаем новый id
    let id = 1;
    // Каждому новому товару в корзине присваеваем новый id. Во избежании повторений.
    if(cart.length > 0) {
      id = cart[cart.length - 1].id + 1;
    }
    // Помещаем данные из запроса. Помещаем в переменную item.
    const item = req.body;
    item.id = id
    // Добавляем полученные товары в массив item.
    cart.push(item);
    // Генерируем строку из массива, методом .stringify и записываем ее в /data/cart.json с помощью метода .writeFile.
    fs.writeFile(cart_path, JSON.stringify(cart), (err) => {
      // Выводим в консоль значение done.
      console.log('done');
      // Отправляем ответ пользователю.
      res.end();
    });
  });
});
// Удаляем товары из корзины. Читаем файл ./data/cart.json, приобразовываем данные в массив. 
app.post('/removeFromCart', (req, res) => {
  fs.readFile(cart_path, 'utf8', (err, data) => {
    let cart = JSON.parse(data);
    // Получаем файл который требуется удалить. Получаем его id. 
    const itemId = req.body.id;
    // Методом .findIndex находим id удаляемого элемента (проверка).
    const idx = cart.findIndex((good) => good.id == itemId)
    // Проверка. Найден ли элемент. В случае если элемент не найден, вернется -1.
    if(idx >= 0) {
      // Создаем новый массив, с помощью спред оператора. Метод .slice возвращает кусок массива с нулевого id, до конечного.
      cart = [...cart.slice(0, idx), ...cart.slice(idx + 1)]
    }
    // Генерируем строку из массива, методом .stringify и записываем ее в /data/cart.json с помощью метода .writeFile.
    fs.writeFile(cart_path, JSON.stringify(cart), (err) => {
      // Выводим в консоль значение done.
      console.log('done');
      // Отправляем ответ пользователю.
      res.end();
    });
  });
});
// Запускаем сервер на определенном порту.
app.listen(port, function() {
  console.log('server is running on port ' + port + '!')
})
