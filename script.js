let cartArray = [];
let cartTotal = 0;

const classCartItems = '.cart__items';

function setCartTotalPrice() {
  cartTotal = 0;
  const classTotalPrice = document.querySelector('.total-price');
  cartArray.forEach((x) => { (cartTotal += x.salePrice); });
  classTotalPrice.innerHTML = `Preço total: $${parseFloat(cartTotal.toFixed(2))}`;
}

function cartItemClickListener(event) {
  const productSku = event.target.children[0].className;
  const productIndex = cartArray.findIndex((x) => x.sku === productSku);
  cartArray.splice(productIndex, 1);
  localStorage.setItem(classCartItems, JSON.stringify(cartArray));
  this.remove();
  setCartTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const span = document.createElement('span');

  li.className = 'cart__item';
  span.className = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.appendChild(span);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botaoAdd.addEventListener('click', () => {
    const URL = `https://api.mercadolibre.com/items/${sku}`;
    fetch(`${URL}`).then((body) => body.json()).then((data) => {
        const item = { sku: data.id, name: data.title, salePrice: data.price };
        cartArray.push(item);
        return item;
      }).then((item) => {
        document.querySelector(classCartItems).append(createCartItemElement(item));
        localStorage.setItem(classCartItems, JSON.stringify(cartArray));
        setCartTotalPrice();
      })
      .catch((error) => {
        console.log('Erro ', error.message);
      });
  });
  section.appendChild(botaoAdd);
  return section;
}

function loadProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  document.querySelector('.items').append(loading);
  fetch(url)
    .then((body) => body.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      const products = data.results;
      products.forEach((item) => {
        const product = { sku: item.id, name: item.title, image: item.thumbnail };
        document.querySelector('.items').append(createProductItemElement(product));
      });
    })
    .catch((error) => {
      console.log('Erro ', error.message);
    });
}

function loadCart() {
  const localCartRaw = localStorage.getItem('cart__items');
  const localCart = JSON.parse(localCartRaw);
  if (localCart) {
    cartArray = localCart;
    cartArray.forEach((product) => {
      document.querySelector(classCartItems).append(createCartItemElement(product));
    });
  }
}

function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  loadProducts();
  loadCart();

  const section = document.querySelector('.cart');
  const span = document.createElement('span');
  span.className = 'total-price';
  section.appendChild(span);

  document.querySelector('.empty-cart').addEventListener('click', () => {
    cartArray = [];
    const classTotalPrice = document.querySelector('.total-price');
    classTotalPrice.innerHTML = 'Preço total: $0';
    document.querySelector(classCartItems).innerHTML = '';
    localStorage.setItem(classCartItems, JSON.stringify(cartArray));
  });
  setCartTotalPrice();
};