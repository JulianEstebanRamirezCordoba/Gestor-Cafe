const tablaSelect = document.getElementById('tablaSelect');
const eliminarTablaBtn = document.getElementById('eliminarTabla');
const eliminarTodoBtn = document.getElementById('eliminarTodo');
const mensajeDiv = document.getElementById('mensaje');

eliminarTablaBtn.addEventListener('click', () => {
    const tabla = tablaSelect.value;
    const confirmar = confirm(`¿Deseas eliminar la tabla "${tabla}"?`);

    if(confirmar) {
        localStorage.removeItem(tabla);
        mensajeDiv.textContent = `Tabla "${tabla}" eliminada correctamente.`;
    } else {
        mensajeDiv.textContent = 'Acción cancelada.';
    }

    const salir = confirm(`¿Deseas salir de la pantalla "?`);
    if(salir) {
        window.location.href = '../index.html';
    } else {
        mensajeDiv.textContent = 'Acción cancelada.';
    }
});

eliminarTodoBtn.addEventListener('click', () => {
    const confirmar = confirm('¿Deseas eliminar todas las tablas de inventario?');

    if(confirmar) {
        localStorage.removeItem('bodegas');
        localStorage.removeItem('productos');
        localStorage.removeItem('inventario');
        localStorage.removeItem('movimientosInventario');
        mensajeDiv.textContent = 'Todos los datos han sido eliminados correctamente.';
    } else {
        mensajeDiv.textContent = 'Acción cancelada.';
    }

    const salir = confirm(`¿Deseas salir de la pantalla "?`);
    if(salir) {
        window.location.href = '../index.html';
    } else {
        mensajeDiv.textContent = 'Acción cancelada.';
    }

});
