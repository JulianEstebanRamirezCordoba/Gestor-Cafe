## 📌 Descripción
Esta aplicación permite gestionar bodegas, productos, inventario y movimientos de inventario de café, con la posibilidad de visualizar estadísticas y gráficos interactivos.  
Incluye funcionalidades de reseteo de datos por tabla o total, y gráficos que muestran:

- Precio nacional vs bodegas.  
- Valor total del inventario por bodega.  
- Bultos por bodega.

---

## 🗂 Estructura de archivos

├── assets/ # Archivos estáticos (fonts, imágenes)
│ ├── fonts/
│ └── img/
├── css/ # Hojas de estilo
│ ├── resept.css
│ └── style.css
├── html/ # Vistas HTML
│ ├── inventario.html
│ ├── movimiento.html
│ └── resept.html
├── js/ # Lógica en JavaScript
│ ├── inic.js
│ ├── inventario.js
│ ├── main.js
│ ├── movimiento.js
│ └── resept.js
├── index.html # Página principal
└── README.md # Documentación del proyecto


---

## 💻 Funcionalidades

### 1. Gestión de datos
- **Bodegas**: Registro de cada bodega con código, nombre y valor por saco.  
- **Productos**: Registro de productos asociados al inventario.  
- **Inventario**: Cantidad de bultos disponibles por bodega.  
- **Movimientos de inventario**: Registro de entradas y salidas de bultos.

### 2. Reseteo de datos (`reseteo.js`)
- **Eliminar tabla específica**: Permite seleccionar y eliminar solo una tabla de `localStorage`.  
- **Eliminar todo**: Limpia todas las tablas de inventario.  
- **Confirmación previa**: `confirm()` asegura que no se borren datos accidentalmente.  
- **Mensajes dinámicos**: `#mensaje` muestra feedback al usuario.

### 3. Gráficas (`Chart.js`)
- **Precio nacional vs bodegas (`graficoCafe.js`)**
  - Gráfico de barras comparando precio nacional con valor de cada bodega.
- **Valor total inventario (`graficoInventario.js`)**
  - Gráfico tipo doughnut/pastel, muestra la distribución de valor monetario del inventario por bodega.
- **Bultos por bodega (`graficoBultos.js`)**
  - Gráfico de barras mostrando el número de bultos en cada bodega.

### 4. Estilos (`resept.css`)
- Fondo animado con gradiente en movimiento.  
- Tarjetas modernas con sombras, bordes redondeados y hover dinámico.  
- Botones con gradiente y animación suave.  
- Mensajes destacados en color neón.

---

## 🛠 Flujo de la aplicación
1. Al cargar la página, se inicializan los gráficos con los datos existentes en `localStorage`.  
2. Se muestra la interfaz de reseteo: selección de tabla, botones de eliminar y contenedor de mensajes.  
3. El usuario puede:
   - Visualizar gráficos de inventario y bultos.  
   - Eliminar una tabla específica o todo el inventario.  
4. Los mensajes de acción aparecen en `#mensaje`.  
5. Los gráficos se actualizan automáticamente si se modifica el inventario.

---

## 📌 Uso de la aplicación

1. Abrir `index.html` en un navegador moderno.  
2. Interactuar con el **select** y los botones para reseteo de datos.  
3. Consultar los **gráficos** de precio, valor total y bultos por bodega.  
4. Revisar el **feedback visual** en el contenedor `#mensaje`.

---

## ⚙ Recomendaciones

- Mantener consistencia en los nombres de `localStorage`: `bodegas`, `productos`, `inventario`, `movimientosInventario`.  
- Confirmar siempre las acciones de reseteo antes de ejecutarlas.  
- Actualizar los gráficos después de cualquier modificación de inventario para reflejar cambios.  
- Usar un navegador actualizado que soporte **Chart.js** y animaciones CSS.

---

## 💡 Futuras mejoras

- Agregar **modal flotante** para confirmación visual más atractiva.  
- Exportar datos a **Excel o CSV**.  
- Implementar **filtros por fecha o tipo de movimiento**.  
- Hacer la interfaz totalmente **responsive** para dispositivos móviles.

---

## 📜 Autor
Julian Esteban Ramirez Cordoba

---

## 📌 Licencia
Este proyecto es de uso educativo y personal. No está licenciado para distribución comercial sin autorización.
