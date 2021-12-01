'use strict'

// const goods = [
//     { title: 'Shirt', price: 150 },
//     { title: 'Socks', price: 50 },
//     { title: 'Jacket', price: 350 },
//     { title: 'Shoes', price: 250 },
// ];

// const $goodsList = document.querySelector('.goods-list');

// const renderGoodsItem = ({ title, price }) => {
//     return `<div class='goods-item'><h3>${title}</h3><p>${price}</p></div>`;
// };

// const renderGoodsList = (list = goods) => {
//     let goodsList = list.map(
//         (item) => {
//             return renderGoodsItem(item)
//         }
//     ).join('');

//     $goodsList.insertAdjacentHTML('beforeend', goodsList);
// }

// renderGoodsList();

class GoodsItem {
    constructor(title, price) {
      this.title = title;
      this.price = price;
    }

    render() {
      return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
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
      
      if(searchString.length === 0) {
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
        this.goods = request.map(good => ({title: good.product_name, price: good.price}))
        this.render();
      })
      .catch((err) => { 
        console.log(err.text)
      })
    }

    _onClick(e) {
      const id = e.target.getAttribute('data-id');
      console.log(id)
      if(id) {
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
          const goodItem = new GoodsItem(good.title, good.price);
          listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
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

class GoodsCart {

}

class GoodsCartList {

}