const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors()); // Habilita todas las solicitudes CORS

app.get('/', (req, res) => {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSCAy68uApPsLb6woXJrn7BjGHayFmqy9TCNYljHm84R4l67ObjKIisnm0dnuckCAK4-Nh_o9dt4Uud/pubhtml';

  axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const tabla = $('table'); // Selecciona la tabla

      // Supongamos que la tabla tiene filas con celdas de datos
      const datosExtraidos = [];
      tabla.find('tr').each((i, fila) => {
        const celdas = $(fila).find('td');
        const filaDeDatos = celdas.map((j, celda) => $(celda).text()).get();
        datosExtraidos.push(filaDeDatos);
      });

      console.log(datosExtraidos); // Imprime los datos extraídos en la consola

      res.json({ datos: datosExtraidos }); // Envía los datos extraídos como respuesta
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al extraer los datos' });
    });
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
