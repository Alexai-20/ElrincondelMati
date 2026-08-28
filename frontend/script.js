async function cargar(){
 const r=await fetch('/productos');
 const data=await r.json();
 lista.innerHTML="";
 data.forEach(p=>{
 lista.innerHTML+=`<li>${p.nombre} - $${p.precio}
 <button onclick="eliminar(${p.id})">Eliminar</button></li>`;
 });
}

async function crear(){
 await fetch('/productos',{
 method:'POST',
 headers:{'Content-Type':'application/json'},
 body:JSON.stringify({
 nombre:nombre.value,
 precio:precio.value
 })
 });
 cargar();
}

async function eliminar(id){
 await fetch('/productos/'+id,{method:'DELETE'});
 cargar();
}

cargar();