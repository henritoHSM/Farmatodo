const firebaseConfig = {
  apiKey: "AIzaSyARN8oqjMwd2MuJ0v1oBxZgjZJZwTGAyPY",
  authDomain: "mi-farmacia-374f6.firebaseapp.com",
  projectId: "mi-farmacia-374f6",
  storageBucket: "mi-farmacia-374f6.firebasestorage.app",
  messagingSenderId: "234109909320",
  appId: "1:234109909320:web:bea022db41aee2b767db7d"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const coleccionMedicamentos = db.collection("Medicamentos ");
let idEditando = null;

async function guardarMedicamentos() {
  
  const nombre = document.getElementById("nombre").value;
const presentacion = document.getElementById("presentacion").value;
const dosis = document.getElementById("dosis").value;
const precio = document.getElementById("precio").value;
const estado = document.getElementById("estado").value;
const fecha = document.getElementById("fecha").value;
if (!nombre || !presentacion || !dosis || !precio) {
    mostrarToast("⚠️ Por favor llena nombre, presentación, dosis y precio");
    return;
}
if (estado === "Próximamente" && !fecha) {
    mostrarToast("⚠️ Por favor indica la fecha de llegada");
    return;
}
const nuevoMedicamento = {
  Nombre: nombre,
  Presentacion: presentacion,
  Dosis: dosis,
  Precio: precio,
  Estado: estado,
  Fecha: fecha
}
const duplicado = medicamentos.find(function(med){
    return med.Nombre.toLowerCase() === nombre.toLowerCase() 
        && med.Dosis.toLowerCase() === dosis.toLowerCase()
});
if (duplicado && idEditando === null) {
    mostrarToast("⚠️ Este medicamento ya existe");
    return;
}
if (idEditando===null) {  
 await coleccionMedicamentos.add(nuevoMedicamento)
 mostrarToast("✅ Medicamento guardado correctamente");
} else {
  await coleccionMedicamentos.doc(idEditando).update(nuevoMedicamento)
  mostrarToast("✅ Medicamento actualizado correctamente");
  idEditando = null;
}
cargarAdmin();
document.getElementById("nombre").value = ""
document.getElementById("presentacion").value = ""
document.getElementById("dosis").value = ""
document.getElementById("precio").value = ""
document.getElementById("fecha").value = ""
}

const guardar = document.getElementById('guardar')
guardar.addEventListener('click', function(event) {
  guardarMedicamentos();
  
})
//para sacar los medicamentos de firestore
let medicamentos = []

async function cargarAdmin() {
  medicamentos = []
const snapshot = await coleccionMedicamentos.get();

snapshot.docs.forEach(function(doc){
  medicamentos.push({...doc.data(), id: doc.id})
})
mostrarMedicamentos(medicamentos);
}

function mostrarMedicamentos(lista){
  const container = document.getElementById('lista-admin')
  container.innerHTML=""
  lista.forEach(function(medicamento){
    container.innerHTML+= `
    <div class="tarjeta">
    <h3>${medicamento.Nombre}</h3>
    <p>${medicamento.Presentacion} • ${medicamento.Dosis}</p>
    <p>${medicamento.Precio} CUP</p>
    <p class="${medicamento.Estado === 'Disponible' ? 'disponible' : 'proximamente'}">
    ${medicamento.Estado === 'Disponible' ? '✅ Disponible' : '🕐 ' + medicamento.Fecha}
</p>
<button class="btn-eliminar" data-id="${medicamento.id}">Eliminar</button>
<button class="btn-editar" data-id="${medicamento.id}">Editar</button>
</div>`

  })
  
}
//Para eliminar y editar las tarjetas de medicamentos
document.getElementById('lista-admin').addEventListener('click', function(event){
  if (event.target.dataset.id && event.target.textContent === "Eliminar") {
    const eliminar = event.target.dataset.id
    eliminarMedicamento(eliminar);
  } else if(event.target.dataset.id && event.target.textContent === "Editar"){
    const editar = event.target.dataset.id
    window.scrollTo(0, 0);
    idEditando=editar
    const encontrado = medicamentos.find(function(med){
      return med.id === editar
    })
    document.getElementById("nombre").value = encontrado.Nombre;
document.getElementById("presentacion").value = encontrado.Presentacion;
document.getElementById("dosis").value = encontrado.Dosis;
document.getElementById("precio").value = encontrado.Precio;
document.getElementById("estado").value = encontrado.Estado;
document.getElementById("fecha").value = encontrado.Fecha
  } else {
  }
})

async function eliminarMedicamento (eliminar) {
 await coleccionMedicamentos.doc(eliminar).delete()
 mostrarToast("🗑️ Medicamento eliminado");
 cargarAdmin();
} 

const buscadorAdmin = document.getElementById("buscador-admin");
buscadorAdmin.addEventListener('input', function(event){
    const texto = event.target.value;
    const filtrados = medicamentos.filter(function(medicamento){
        return medicamento.Nombre.toLowerCase().includes(texto.toLowerCase());
    });
    mostrarMedicamentos(filtrados);
});

cargarAdmin();

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("mostrar");
    setTimeout(function(){
        toast.classList.remove("mostrar");
    }, 3000);
}


