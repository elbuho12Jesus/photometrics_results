const express = require('express');
const fs = require('fs');
const { console } = require('inspector');
const path = require('path'); // Importa el módulo 'path'
const app = express();
const PORT = 3000;
// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer la base de datos:', err);
            return res.status(500).send('Error al leer la base de datos.');
        }        
        const db = JSON.parse(data);
        const filterName = req.query.name; // Obtiene el nombre del parámetro de consulta
        // --- Generar opciones únicas para el select ---
        const nombresUnicos = [...new Set(db.map(item => item.name))].sort();
        let selectOptions = `<option value="">-- Todos --</option>`; // Opción por defecto para mostrar todos
        nombresUnicos.forEach(name => {
            const selected = (filterName === name) ? 'selected' : '';
            selectOptions += `<option value="${name}" ${selected}>${name}</option>`;
        });
        // ----------------------------------------------
        let datafilters = db;
        if (filterName && filterName !== "") { // También verifica que no sea la opción "Todos"
            // Filtra los datos si hay un nombre seleccionado
            datafilters = db.filter(item => 
                item.name.toLowerCase() === filterName.toLowerCase()
            );
        }

        // Generar tabla HTML
        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tabla de Datos</title>
                <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
                <script>
                    MathJax = {
                                tex: {
                                        inlineMath: [['$', '$'], ['\$', '\$']]
                                    }
                            };
                </script>
                <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #421a1a;
                    }
                    img {
                        max-width: 250px;
                        height: auto;
                        display: block;
                        margin: auto;
                    }
                    .yellow{
                        background-color: #fffb00;
                    }
                    .red{
                        background-color: #fa0000;
                    }
                    .green{
                        background-color: #00fa00;
                    }
                    .blue{
                        background-color: #0004f7;
                    }
                </style>
            </head>
            <body>
                <h1>Color Map Rules table</h1>
                <table>
                    <thead>
                        <tr>
                            <th>range</th>
                            <th>color</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>$ \\{ x \\mid x >= 0 \\cap x < 5 \\} $</td>
                            <td class="yellow">Yellow</td>
                        </tr>
                        <tr>
                            <td>$ \\{ x \\mid x >= 5 \\cap x < 10 \\} $</td>
                            <td class="red">Red</td>
                        </tr>
                        <tr>
                            <td>$ \\{ x \\mid x >= 10 \\cap x < 15 \\} $</td>
                            <td class="green">Green</td>
                        </tr>
                        <tr>
                            <td>$ \\{ x \\mid x >= 15 \\} $</td>
                            <td class="blue">Blue</td>
                        </tr>
                    </tbody>
                </table>    
                
                <form action="/" method="GET">
                    <label for="nombre">Filter by name:</label>
                    <select id="name" name="name">
                        ${selectOptions}
                    </select>
                    <input type="submit" value="Filter">
                </form>
                <h1>Datas table</h1>
            
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Iteraciones</th>                    
                            <th>mu_d</th>
                            <th>mu_s</th>
                            <th>mu_w</th>
                            <th>mu_b</th>
                            <th>volumen</th>
                            <th>ae_n</th>
                            <th>Color Map</th>
                            <th>Specular Map</th>
                        </tr>
                    </thead>
                    <tbody>                
                `;
                datafilters.forEach(item => {
                    html += `<tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.ite}</td>
                        <td>${item.mu_d}</td>
                        <td>${item.mu_s}</td>
                        <td>${item.mu_w}</td>
                        <td>${item.mu_b}</td>
                        <td>${item.v}</td>
                        <td>${item.ae_n}</td>
                        <td><img src="${item.img_ae_n}"></td>
                        <td><img src="${item.img_specular}"></td>
                    </tr>`;
                });
                html += `
                        </table>
                    </body>
                    </html>`;
        
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
