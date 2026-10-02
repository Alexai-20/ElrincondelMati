let csrfToken = '';

async function obtenerTokenCSRF() {
    // Realiza una petición inicial para que el servidor genere la cookie CSRF
    await fetch('/productos');

    const cookies = document.cookie.split(';');

    const csrfCookie = cookies.find(cookie =>
        cookie.trim().startsWith('csrf-token=')
    );

    if (csrfCookie) {
        csrfToken = csrfCookie.split('=')[1];
    }
}

async function cargar() {
    const r = await fetch('/productos');
    const data = await r.json();

    lista.innerHTML = "";

    data.forEach(p => {
        lista.innerHTML += `
            <li>
                ${p.nombre} - $${p.precio}
                <button onclick="eliminar(${p.id})">
                    Eliminar
                </button>
            </li>
        `;
    });
}

async function crear() {
    await fetch('/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
            nombre: nombre.value,
            precio: precio.value
        })
    });

    cargar();
}

async function eliminar(id) {
    await fetch('/productos/' + id, {
        method: 'DELETE',
        headers: {
            'X-CSRF-Token': csrfToken
        }
    });

    cargar();
}

async function iniciar() {
    await obtenerTokenCSRF();
    await cargar();
}

iniciar();