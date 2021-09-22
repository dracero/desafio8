const express = require('express')
const router = express.Router()
const prod = require('../api/productos')



router.get('/vista',(req,res)=>{
    const productos = prod.getAll()
    res.render('vista',{ layout: 'index',productos: productos, hayProductos:  productos.length ? true : false})
  })

module.exports= router