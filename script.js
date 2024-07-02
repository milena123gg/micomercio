document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productoForm');
    const tableBody = document.getElementById('productosTable').querySelector('tbody');
    let isUpdating = false;

    //async permite que la función se comporte de manera asíncrona, 
    //puede ejecutar operaciones sin bloquear el hilo principal de ejecucion
    const fetchProductos = async () => {
        //luego cambiaremos la url por https://<hostdepanywhere>/productos
        const response = await fetch('https://milepeletay13gg.pythonanywhere.com/productos');// promesa: esperar a que se complete la solicitud HTTP
        const productos = await response.json(); //esperar a que se complete la conversión de la respuesta a JSON
        tableBody.innerHTML = '';
        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio}</td>
                <td>
                    <button onclick="editProducto(${producto.id}, '${producto.nombre}', ${producto.cantidad}, ${producto.precio})">Editar</button>
                    <button onclick="deleteProducto(${producto.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    const addProducto = async (producto) => {
        await fetch('https://milepeletay13gg.pythonanywhere.com/agregar_producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        fetchProductos();
    };

    const updateProducto = async (id, producto) => {
        await fetch(`https://milepeletay13gg.pythonanywhere.com/actualizar_producto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        fetchProductos();
    };

    const deleteProducto = async (id) => {
        await fetch(`https://milepeletay13gg.pythonanywhere.com/eliminar_producto/${id}`, {
            method: 'DELETE'
        });
        fetchProductos();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('productoId').value;
        const nombre = document.getElementById('nombre').value;
        const cantidad = document.getElementById('cantidad').value;
        const precio = document.getElementById('precio').value;
        const producto = { nombre, cantidad, precio }; // {"nombre": <<nombre>> , "cantidad":<<cantidad>>, "precio":precio}

        if (isUpdating) {
            updateProducto(id, producto);
            isUpdating = false;
        } else {
            addProducto(producto);
        }

        form.reset();
        document.getElementById('productoId').value = '';
    });

    window.editProducto = (id, nombre, cantidad, precio) => {
        document.getElementById('productoId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('cantidad').value = cantidad;
        document.getElementById('precio').value = precio;
        isUpdating = true;
    };

    window.deleteProducto = (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            deleteProducto(id);
        }
    };

    fetchProductos();
});
