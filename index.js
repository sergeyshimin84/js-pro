const express = require('express');
const fs = require('fs');
const path = require('path');

const port = 3001
const catalog_path = path.resolve(__dirname, '../data/catalog.json')
const cart_path = path.resolve(__dirname, '../data/cart.json')
const static_dir = path.resolve(__dirname, '../public/')

const app = express()

app.use(express.json())

app.use(express.static(static_dir))

app.get('/catalogData', (req, res) => {
  fs.readFile(catalog_path, 'utf8', (err, data) => {
    res.send(data);
  })
});

app.get('/cart', (req, res) => {
  fs.readFile(cart_path, 'utf8', (err, data) => {
    res.send(data);
  })
});

app.post('/addToCart', (req, res) => {
  fs.readFile(cart_path, 'utf8', (err, data) => {
    let cart = JSON.parse(data);

    let id = 1;

    if(cart.length > 0) {
      id = cart[cart.length - 1].id + 1;
    }

    const item = req.body;
    item.id = id

    cart.push(item);

    fs.writeFile(cart_path, JSON.stringify(cart), (err) => {
      console.log('done');
      res.end();
    });
  });
});

app.post('/removeFromCart', (req, res) => {
  fs.readFile(cart_path, 'utf8', (err, data) => {
    let cart = JSON.parse(data);

    

    const itemId = req.body.id;
    const idx = cart.findIndex((good) => good.id == itemId)

    if(idx >= 0) {
      cart = [...cart.slice(0, idx), ...cart.slice(idx + 1)]
    }

    fs.writeFile(cart_path, JSON.stringify(cart), (err) => {
      console.log('done');
      res.end();
    });
  });
});

app.listen(port, function() {
  console.log('server is running on port ' + port + '!')
})
