'use strict'
// Находим input и button (DOM-элементы).
const $searchInput = document.querySelector('.goods-search');
const $searchBtn = document.querySelector('.search-button');

class GoodsItem {
  constructor(title, price, id) {
    this.title = title;
    this.price = price;
    this.id = id;
  }

  render() {
    return `<div data-id="${this.id}" class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
  }
}

class GoodsList {
  constructor(cart) {
    // В goods записываем товары при получении их с сервера
    this.goods = [];
    // Заводим массив filtred (копия массива goods), для того чтобы не отсикать некоторые товары из goods (чтобы не трокать основной массив goods, который является резервной коприей)
    this.filtred = [];
    this._cart = cart;
    this._el = document.querySelector('.goods-list')
    this._el.addEventListener('click', this._onClick.bind(this))
  }
// filter - метод поиска.
  filter(searchString) {
    // Убираем лишние символы с помощью метода trim.
    searchString = searchString.trim()
    // Если длина внесеных пользователем данных равна нулю, то возвращаем renser, перрерисовываем страницу (востанавливаем из резервной копии массива goods все значения)
    if (searchString.length === 0) {
      this.filtred = this.goods;
      this.render()
      return
    }
    // Поисковую строку переводим в решулярное выражение. Передаем "флаг" "i" чтобы не учитвать регистр
    const reg = new RegExp(searchString, 'i');
    // Записываем найденый товар в filter и перерисовываем карточки вызывая render.
    this.filtred = this.goods.filter((good) => reg.test(good.title))
    this.render()
  }

  fetchGoods() {
    fetch(`${API_URL}catalogData.json`)
      .then((response) => {
        return response.json();
      })
      .then((request) => {
        this.goods = request.map(good => ({ title: good.product_name, price: good.price, id: good.id_product}))
        this.filtred = this.goods;
        this.render();
      })
      .catch((err) => {
        console.log(err.text)
      })
  }

  _onClick(e) {
    const id = e.target.getAttribute('data-id');
    console.log(id)
    if (id) {
      fetch(`${API_URL}addToBasket.json`)
        .then(() => {
          console.log(id, this.goods)
          this._cart.add(this.goods.find((good) => good.id == id))
        })
    }
  }

  render() {
    // Сначала очищаем контейнер.
    let listHtml = '';
    // Перебираем массчив goods с помощью метода forEach.
    this.goods.forEach(good => {
      const goodItem = new GoodsItem(good.title, good.price, good.id);
      console.log(goodItem)
      listHtml += goodItem.render();
    });
    this._el.innerHTML = listHtml;
  }

  sumGoods() {
    let sumGood = 0;
    this.goods.forEach(sum => {
      const sumItem = new GoodsItem(sum.price);
      sumGood += sumItem.sumGoods();
    });
  }

}

const list = new GoodsList();
list.fetchGoods();
list.render();
list.sumGoods();

class CartItem extends GoodsItem {
  constructor(title, price, id) {
    super(title, price, id)
  }
}

class Cart {
  constructor() {
    // Массив товаров.
    this._list = [];
    // Отдельная переманная для модального окна.
    this._btn = document.querySelector('.cart-button')
    // Отдельная переменная на элемент модального окна.
    this._el = document.querySelector('.cart')
    // Обрабоботчики событий.
    this._btn.addEventListener('click', this._onToggleCart.bind(this))
    this._el.addEventListener('click', this._onClick.bind(this))
  }
  // Добавляет товар в корзину.
  add(good) {
    this._list.push(good)
    console.log(good)
    this.render()
  }

  _onClick(e) {
    const id = e.target.getAttribute('data-id');
    fetch(`${API_URL}deleteFromBasket.json`)
      .then(() => {
        const index = this._list.findIndex((good) => good.id == id)
        this.list.splice(index, 1)
        this.render()
      })
  }
  // При нажатии на кнопку меняет класс "active" что-бы скрытьего.
  _onToggleCart() {
    this._el.classList.toggle('active');
  }
  // Отрисовывает корзину.
  render() {
    let listHtml = '';
    this._list.forEach(good => {
      console.log(good)
      const goodItem = new CartItem(good.title, good.price, good.id);
      console.log(goodItem)
      listHtml += goodItem.render();
    });
    this._el.innerHTML = listHtml;
  }
  // Загружает с сервера товары в корзину.
  load() {
    fetch(`${API_URL}getBasket.json`)
      .then((response) => {
        return response.json()
      })
      .then((goods) => {
        this._list = goods.contents.map(good => ({ title: good.product_name, price: good.price, id: good.id_product}))
        this.render()
      })
  }

}

const cart = new Cart();
const list = new GoodsList(cart);
// При клике на кнопку поиска с помощью обработчика list.filter передается значение которое было в input.
$searchBtn.addEventListener('click', () => {
  list.filter($searchInput.value);
})

document.querySelector('.goods-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('goods-item')) {
    const id = e.target.getAttribute('data-id');
    console.log(id);
  }
})

list.fetchGoods();
cart.load();