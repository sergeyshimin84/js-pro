'use strict';

// Адрес локального сервера (127.0.0.1).
const API_URL = 'http://127.0.0.1:3001/'
// Компоненты.
// Компонент good-card.
// Принимаем значения title и price.
// @click - сокращенная запись v-on:click.
Vue.component('good-card', {
  template: `
    <div class="good-card" @click="onClick">
      <h2>{{ data.title }}</h2>
      <p>$ {{ data.price }}</p>
    </div>
  `,
  // Принимаем данные для title и price.
  props: ['data'],
  methods: {
    onClick() {
      // После клика, отправляется запрос API_URL, метод .addToCart.  
      fetch(`${API_URL}addToCart`, {
        method: "POST",
        // Устанавливаем заголовок. Даем понять серверу что отправляем данные в json формате.
        headers: {
          'Content-Type': 'application/JSON'
        },
        // В тело запроса отправляем json строку. Для добавление в корзину.
        body: JSON.stringify(this.data)
      })
        // После получения ответа. Генерируем событие. Передаем добавляемый объект.
        .then(() => {
          this.$emit('add', this.data)
        })
    }
  }
})
// Компонент goods-list. Вызывает компонент good-card. 
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
    // Метод onAdd принимает товар добавляемый товар good. Пробрасывает событие. 
    onAdd(good) {
      this.$emit('add', good)
    }
  }
})
// Компонент search. Поиск.
Vue.component('search', {
  template: `
    <div class="search">
      <input type="text" v-model="searchString" class="goods-search" />
      <button class="search-button" type="button" v-on:click="onClick">Искать</button>
    </div>
  `,
  // Возвращает строку.
  data() {
    return {
      searchString: ''
    }
  },  
  methods: {
    // Метод onClick привязан на событие клик кнопки "Искать".
    onClick(){
      // Генерирует событие и передает содержимое в searchString.
      this.$emit('search', this.searchString)
    }
  }
})
// Компонент cart-item. Корзина.
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
      // Отправляет запрос на removeFromCart.
      fetch(`${API_URL}removeFromCart`, {
        method: "POST",
        // Устанавливаем заголовок. Даем понять серверу что отправляем данные в json формате.
        headers: {
          'Content-Type': 'application/JSON'
        },
        // В тело запроса отправляем json строку. Для добавление в корзину.
        body: JSON.stringify(this.data)
      })
        // После получения ответа. Генерируем событие. Передаем удаляемый объект.
        .then(() => {
          this.$emit('delete', this.data)
        })
    }
  }
})
// Компонент cart. Корзина.
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
    // Метод onDelete принимает товар добавляемый товар good. Пробрасывает событие. 
    onDelete(good) {
      this.$emit('delete', good)
    },
    // Метод onClose, закрывает корзину. 
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
      fetch(`${API_URL}cart`)
        .then((request) => request.json())
        .then((data) => {
          this.cart = data;
        })
    },
    // Метод фильтрации onSearch.
    // Берется переменная this.searchString. С помощью регулярного выражения проверяем названя товаров.
    // Отфильтрованный массив помещаем в this.filteredGoods (найденый товар отрисован).
    onSearch(searchString) {
      console.log(searchString)
      const regex = new RegExp(this.searchString, 'i')
      this.filteredGoods = this.goods.filter((good) => regex.test(good.title))
    },
    // Метод onAdd. Принимает добавленный товар good и передает его в cart.
    onAdd(good) {
      this.cart.push(good)
    },
    // Метод onDelete удаляет товары из корзины.
    onDelete(good){
      // Методом .findIndex находим id удаляемого элемента (проверка).
      const idx = this.cart.findIndex((item) => item.id === good.id)
      // Проверка. Найден ли элемент. В случае если элемент не найден, вернется -1.
      if(idx >= 0) {
        // Создаем новый массив, с помощью спред оператора. Метод .slice возвращает кусок массива с нулевого id, до конечного.
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