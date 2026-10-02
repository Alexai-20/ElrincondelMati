const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.disable('x-powered-by');

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());
app.use(express.static('frontend'));

const CSRF_COOKIE = 'csrf-token';

// Genera y entrega un token CSRF
function obtenerTokenCSRF(req, res, next) {
    let token = req.headers.cookie
        ?.split(';')
        .find(c => c.trim().startsWith(`${CSRF_COOKIE}=`))
        ?.split('=')[1];

    if (!token) {
        token = crypto.randomBytes(32).toString('hex');

        res.setHeader(
            'Set-Cookie',
            `${CSRF_COOKIE}=${token}; Path=/; SameSite=Strict`
        );
    }

    req.csrfToken = token;
    next();
}

// Valida el token CSRF enviado por el cliente
function validarCSRF(req, res, next) {
    const token = req.headers['x-csrf-token'];

    if (!token || token !== req.csrfToken) {
        return res.status(403).json({
            error: 'Token CSRF inválido o ausente'
        });
    }

    next();
}

app.use(obtenerTokenCSRF);

let productos = [
    {
        id: 1,
        nombre: "Mate Tradicional",
        precio: 2500
    },
    {
        id: 2,
        nombre: "Café Latte",
        precio: 3500
    }
];

// Obtener productos
app.get('/productos', (req, res) => {
    res.json(productos);
});

// Crear producto
app.post('/productos', validarCSRF, (req, res) => {
    const producto = {
        id: Date.now(),
        ...req.body
    };

    productos.push(producto);

    res.json(producto);
});

// Actualizar producto
app.put('/productos/:id', validarCSRF, (req, res) => {
    const id = parseInt(req.params.id);

    productos = productos.map(p =>
        p.id === id
            ? { ...p, ...req.body }
            : p
    );

    res.json({
        mensaje: "Producto actualizado"
    });
});

// Eliminar producto
app.delete('/productos/:id', validarCSRF, (req, res) => {
    productos = productos.filter(
        p => p.id != req.params.id
    );

    res.json({
        mensaje: "Producto eliminado"
    });
});

app.listen(3000, () => {
    console.log("Servidor activo en puerto 3000");
});