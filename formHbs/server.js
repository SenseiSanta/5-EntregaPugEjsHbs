/*=================== MODULOS ===================*/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const Contenedor = require('./src/pages/Contenedor')

/*======= Instancia de Server y contenedor =======*/
const app = express();
const caja = new Contenedor('./DB/products.json');

/*================= Middlewears =================*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

/*============= Motor de plantillas =============*/
app.engine('hbs', exphbs.engine({
    defaulyLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

/*==================== Rutas ====================*/

app.get('/formulario', async (req, res) => {
    const DB_PRODUCTOS = await caja.getAll()
    res.render('vista-form', {DB_PRODUCTOS})
})

app.post('/formulario', async (req, res) => {
    console.log(await caja.save(req.body)) 
    res.redirect('/formulario')
})

app.get('/productos', async (req, res) => {
    const DB_PRODUCTOS = await caja.getAll()
    res.render('vista-prod', {DB_PRODUCTOS})
})

app.get('*', (req, res) => {
    res.send('url erronea')
})

/*================== Servidor ==================*/
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en el servidor: ${error}`))