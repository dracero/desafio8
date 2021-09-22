const express = require('express')
const handlebars = require('express-handlebars')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const apiprod = require('./api/productos')
const apimsj = require('./api/mensajes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'))

app.engine('hbs',handlebars({
  extname: '.hbs',
  layoutsDir: __dirname + '/views/layouts', 
}))
app.set('view engine','hbs')
app.set('views', './views');


//Rutas 
app.get('/',(req,res)=>{
  res.render('form',{layout: 'index'})
})
app.use('/productos',require('./rutas/rutas'))

//Rutas API
app.use('/api/productos', require('./rutas/rutapi'))

//Sockets
io.on('connect', async (socket) =>{

  socket.emit('productos',apiprod.getAll())
  socket.on('productos:update', () =>{
      io.sockets.emit('productos',apiprod.getAll())
    }
  )
    
  socket.emit('mensajes',await apimsj.getMessage())
  socket.on('mensajes:nuevo',async (mensaje) => {
      await apimsj.save(mensaje)
      io.sockets.emit('mensajes', await apimsj.getMessage())
  })
})

// Middleware para manejar errores
app.use((error, req, res, next) => {
  res.status(error.code || 500).json({ error : error.message })
})

const puerto = 8080

const server = http.listen(puerto, () => {
  console.log(`servidor escuchando en http://localhost:${puerto}`)
})

server.on('error', error => {
  console.log('error en el servidor:', error)
})
