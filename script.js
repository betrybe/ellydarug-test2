// Criando o Array do Carrinho de Compras
let cartArray = [];

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
            })
            .catch((error) => {
                console.log('ERRO ' + error);
            });
    });
    section.appendChild(botaoAdd);
    return section;
}

function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
    // coloque seu código aqui
    // isto removeu o elemento do carrinho
    this.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
}

window.onload = () => {
    // fazendo a chamada da função load Products
    loadProducts();
};
