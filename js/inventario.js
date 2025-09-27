document.addEventListener('DOMContentLoaded', () => {
    let bodegas = JSON.parse(localStorage.getItem('bodegas'));
    if (!bodegas || !Array.isArray(bodegas)) {
        bodegas = [
            { codigo: "B001", nombre: "Caicedonia", valorSaco: 0 },
            { codigo: "B002", nombre: "Tulua", valorSaco: 0 },
            { codigo: "B003", nombre: "Sevilla", valorSaco: 0 }
        ];
        localStorage.setItem('bodegas', JSON.stringify(bodegas));
    }

    let productos = JSON.parse(localStorage.getItem('productos'));
    if (!productos || !Array.isArray(productos)) {
        productos = [
            { codigo: "C-01", nombre: "Cafe Castilla" },
            { codigo: "C-02", nombre: "Cafe Caturra" },
            { codigo: "C-03", nombre: "Cafe Borbón" }
        ];
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    let inventario = JSON.parse(localStorage.getItem('inventario'));
    if (!inventario || !Array.isArray(inventario)) {
        inventario = [];
        bodegas.forEach(b => {
            productos.forEach(p => {
                inventario.push({
                    codigoMovimiento: `${b.codigo}-${p.codigo}`, // código único
                    codigoBodega: b.codigo,
                    codigoProducto: p.codigo,
                    stock: 0
                });
            });
        });
        localStorage.setItem('inventario', JSON.stringify(inventario));
    }

    const bodegaSelectInventory = document.getElementById('bodegaSelectInventory');
    const productoSelectInventory = document.getElementById('productoSelectInventory');
    const stockInput = document.getElementById('stockInput');
    const updateInventoryBtn = document.getElementById('updateInventoryBtn');
    const inventoryTableBody = document.querySelector('#inventarioTable tbody');

    function cargarSelects() {
        bodegaSelectInventory.innerHTML = '<option value=""> Seleccione Bodega </option>';
        bodegas.forEach(b => {
            bodegaSelectInventory.innerHTML += `<option value="${b.codigo}">${b.nombre}</option>`;
        });

        productoSelectInventory.innerHTML = '<option value=""> Seleccione Producto </option>';
        productos.forEach(p => {
            productoSelectInventory.innerHTML += `<option value="${p.codigo}">${p.nombre}</option>`;
        });
    }

    function mostrarInventario() {
        inventoryTableBody.innerHTML = '';
        inventario.forEach(item => {
            const bodega = bodegas.find(b => b.codigo === item.codigoBodega)?.nombre || item.codigoBodega;
            const producto = productos.find(p => p.codigo === item.codigoProducto)?.nombre || item.codigoProducto;
            inventoryTableBody.innerHTML += `
                <tr>
                    <td>${item.codigoMovimiento}</td>
                    <td>${bodega}</td>
                    <td>${producto}</td>
                    <td>${item.stock} - Kg (${Number(item.stock/120).toFixed(2)}) Bultos</td>
                </tr>`;
        });
    }

    updateInventoryBtn.addEventListener('click', () => {
        const codigoBodega = bodegaSelectInventory.value;
        const codigoProducto = productoSelectInventory.value;
        const cantidad = parseInt(stockInput.value);

        if (!codigoBodega || !codigoProducto || isNaN(cantidad) || cantidad <= 0) {
            alert('Complete todos los campos con valores válidos');
            return;
        }

        const item = inventario.find(i => i.codigoBodega === codigoBodega && i.codigoProducto === codigoProducto);
        if (item) {
            item.stock += cantidad;
            localStorage.setItem('inventario', JSON.stringify(inventario));
            mostrarInventario();
            stockInput.value = '';
        } else {
            alert('Error: combinación bodega-producto no encontrada');
        }
    });

    cargarSelects();
    mostrarInventario();
});
