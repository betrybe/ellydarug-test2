//1 - Crie uma listagem de produtos
// fazendo uma requisição fetch do endpoint da api
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
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    return section;
}

function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
    // coloque seu código aqui
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
