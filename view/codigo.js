async function obtenerProductos() {
    try {
        const response = await fetch('../db.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        return data.products; // Accede al array de productos dentro del objeto JSON
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        mostrarMensajeDeError('No se pudieron obtener los productos. Intenta nuevamente más tarde.');
        return []; // Devuelve un arreglo vacío si ocurre un error
    }
}

async function inicializarTienda() {
    const productos = await obtenerProductos();
    const gallery = document.querySelector('.gallery');

    productos.forEach(producto => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h2>${producto.title}</h2>
            <p>$${producto.price.toFixed(2)}</p>
            <button onclick="agregarAlCarrito('${producto.title}', ${producto.price})">Agregar al Carrito</button>
        `;

        gallery.appendChild(productDiv);
    });

    mostrarCarrito(); // Asegúrate de mostrar el carrito al inicializar la tienda
}

function agregarAlCarrito(nombre, precio) {
    try {
        if (!validarDatos(nombre, precio)) {
            return;
        }

        let carrito = localStorage.getItem('carrito');
        carrito = carrito ? JSON.parse(carrito) : [];

        carrito.push({ nombre, precio });
        localStorage.setItem('carrito', JSON.stringify(carrito));

        mostrarCarrito();

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${nombre} ha sido agregado al carrito`,
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        mostrarMensajeDeError('Hubo un problema al agregar el producto al carrito. Intenta nuevamente.');
    }
}

function validarDatos(nombre, precio) {
    if (!nombre || precio <= 0) {
        mostrarMensajeDeError('Por favor, verifica los datos ingresados.');
        return false;
    }
    return true;
}

function mostrarCarrito() {
    try {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const carritoElement = document.getElementById('carrito');
        carritoElement.innerHTML = '';

        carrito.forEach((producto, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${producto.nombre} - $${producto.precio.toFixed(2)} <button onclick="eliminarDelCarrito(${index})">&times;</button>`;
            carritoElement.appendChild(li);
        });

        actualizarTotal();
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        mostrarMensajeDeError('Hubo un problema al mostrar el carrito. Intenta nuevamente.');
    }
}

function eliminarDelCarrito(index) {
    try {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        mostrarMensajeDeError('Hubo un problema al eliminar el producto del carrito. Intenta nuevamente.');
    }
}

function actualizarTotal() {
    try {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
        document.getElementById('totalCarrito').textContent = `Total: $${total.toFixed(2)}`;
    } catch (error) {
        console.error('Error al actualizar el total del carrito:', error);
        mostrarMensajeDeError('Hubo un problema al calcular el total del carrito. Intenta nuevamente.');
    }
}

function realizarCompra() {
    Swal.fire({
        title: 'Compra realizada',
        text: '¡Gracias por tu compra!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carrito'); // Vaciar el carrito
            mostrarCarrito(); // Actualizar la visualización del carrito
        }
    }).catch((error) => {
        console.error('Error al realizar la compra:', error);
        mostrarMensajeDeError('Hubo un problema al realizar la compra. Intenta nuevamente.');
    });
}

function mostrarMensajeDeError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
}

window.onload = function() {
    inicializarTienda();
    document.getElementById('realizarCompra').addEventListener('click', realizarCompra);

    const carritoIcono = document.getElementById('carritoIcono');
    const carritoSidebar = document.getElementById('carritoSidebar');
    const cerrarSidebar = document.getElementById('cerrarSidebar');

    carritoIcono.addEventListener('click', () => {
        carritoSidebar.classList.add('open');
    });

    cerrarSidebar.addEventListener('click', () => {
        carritoSidebar.classList.remove('open');
    });
};