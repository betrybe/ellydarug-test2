// Criando o Array do Carrinho de Compras
let cartArray = [];
let cartTotalPrice = 0;

// Cria uma listagem dos produtos através da requisição fetch do endpoint da api
function loadProducts() {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    fetch(url)
        .then((body) => body.json())
        .then((data) => {
            const products = data.results;
            products.forEach((item) => {
                const product = {
                    sku: item.id,
                    name: item.title,
                    image: item.thumbnail,
                };
                document.querySelector('.items').append(createProductItemElement(product));
            });
        })
        .catch((error) => {
            console.log('ERRO ' + error);
        });
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
        fetch(`${URL}`)
            .then((body) => body.json())
            .then((data) => {
                const item = {
                    sku: data.id,
                    name: data.title,
                    salePrice: data.price,
                };
                // passando para o cartArray
                cartArray.push(item);
                return item;
            })
            .then((item) => {
                document.querySelector('.cart__items').append(createCartItemElement(item));
                // adiciona o item clicado ao localStorage
                localStorage.setItem('cart__items', JSON.stringify(cartArray));
                setCartTotalPrice();
            })
            .catch((error) => {
                console.log('ERRO ' + error);
            });
    });
    section.appendChild(botaoAdd);
    return section;
}

// função que atualiza e escreve o preco total no carrinho
function setCartTotalPrice() {
    cartTotalPrice = 0;
    cartArray.forEach((x) => {
        return (cartTotalPrice += x.salePrice);
    });
    document.querySelector('.total-price').innerHTML = `Preço total: <strong>$${parseFloat(cartTotalPrice.toFixed(2))}</strong>`;
}

function loadCart() {
    const localCartRaw = localStorage.getItem('cart__items');
    const localCart = JSON.parse(localCartRaw);

    // Verifica se localCart não é Null
    if (localCart) {
        cartArray = localCart;
        cartArray.forEach((product) => {
            document.querySelector('.cart__items').append(createCartItemElement(product));
        });
    }
}

function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
    //recuperando o meu SKU
    const productSku = event.target.children[0].className;
    const productIndex = cartArray.findIndex((x) => {
        return x.sku === productSku;
    });
    cartArray.splice(productIndex, 1);
    //atualizando o Array
    localStorage.setItem('cart__items', JSON.stringify(cartArray));
    // isto removeu o elemento do carrinho
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

window.onload = () => {
    loadProducts();
    loadCart();

    const section = document.querySelector('.cart');
    const span = document.createElement('span');
    span.className = 'total-price';
    section.appendChild(span);

    document.querySelector('.empty-cart').addEventListener('click', () => {
        cartArray = [];
        document.querySelector('.total-price').innerHTML = 'Preço total: <strong>$0</strong>';
        document.querySelector('.cart__items').innerHTML = '';
        localStorage.setItem('cart__items', JSON.stringify(cartArray));
    });
    setCartTotalPrice();
};
