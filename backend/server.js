const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

let productos = [
 {id:1,nombre:"Mate Tradicional",precio:2500},
 {id:2,nombre:"Café Latte",precio:3500}
];

app.get('/productos',(req,res)=>{
 res.json(productos);
});

app.post('/productos',(req,res)=>{
 const producto={id:Date.now(),...req.body};
 productos.push(producto);
 res.json(producto);
});

app.put('/productos/:id',(req,res)=>{
 const id=parseInt(req.params.id);
 productos=productos.map(p=>p.id===id?{...p,...req.body}:p);
 res.json({mensaje:"Producto actualizado"});
});

app.delete('/productos/:id',(req,res)=>{
 productos=productos.filter(p=>p.id!=req.params.id);
 res.json({mensaje:"Producto eliminado"});
});

app.listen(3000,()=>console.log("Servidor activo en puerto 3000"));