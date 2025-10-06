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

// Variables para el formulario de ingreso del precio del café
const coffeePriceForm = document.getElementById('coffeePriceForm');
const bodegaSelect = document.getElementById('bodegaSelect');
const coffeePrice = document.getElementById('coffeePrice');

// Funciones para obtener y manipular datos de las bodegas
function buscarBodega(codigo) {
    for (let i = 0; i < bodegas.length; i++) {
        if (bodegas[i].codigo === codigo) {
            return bodegas[i];
        }
    }
    return null;
}

// Función para obtener el precio del café desde el JSON generado por el servidor
async function precioCafe() {
    try {
        const response = await fetch("./assets/fonts/datos.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el JSON");
        }

        const datos = await response.json();
        console.log("Datos cargados:", datos);

        valor = (datos.valor).toLocaleString('es-CO');

        document.getElementById("precioCafe").textContent = `${valor} COP`;
        return (datos.valor);
    } catch (error) {
        console.error("Error al leer el JSON:", error);
    }
}

// Funciones para cálculos y gráficos de los bultos de cafe
function calcularCantidadSacos() {
    const stockTotalKg = inventario.reduce((total, item) => total + item.stock, 0);
    const pesoBulto = 120;
    const cantidadBultos = Math.floor(stockTotalKg / pesoBulto);
    const totalSacosElement = document.getElementById('totalSacos');

    if (totalSacosElement) {
        totalSacosElement.innerText = `${cantidadBultos} bultos (${stockTotalKg.toLocaleString('es-CO')} kg)`;
    }

    return cantidadBultos;
}

// Función para calcular el valor total del inventario
function calcularValorTotalCafe() {
    let totalPorBodega = {};
    const valorInventario = document.getElementById('valorInventario');

    bodegas.forEach(b => {
        totalPorBodega[b.codigo] = 0;
    });

    inventario.forEach(item => {
        const bodega = bodegas.find(b => b.codigo === item.codigoBodega);
        if (bodega) {
            totalPorBodega[bodega.codigo] += (item.stock / 120) * bodega.valorSaco;
        }
    });

    const totalGeneral = Object.values(totalPorBodega).reduce((acc, val) => acc + val, 0);
    valorInventario.innerText = `$ ${totalGeneral.toLocaleString('es-CO')}`;
    console.log("Valor por bodega:", totalPorBodega);
    console.log("Valor total general:", totalGeneral);

    return { totalPorBodega, totalGeneral };
}

// Función para guardar el precio del café y actualizar el valor del inventario
coffeePriceForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bodegaCodigo = bodegaSelect.value.trim();
    const precio = parseFloat(coffeePrice.value);

    if (!bodegaCodigo) {
        alert("Seleccione una bodega");
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        alert("Ingrese un precio válido");
        return;
    }

    
    const bodega = buscarBodega(bodegaCodigo);
    if (!bodega) {
        alert("Bodega no encontrada");
        return;
    }
    
    bodega.valorSaco = precio;

    localStorage.setItem('bodegas', JSON.stringify(bodegas));

    alert(`Precio Guardado: Bodega=${bodega.nombre}, ValorSaco=$${bodega.valorSaco}`);
    console.log(`Precio insertado: Bodega=${bodega.nombre}, ValorSaco=$${bodega.valorSaco}`);

    coffeePriceForm.reset();
});

/// Graficas de procesos inferiores y derivadas de los datos locales de los valores parciales ...
function dibujarGraficoInventarioPastel(datos) {
    const ctx = document.getElementById('graficoValores').getContext('2d');

    const totalPorBodega = datos.totalPorBodega;

    // Filtrar solo bodegas con valores
    const nombresBodegas = Object.keys(totalPorBodega).map(codigo => {
        const bodega = bodegas.find(b => b.codigo === codigo);
        return bodega ? bodega.nombre : codigo;
    });

    const valoresTotales = Object.values(totalPorBodega);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: nombresBodegas,
            datasets: [{
                label: 'Valor Total Inventario (COP)',
                data: valoresTotales,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let porcentaje = ((value / total) * 100).toFixed(2);
                            return `${context.label}: $${value.toLocaleString()} (${porcentaje}%)`;
                        }
                    }
                },
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

/// Graficas de procesos inferiores y derivadas de los precios del cafe a nivela nacional ...
function dibujarGraficoCafe() {
    const ctx = document.getElementById('graficoCafe').getContext('2d');
    const precioNacional = precioCafe(); 

    const nombresBodegas = bodegas.map(b => b.nombre);
    const valoresBodegas = bodegas.map(b => b.valorSaco);

    const etiquetas = ["Precio Nacional", ...nombresBodegas];
    const valores = [precioNacional, ...valoresBodegas];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Valor en COP',
                data: valores,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString(); 
                        }
                    }
                }
            }
        }
    });
}

// Función para calcular el número de bultos por bodega
function calcularBultosPorBodega() {
    let totalPorBodega = {};
    bodegas.forEach(b => totalPorBodega[b.codigo] = 0);

    inventario.forEach(item => {
        if(totalPorBodega[item.codigoBodega] !== undefined) {
            totalPorBodega[item.codigoBodega] += item.stock / 120;
        }
    });

    return totalPorBodega;
}

// Función para dibujar gráfico de bultos por bodega
function dibujarGraficoBultos() {
    const ctx = document.getElementById('graficoBultos').getContext('2d');

    const totalPorBodega = calcularBultosPorBodega();
    const nombresBodegas = bodegas.map(b => b.nombre);
    const valoresBultos = bodegas.map(b => totalPorBodega[b.codigo] || 0);

    // valoresBultos = valoresBultos / 120;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombresBodegas,
            datasets: [{
                label: 'Bultos por Bodega',
                data: valoresBultos,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        }
    });
}

// Inicializar todo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    precioCafe();
    calcularCantidadSacos();
    dibujarGraficoCafe();
    dibujarGraficoBultos();
    let arreglo_date = calcularValorTotalCafe();
    dibujarGraficoInventarioPastel(arreglo_date);
});
