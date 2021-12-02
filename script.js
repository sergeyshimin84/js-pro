'use strict'

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
    this.goods = [];
    this.filtred = [];
    this._cart = cart;
    this._el = document.querySelector('.goods-list')
    this._el.addEventListener('click', this._onClick.bind(this))
  }

  filter(searchString) {
    searchString = searchString.trim()

    if (searchString.length === 0) {
      this.filtred = this.goods;
      this.render()
      return
    }

    const reg = new RegExp(searchString, 'i');
    this.filtred = this.goods.filter((good) => reg.test(good.title))
    this.render()
  }

  fetchGoods() {
    fetch(`${API_URL}catalogData.json`)
      .then((response) => {
        return response.json();
      })
      .then((request) => {
        this.goods = request.map(good => ({ title: good.product_name, price: good.price, id: good.id_product }))
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
    let listHtml = '';
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
    this._list = [];
    this._btn = document.querySelector('.cart-button')
    this._el = document.querySelector('.cart')
    this._btn.addEventListener('click', this._onToggleCart.bind(this))
    this._el.addEventListener('click', this._onClick.bind(this))
  }

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

  _onToggleCart() {
    this._el.classList.toggle('active');
  }

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

  load() {
    fetch(`${API_URL}getBasket.json`)
      .then((response) => {
        return response.json()
      })
      .then((goods) => {
        this._list = goods.contents.map(good => ({ title: good.product_name, price: good.price, id: good.id_product }))
        this.render()
      })
  }

}

const cart = new Cart();
const list = new GoodsList(cart);
$searchBtn.addEventListener('click', () => {
  list.filter($searchInput.value);
})

document.querySelector('.goods-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('goods-item')) {
    const id = e.target.getAttribute('data-id');
    console.log(id);
  }
})