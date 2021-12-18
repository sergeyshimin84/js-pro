'use strict';

// Вводится переменная с адресом корневого каталога (основная ссылка).
const API_URL = 'http://127.0.0.1:3001/'

// 
// @click - сокращенная запись v-on:click.
Vue.component('good-card', {
  template: `
    <div class="good-card" @click="onClick">
      <h2>{{ data.title }}</h2>
      <p>$ {{ data.price }}</p>
    </div>
  `,
  props: ['data'],
  methods: {
    onClick() {
      fetch(`${API_URL}addToCart`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/JSON'
        },
        body: JSON.stringify(this.data)
      })
        .then(() => {
          this.$emit('add', this.data)
        })
    }
  }
})

Vue.component('goods-list', {
  template: `
    <div class="goods-list">
      <good-card 
        v-for="good of list" 
        v-bind:key="good.id_product"
        v-bind:data="good"
        v-on:add="onAdd"
      ></good-card>
    </div>
  `,
  props: ['list'],
  methods: {
    onAdd(good) {
      this.$emit('add', good)
    }
  }
})

Vue.component('search', {
  template: `
    <div class="search">
      <input type="text" v-model="searchString" class="goods-search" />
      <button class="search-button" type="button" v-on:click="onClick">Искать</button>
    </div>
  `,
  data() {
    return {
      searchString: ''
    }
  },  
  methods: {
    onClick(){
      this.$emit('search', this.searchString)
    }
  }
})

Vue.component('cart-item', {
  template: `
    <div class="good-card">
      <h2>{{ data.title }}</h2>
      <p>$ {{ data.price }}</p>
      <button v-on:click="onClick">Удалить</button>
    </div>
  `,
  props: ['data'],
  methods: {
    onClick() {
      fetch(`${API_URL}removeFromCart`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/JSON'
        },
        body: JSON.stringify(this.data)
      })
        .then(() => {
          this.$emit('delete', this.data)
        })
    }
  }
})

Vue.component('cart', {
  template: `
    <div class="modal">
      <cart-item 
          v-for="good of list" 
          v-bind:key="good.id_product"
          v-bind:data="good"
          v-on:delete="onDelete"
        ></cart-item>
        <button v-on:click="onClose">Закрыть</button>
    </div>
  `,
  props: ['list'],
  methods: {
    onDelete(good) {
      this.$emit('delete', good)
    },
    onClose(){
      this.$emit('close')
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
    // Берется переменная this.searchString. С помощью регулярного выражения проверяем названя товаров.
    // Отфильтрованный массив помещаем в this.filteredGoods (найденый товар отрисован).
    onSearch() {
      const regex = new RegExp(this.searchString, 'i')
      this.filteredGoods = this.goods.filter((good) => regex.test(good.title))
    },
    // Метод onAdd добавляет товары.
    onAdd(good) {
      this.cart.push(good)
    },
    // Метод onDelete удаляет товары из корзины.
    onDelete(good){
      const idx = this.cart.findIndex((item) => item.id === good.id)
      if(idx >= 0) {
        this.cart = [...this.cart.slice(0, idx), ...this.cart.slice(idx + 1)]
      }
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