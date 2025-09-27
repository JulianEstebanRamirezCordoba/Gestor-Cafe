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


let movimientosInventario = JSON.parse(localStorage.getItem('movimientosInventario')) || [];

const origenSelect = document.getElementById('origenSelect');
const destinoSelect = document.getElementById('destinoSelect');
const productoMovimientoSelect = document.getElementById('productoMovimientoSelect');
const cantidadMovimientoInput = document.getElementById('cantidadMovimientoInput');
const tipoMovimientoSelect = document.getElementById('tipoMovimientoSelect');
const ejecutarMovimientoBtn = document.getElementById('ejecutarMovimientoBtn');
const movimientosTableBody = document.querySelector('#inventarioTable tbody');


function cargarSelectsMovimientos() {
  origenSelect.innerHTML = '<option value=""> Seleccione Origen </option>';
  destinoSelect.innerHTML = '<option value=""> Seleccione Destino </option>';
  productoMovimientoSelect.innerHTML = '<option value=""> Seleccione Producto </option>';

  bodegas.forEach(b => {
    origenSelect.innerHTML += `<option value="${b.codigo}">${b.nombre}</option>`;
    destinoSelect.innerHTML += `<option value="${b.codigo}">${b.nombre}</option>`;
  });

  productos.forEach(p => {
    productoMovimientoSelect.innerHTML += `<option value="${p.codigo}">${p.nombre}</option>`;
  });
}

function mostrarMovimientos() {
  movimientosTableBody.innerHTML = '';
  movimientosInventario.forEach(m => {
    const origen = bodegas.find(b => b.codigo === m.origen)?.nombre || m.origen;
    const destino = bodegas.find(b => b.codigo === m.destino)?.nombre || m.destino;
    const producto = productos.find(p => p.codigo === m.producto)?.nombre || m.producto;
    movimientosTableBody.innerHTML += `
      <tr>
        <td>${new Date(m.fecha).toLocaleString()}</td>
        <td>${origen}</td>
        <td>${destino}</td>
        <td>${producto}</td>
        <td>${m.cantidad} Kg - (${Number.parseFloat(m.cantidad/120).toFixed(2)}) Bultos</td>
        <td>${m.tipo}</td>
        <td>$ ${m.valorTotal.toFixed(2)}</td>
      </tr>`;
  });
}

ejecutarMovimientoBtn.addEventListener('click', () => {
  const origen = origenSelect.value;
  const destino = destinoSelect.value;
  const producto = productoMovimientoSelect.value;
  const cantidad = parseInt(cantidadMovimientoInput.value);
  const tipo = tipoMovimientoSelect.value;

  if (!origen || !destino || !producto || isNaN(cantidad) || cantidad <= 0) {
    alert('Complete todos los campos correctamente');
    return;
  }
  if (origen === destino) {
    alert('La bodega origen y destino no pueden ser la misma');
    return;
  }

  const itemOrigen = inventario.find(i => i.codigoBodega === origen && i.codigoProducto === producto);
  const itemDestino = inventario.find(i => i.codigoBodega === destino && i.codigoProducto === producto);

  if (!itemOrigen) {
    alert('La bodega origen no tiene este producto');
    return;
  }
    
  if (itemOrigen.stock < cantidad) {
    alert('Stock insuficiente en la bodega origen');
    return;
  }

  itemOrigen.stock -= cantidad;
  itemDestino.stock += cantidad;

  localStorage.setItem('inventario', JSON.stringify(inventario));

  const valorUnitario = bodegas.find(b => b.codigo === origen).valorSaco;
  const valorTotal = (cantidad / 120) * valorUnitario;

  movimientosInventario.push({
    fecha: new Date(),
    origen,
    destino,
    producto,
    cantidad,
    tipo,
    valorTotal
  });
    
  localStorage.setItem('movimientosInventario', JSON.stringify(movimientosInventario));

  cantidadMovimientoInput.value = '';
  mostrarMovimientos();
});

cargarSelectsMovimientos();
mostrarMovimientos();
