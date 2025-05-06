// variable
let total = []
let contador = 0
const show = document.querySelector('.costRange');// valor de rango
const rango = document.querySelector('.form-range'); //input rango
const btnCart = document.querySelector('.shopCar') ;//boton del carrito de compras 
const costCard = document.querySelector('.costCard')
const showCart =  document.querySelector('.shopCarbox'); //contenedor del carrito de compras  
const containerCart = document.getElementById('containerCart')
const fragment = document.createDocumentFragment();
const store = document.querySelector('.productsList') //tienda  
let titleAdop = document.querySelector('.titleAdop')
const adop = document.querySelectorAll('.carouselElement')   
const notify = document.getElementById('notify')
let arrayCart = []  //arreglo de compras del cliente  
const CarouselMovement = document.getElementById('CarouselMovement')
const costNumber = document.querySelector('.costNumber') 
let cartPortable = document.querySelector(".cartPortable")
let btnsFloat = []  

 btnsFloat.push(btnCart, cartPortable)
// filtros 

// listener mostrar carrito  con gsap 
btnsFloat.forEach(btns =>{
    btns.addEventListener('click', () =>{ // este listener esconde el carrito y el else lo muestra
        if (showCart.style.display === "flex"){  
            gsap.to(showCart , { right:-500, duration: .5, delay:.3, onComplete: () => {
                showCart.style.display = "none"; 
            }}); 
        } 
        else {
            gsap.to(showCart, {onStart:()=>{ showCart.style.display = "flex"}, right: "1.2rem", duration: .3, delay:.3 });
        }  
    });  
}) 






let observer = new IntersectionObserver(validarVisibilidad, {});
observer.observe(btnCart)



//listener rango en el filtro de tienda
rango.addEventListener('input', (e)=>{  /*valor para el filtro de la tienda*/
        let dinero = (e.target.value) 
    show.textContent =  new Intl.NumberFormat("es-CO",{
        style: "currency", 
        currency: "COP", 
        maximumFractionDigits: 0
    }).format(dinero)});  
    /*------------------*/





//importacion de productos de la tienda  
let elementBuy =[]  //arreglo a mostrar en tineda 
class ItemCart { // class para crear elementos con json 
    constructor(imgProduct,nomProduct, sendProduct, costProduct){
        this.img = imgProduct
        this.nom = nomProduct 
        this.send = sendProduct 
        this.cost = costProduct
    }
}  
class ArticleCart { //class para pintar elementos en el carrito 
    constructor(img, descrip, cost){
        this.img = img 
        this.descrip = descrip 
        this.cost = cost 
    } 
} 
        fetch('./elementosTienda.json')/*creacion de elementos de manera dinamica*/
        .then(response => response.json()) 
        .then(data =>{ 
            for (let i = 0; i < data.length; i++) {  
                let producto = new ItemCart(
                    data[i].img,
                    data[i].nombre, 
                    data[i].envio_gratis,
                    data[i].precio 
                )
                createHtml(producto)  
            }  
            store.appendChild(fragment) 
            const buyBtn = document.querySelectorAll('.agg') //*funcion para agregar objetos al carrito de compras */
            buyBtn.forEach(element => {
                element.addEventListener( 'click', (e)=>{  
                    let elementFatherCart = e.target.parentElement  
                    let elementGrandSon = elementFatherCart.children[1]
                    let productCart = new ArticleCart(
                        elementFatherCart.children[0].src,
                        elementGrandSon.children[0].textContent,
                        elementGrandSon.children[2].textContent
                    )
                        validarArticulos( productCart)
                } )
            }); 

            // funciones para la seccion de adopcion 
            adop.forEach(element => {// listener para mas informacion de animales en adopcion 
                element.addEventListener('click',(e)=>{ 
                        notify.style.display = "flex"   
                        notify.style.left = "5vw"
                        let avisos = document.createElement('div')    
                    avisos.classList.add('aviso')
                    avisos.style.display="flex"
                    let elementFather = e.target.parentElement; 
                        avisos.innerHTML = ` 
                    <i class="cerrar fa-solid fa-x"></i>
                    <div class="infoMascota">
                    <img src="${elementFather.children[0].src}" class="imgAdopcion" alt="">
                    <p>${elementFather.children[1].textContent}</p> 
                    </div>
                    <div class="adopcionDescripcion">
                        <p class="descripcion">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium numquam aperiam iusto placeat exercitationem nisi tempora dignissimos excepturi autem molestiae ratione</p> 
                        <button type="button" class="btn btn-success w-75">¡¡<i class="fa-brands fa-whatsapp "></i> Háblanos!!</button>
                    </div>
                    ` 
                    notify.appendChild(avisos) 
                    const cerrarNotify = document.querySelectorAll('.cerrar' )  
                    cerrarNotify.forEach(cierre => {
                        cierre.addEventListener('click', ()=>{  
                        gsap.to( notify, {
                            left:"-100vw",
                            duration:.3,
                            ease:"back.in",
                            onComplete:()=>{ 
                            avisos.remove() 
                            notify.style.display ='none'
                        }}) 
                    })
                    }) 
                }) 
                
            }
        )
    }             
)      
function actualizarTotal() { 
    if(containerCart.children !== 0){
    let arraycontainer = [containerCart.children] 
        arraycontainer.forEach(son =>{ 
            
        })
} 
    else{
        console.log("container no tiene hijos");
    }
     contador = total.reduce((acc, val) => acc + val, 0);  
     let contador2 = contador
    
    costCard.textContent = total.length;
}

function validarArticulos(newElement) {  
    let newElementSearch = newElement.descrip;      
    let articleCart = document.querySelectorAll('.boxElement');  
    if (articleCart.length !== 0) {
        for (let i = 0; i < articleCart.length; i++) {
            if (newElementSearch === articleCart[i].getAttribute('data-name')) {
                let cantidadElemento = articleCart[i].querySelector('.cantidad');  
                let costElemento = Number(articleCart[i].getAttribute('data-cost'));
                let cantidadActual = Number(cantidadElemento.textContent) + 1;  
                cantidadElemento.textContent = cantidadActual;   
                let costoHtml = articleCart[i].children[1].children[2]
                let nuevoCosto = cantidadActual * costElemento;      
                articleCart[i].setAttribute('data-Newcost', 0 ) 
                articleCart[i].setAttribute('data-Newcost', nuevoCosto ) 
                costoHtml.textContent = new Intl.NumberFormat("es-CO", {
                    style: "currency", 
                    currency: "COP", 
                    maximumFractionDigits: 0
                }).format(nuevoCosto);     
                total.push(-costElemento)
                total.push(nuevoCosto)
                
                actualizarTotal();
                return;
            }
        }  
        actualizarTotal(); // Asegurar que se actualiza el total del carrito correctamente 

}

    // Si no existe el artículo en el carrito, lo agrega
    total.push(Number(newElement.cost)); 
    // console.log(typeof(Number(newElement.cost)));

    createdElementCart(newElement);   
    
    // console.log(articleCart) 
}

function createHtml (arreglo){ // funcion para crear elementos dinamicamente con archivo json 
    let card = document.createElement('div'); 
    card.classList.add('elementStore')   
    let free =""
    if(arreglo.send){
        free = "Envio Gratis"
    }else{
        free = "Costo por envio "
    }
    card.innerHTML = ` 
            <img src="${arreglo.img}" class="photoElementStore" alt="">  
                <div class="infoProductStore">
                    <p class="titleProductStore">${arreglo.nom}</p> 
                    <p class="send text-success">${free}</p>
                    <span class="costStoreElement">${arreglo.cost}</span> 
                </div> 
            <button class="btn btn-primary w-50 agg">agregar</button>` 
            fragment.appendChild(card) 
}  


function createdElementCart(element){ // funcion para crear html de elementos a comprar en carrito   
    let elementCart = document.createElement('div')  
    elementCart.classList.add('boxElement')      
    
    costFormat = new Intl.NumberFormat("es-CO",{
        style: "currency", 
        currency: "COP", 
        maximumFractionDigits: 0
    }).format(element.cost)
    elementCart.innerHTML = ` 
    <img src="${element.img}" alt="" > 
    <div class="datosElement">
    <p class="nomProduct" >${element.descrip}</p> 
    <p class="cantidad">1</p>
    <p class="costElement text-success">${costFormat}</p>
    </div> 
    <i class="delete fa-solid fa-x"></i>
    `     
    
    elementCart.setAttribute("data-Newcost", 0);  
    elementCart.setAttribute("data-cost", element.cost);  
    elementCart.setAttribute("data-name",element.descrip)
    containerCart.appendChild(elementCart)   
    //insertar objeto al carrito o elemento a comprar
    //agregar evento de eliminacion al carrito 
        let deleteElement = document.querySelectorAll('.delete') 
        deleteElement.forEach(element1 => {
            element1.addEventListener('click', (e)=>{   
                let parentElement = e.target.parentElement;
                let costToRemove = Number(parentElement.getAttribute("data-cost"));  
                contador -= costToRemove; 
                total = total.filter(value => value !== costToRemove);  
                costCard.textContent = total.length 
                e.target.parentElement.remove()      
                actualizarTotal();
            })
        }); 
    actualizarTotal()
costCard.textContent = total.length   
 
}    




//animacion para el carrusel de mascotas 
gsap.to(CarouselMovement,{
    x:"-40%",
    duration:10, 
    repeat:-1, 
    yoyo:true, 
    ease:"power1.inOut"
})
gsap.to(titleAdop, { 
    x: 20,  
    duration: 0.5,  
    repeat: -1,  
    ease: "power1.inOut",
    yoyo:true
});
function validarVisibilidad (entries) {
    let entry = entries[0]
    if(entry.isIntersecting){ 
        gsap.to(cartPortable, {
            right: "-50rem",
            duration:.5, 
            ease:"power1.out",
            onComplete:()=>{
                cartPortable.style.display ="none" 
            }
        })
    }else{ 
        gsap.to(cartPortable, {  
            onStart:()=>{
                cartPortable.style.display ="flex" 
            }, 
            ease:"power1.out",
            right:"1rem",
            duration:.5
        })
    }
};
