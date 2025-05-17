// Variables globales
let total = [];
let contador = 0;
const show = document.querySelector('.costRange');
const rango = document.querySelector('.form-range');
const btnCart = document.querySelector('.shopCar');
const costCard = document.querySelector('.costCard');
const showCart = document.querySelector('.shopCarbox');
const containerCart = document.getElementById('containerCart');
const fragment = document.createDocumentFragment();
const store = document.querySelector('.productsList');
let titleAdop = document.querySelector('.titleAdop');
const adop = document.querySelectorAll('.carouselElement');
const notify = document.getElementById('notify');
const CarouselMovement = document.getElementById('CarouselMovement');
const costNumber = document.querySelector('.costNumber');
let cartPortable = document.querySelector('.cartPortable');
let btnsFloat = [btnCart, cartPortable];

// Mostrar/ocultar carrito con GSAP
btnsFloat.forEach(btn => {
  btn.addEventListener('click', () => {
    if (showCart.style.display === 'flex') {
      gsap.to(showCart, {
        right: -500,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => (showCart.style.display = 'none')
      });
    } else {
      gsap.to(showCart, {
        onStart: () => (showCart.style.display = 'flex'),
        right: '1.2rem',
        duration: 0.3,
        delay: 0.3
      });
    }
  });
});

let observer = new IntersectionObserver(validarVisibilidad, {});
observer.observe(btnCart);

// Filtro de rango
rango.addEventListener('input', e => {
  let dinero = e.target.value;
  show.textContent = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(dinero);
});

class ItemCart {
  constructor(imgProduct, nomProduct, sendProduct, costProduct) {
    this.img = imgProduct;
    this.nom = nomProduct;
    this.send = sendProduct;
    this.cost = costProduct;
  }
}

class ArticleCart {
  constructor(img, descrip, cost) {
    this.img = img;
    this.descrip = descrip;
    this.cost = cost;
  }
}

fetch('./elementosTienda.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const producto = new ItemCart(item.img, item.nombre, item.envio_gratis, item.precio);
      createHtml(producto);
    });
    store.appendChild(fragment);

    document.querySelectorAll('.agg').forEach(button => {
      button.addEventListener('click', e => {
        const parent = e.target.parentElement;
        const info = parent.children[1];
        const product = new ArticleCart(
          parent.children[0].src,
          info.children[0].textContent,
          parseInt(parent.getAttribute('data-cost'))
        );
        validarArticulos(product);
      });
    });
  });

function actualizarTotal() {
  const elements = containerCart.querySelectorAll('.boxElement');
  let nuevoTotal = Array.from(elements).reduce((acc, el) => {
    return acc + parseInt(el.getAttribute('data-Newcost'));
  }, 0);

  contador = nuevoTotal;
  costNumber.textContent = contador;
  costCard.textContent = elements.length;
}

function validarArticulos(newElement) {
  let existe = false;
  document.querySelectorAll('.boxElement').forEach(cartItem => {
    if (cartItem.getAttribute('data-name') === newElement.descrip) {
      let cantidad = cartItem.querySelector('.cantidad');
      let nuevaCantidad = parseInt(cantidad.textContent) + 1;
      cantidad.textContent = nuevaCantidad;

      let nuevoCosto = nuevaCantidad * newElement.cost;
      cartItem.setAttribute('data-Newcost', nuevoCosto);
      cartItem.querySelector('.costElement').textContent = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }).format(nuevoCosto);

      existe = true;
    }
  });

  if (!existe) {
    createdElementCart(newElement);
  }
  actualizarTotal();
}

function createHtml(product) {
  let card = document.createElement('div');
  card.classList.add('elementStore');
  card.setAttribute('data-cost', product.cost);
  card.innerHTML = `
    <img src="${product.img}" class="photoElementStore" alt="">
    <div class="infoProductStore">
      <p class="titleProductStore">${product.nom}</p>
      <p class="send text-success">${product.send ? 'Envio Gratis' : 'Costo por envio'}</p>
      <span class="costStoreElement">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.cost)}</span>
    </div>
    <button class="btn btn-primary w-50 agg">agregar</button>`;
  fragment.appendChild(card);
}

function createdElementCart(product) {
  const element = document.createElement('div');
  element.classList.add('boxElement');
  element.setAttribute('data-cost', product.cost);
  element.setAttribute('data-Newcost', product.cost);
  element.setAttribute('data-name', product.descrip);

  element.innerHTML = `
    <img src="${product.img}" alt="">
    <div class="datosElement">
      <p class="nomProduct">${product.descrip}</p>
      <p class="cantidad">1</p>
      <p class="costElement text-success">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.cost)}</p>
    </div>
    <i class="delete fa-solid fa-x"></i>`;

  containerCart.appendChild(element);

  element.querySelector('.delete').addEventListener('click', () => {
    element.remove();
    actualizarTotal();
  });
}

// Animaciones GSAP

gsap.to(CarouselMovement, {
  x: '-40%',
  duration: 10,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
});

gsap.to(titleAdop, {
  x: 20,
  duration: 0.5,
  repeat: -1,
  ease: 'power1.inOut',
  yoyo: true
});

function validarVisibilidad(entries) {
  const entry = entries[0];
  if (entry.isIntersecting) {
    gsap.to(cartPortable, {
      right: '-50rem',
      duration: 0.5,
      ease: 'power1.out',
      onComplete: () => (cartPortable.style.display = 'none')
    });
  } else {
    gsap.to(cartPortable, {
      onStart: () => (cartPortable.style.display = 'flex'),
      right: '1rem',
      duration: 0.5,
      ease: 'power1.out'
    });
  }
}
