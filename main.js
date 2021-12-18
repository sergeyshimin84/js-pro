'use strict';

// Вводится переменная с адресом корневого каталога (основная ссылка).
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

Vue.component('search', {
  template: `
  `,
  data() {
    return {
      
    }
  }
})


// В объекте Vue находяться переменные (данные приложения).
new Vue({
  el: "#app",
  data: {
    goods: [],
    filteredGoods: [],
    cart: [],
    searchLine: '',
    isVisibleCart: false
  },
  // Набор методов.
  methods: {
    // Методом loadGoods, получаем товары с сервера. 
    // Записываем в this.goods, this.filteredGoods полученные от сервера товары.
    loadGoods(){
      fetch(`${API_URL}catalogData.json`)
        .then((request) => request.json())
        .then((data) => {
          this.goods = data;
          this.filteredGoods = data;
        })
    },
    // Методом loadCart, получаем товары в корзине. 
    // Записываем в this.cart полученные от сервера товары. 
    loadCart(){
      fetch(`${API_URL}getBasket.json`)
        .then((request) => request.json())
        .then((data) => {
          this.cart = data.contents;
        })
    },
    // Метод addToCart принимает товар и отправляет его на сервер.
    // После ответа сервера о добавлении товара, отправляем его в массив this.cart (добавляем в корзину).
    addToCart(good){
      fetch(`${API_URL}addToBasket.json`)
        .then(() => {
          this.cart.push(good)
        })
    },
    // Методом removeFromCart удаляем товары из корзины. Отправляем запрос об удалении на сервер.
    // После подтверждения удаления, удаляем товар из массива this.cart (удаляем из корзины). 
    removeFromCart(good){
      fetch(`${API_URL}deleteFromBasket.json`)
        .then(() => {
          // Проходим по всему массиву сравнивая id элементов. Находим нужный товар.
          const index = this.cart.findIndex((item) => item.id_product == good.id_product)
          // Удаляем найденый товар с определенным индексом из корзины, через splice. 
          this.cart.splice(index - 1, 1)
        })
    },
    // Метод фильтрации onSearch.
    // Берется переменная this.searchLine. С помощью регулярного выражения проверяем названя товаров.
    // Отфильтрованный массив помещаем в this.filteredGoods (найденый товар отрисован).
    onSearch() {
      const reg = new RegExp(this.searchLine, 'i')
      this.filteredGoods = this.goods.filter((good) => reg.test(good.product_name))
    },
    // Метод onToggleCart переключает модальное окно, отрисовывая его.
    onToggleCart() {
      this.isVisibleCart = !this.isVisibleCart
    }
  },
  // Запускаем this.loadGoods, this.loadCart.
  // mounted функция Vue.js (встроеная функция).
  mounted() {
    this.loadGoods();
    this.loadCart();
  }
})