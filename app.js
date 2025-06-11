// Variables globales
let total = [];
let contador = 0;
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
let observer = new IntersectionObserver(validarVisibilidad, {}); /*variable para aplicar el efecto de aparicion del boton del carrito de compras */


//variables filtos
const limpiarFiltros = document.getElementById('limpiarFiltros')  //boton para limpiar los filtros
const show = document.querySelector('.costRange');    //cantidad mostrada en el input de rango
const applyFilter  = document.querySelector('.applyFilter');  //boton para aplicar los filtros
limpiarFiltros.addEventListener('click', clean )//listener para el boton de limpiar del filtro)
function clean (){ 
  [...document.querySelector('.productsList').children].forEach(element => {
    element.style.display = ""  
    show.textContent = "$ 20.000" 
    rango.value = 20000
  });
}
applyFilter.addEventListener('click', filter)   // listener para aplicar los filtros
//fin de las variables de filtro
//funcion para filtrar
function filter() {
  // Obtener datos del filtro
  let especieInput = document.getElementById('especie').value.toLowerCase();
  let containerFilter = [...document.querySelector('.productsList').children];
  let priceMax = document.querySelector('.costRange').textContent;
  let precioMaxNumber = priceMax.replace('.', '').replace(/[^0-9,.-]+/g, '');

  // Estado de los checkboxes


  containerFilter.forEach(element => {
    const categoria = element.getAttribute('data-categoria').toLowerCase();
    const subcategoria = element.getAttribute('data-subcategoria').toLowerCase();
    const precio = parseInt(element.getAttribute('data-cost'));

    const coincideCategoria = categoria === especieInput || categoria === "perros y gatos";
    const coincidePrecio = precio <= parseInt(precioMaxNumber);
    const esComida = subcategoria === "comida";
    const esMedicamento = subcategoria === "medicamento";

    let mostrar = false;

    if (coincideCategoria && coincidePrecio ) {
      // Aplicar filtros por subcategoría
      if (checkAlimentos && esComida) {
        mostrar = true;
      } else if (checkMedicamentos && esMedicamento) {
        mostrar = true;
      } else if (!checkAlimentos && !checkMedicamentos) {
        // Si no hay filtros por subcategoría, mostrar todos los que coinciden por especie y precio
        mostrar = true;
      }
    }
    // Mostrar u ocultar elemento
    element.style.display = mostrar ? "" : "none";
  });
}

// else{console.log("hola");}
// if(document.getElementById('especie').value.toLowerCase() === element.getAttribute('data-categoria').toLowerCase() || element.getAttribute('data-categoria').toLowerCase() === "perros y gatos" ){
// } 
// Filtro de rango
rango.addEventListener('input', e => {
  let dinero = e.target.value;
  show.textContent = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(dinero);
}); 
//fin del filtro de rango 



class ItemStore {
  constructor(imgProduct, nomProduct, sendProduct, costProduct, categoria,subcategoria
) {
    this.img = imgProduct;
    this.nom = nomProduct;
    this.send = sendProduct;
    this.cost = costProduct; 
    this.categoria = categoria; 
    this.subcategoria = subcategoria
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
      const producto = new ItemStore(
        item.img, 
        item.nombre,
        item.envio_gratis,
        item.precio, 
        item.categoria,
        item.subcategoria
      )
      createHtml(producto);
    });
    store.appendChild(fragment);
    document.querySelectorAll('.agg').forEach(button => {
      button.addEventListener('click', e => {   
          containsEmpty()
          const parent = e.target.parentElement;
          const info = parent.children[1];
          const product = new ArticleCart(
            parent.children[0].src,
            info.children[0].textContent,
            parseInt(parent.getAttribute('data-cost'))
          )
          validarArticulos(product);
      });
    });
  }); 
  function createHtml(product) { /*crea los articulos dentro de la tienda (no dentro del carrito de compras) */
  let card = document.createElement('div');
  card.classList.add('elementStore');
  card.setAttribute('data-cost', product.cost);  
  card.setAttribute('data-categoria', product.categoria)  
  card.setAttribute('data-subcategoria', product.subcategoria )
  
  card.innerHTML = `
    <img src="${product.img}" class="photoElementStore" alt="">
    <div class="infoProductStore">
      <p class="titleProductStore">${product.nom}</p>
      <p class="send text-success">${product.send ? 'Envio Gratis' : 'Costo por envio'}</p>
      <span class="costStoreElement">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP',maximumFractionDigits:0 }).format(product.cost)}</span>
    </div>
    <button class="btn btn-primary w-50 agg">agregar</button>`;
  fragment.appendChild(card); 
}

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
      <p class="costElement text-success">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits:0 }).format(product.cost)}</p>
    </div>
    <i class="delete fa-solid fa-x"></i>`;

  containerCart.appendChild(element);
  element.querySelector('.delete').addEventListener('click', () => {  
    element.remove();  
    if(containerCart.children.length === 0){  
      console.log("hola");
    let msjElement = document.createElement('div')  
    msjElement.classList.add ('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'w-100', 'h-100', 'gap-4', 'msjCartEmpty')
    msjElement.innerHTML = `
    
                  <svg xmlns="http://www.w3.org/2000/svg" width="20%"  fill="currentColor" class="bi bi-cart-x" viewBox="0 0 16 16">
    <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793z"/>
    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
  </svg>
                  <p class="fs-4 text-danger">¡¡Carrito vacio!!</p> 
                  <p class="fs-5 text-black" >No te quedes sin mirar nuestros productos</p> 
                  <button type="button" class="btn btn-primary w-50" >Ir a Tienda</button>
                
    `   
    containerCart.appendChild(msjElement)  
    actualizarTotal();
        
    } 
    else{
      element.remove()
      actualizarTotal(); 
    }
    actualizarTotal(); 
  });
}

function containsEmpty(){ 
  let msjEmptyCart = containerCart.children[0]
  if(msjEmptyCart.classList.contains("msjCartEmpty")){
    msjEmptyCart.remove(); 
    return
  }  
    return
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

//mostrar menu en responsive
const header = document.querySelector('.header')/*contenedor header*/ 
const menu  = document.querySelector('.menu')/**/ 
let desplegado = false
const menuResponsive = document.getElementById('menuAccesresponsive') //boton del despliege del menu
menuResponsive.addEventListener('click', ()=>{  

  if(!desplegado){
    gsap.to(menu,{ duration: 0.5, display:"flex", ease: 'power1.inOut'})
  header.style.height = "13rem" 
  desplegado = true
  }
  else if(desplegado === true){
    gsap.to(menu,{ duration: 0, display:"none" })
    desplegado = false
    header.style.height = "100%" 
  }
})
// Mostrar/ocultar carrito con GSAP 

observer.observe(btnCart);

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
