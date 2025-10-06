// Librería para obtener el precio del café mercado
const express = require("express");
const pdf = require("pdf-parse");
const fs = require("fs");

// Librería para ejecutar tareas programadas
const axios = require("axios");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;
const PDF_URL = "https://www.federaciondecafeteros.org/static/files/precio_cafe.pdf";

// Cache simple en memoria
let cache = {
  valor: null,
  fecha: null
};

function parseValorCafe(valorTexto) {
  valorTexto = valorTexto.trim();
  const limpio = valorTexto.replace(/[.,]/g, "");
  return parseInt(limpio, 10);
}

async function obtenerValorCafe() {
    const response = await axios.get(PDF_URL, { responseType: "arraybuffer" });
    const pdfData = await pdf(response.data);
    const text = pdfData.text;

    // Buscar el patrón "Precio total ... COP"
    const regex = /Precio total.*?([\d,.]+)\s*COP/;
    const match = text.match(regex);

    if (!match) throw new Error("No se encontró el valor del café");
  
    let valor = match[1];
    console.log(`[API] Valor del cafe encontrado: ${valor}`);
    valor = parseValorCafe(valor);
    console.log(`[API] Valor del cafe obtenido: ${valor}`);

    return valor;
}

app.get("/apis/precio_mercado", (req, res) => {
    if (!cache.valor) {
        return res.status(503).json({ error: "El valor aún no se ha cargado" });
    }
    res.json({ valor_cafe_cop: cache.valor, fecha: cache.fecha });
});

//Cronometro para actualizar el valor del café mercado cada día a las 5 AM
cron.schedule("0 5 * * *", async () => {
  try {
    const valor = await obtenerValorCafe();
    const hoy = new Date().toISOString().split("T")[0];
    cache = { valor, fecha: hoy };
    console.log(`[CRON] Valor del café actualizado: ${valor}`);
    fs.writeFileSync("./assets/fonts/datos.json", JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error("[CRON] Error al actualizar valor del café:", e);
  }
});

// Cargar valor inicial al iniciar el servidor [Pruebas]
// (async () => {
//     try {
//         const valor = await obtenerValorCafe();
//         const hoy = new Date().toISOString().split("T")[0];
//         cache = { valor, fecha: hoy };
//         fs.writeFileSync("./assets/fonts/datos.json", JSON.stringify(cache, null, 2));
//         console.log(`[INIT] Valor del cafe inicial cargado: ${valor}`);
//     } catch (e) {
//         console.error("[INIT] Error al cargar valor inicial:", e.message);
//     }
    
//     app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
// })();

app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
