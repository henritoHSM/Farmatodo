//Configuracion de FireBase
   
//import { initializeApp } from "./firebase-app.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARN8oqjMwd2MuJ0v1oBxZgjZJZwTGAyPY",
  authDomain: "mi-farmacia-374f6.firebaseapp.com",
  projectId: "mi-farmacia-374f6",
  storageBucket: "mi-farmacia-374f6.firebasestorage.app",
  messagingSenderId: "234109909320",
  appId: "1:234109909320:web:bea022db41aee2b767db7d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//Importar Firestore
//import { getFirestore, collection, getDocs } from "./firebase-firestore.js";

const db = firebase.firestore();
const coleccionMedicamentos = db.collection("Medicamentos ");
let medicamentos = []
const buscador = document.getElementById("buscador")

 async function cargarMedicamentos() {
   setTimeout(function(){
    if(medicamentos.length === 0){
        document.querySelector("section p").textContent = "⚠️ Sin conexión. Intenta de nuevo más tarde.";
    }
}, 15000);
  try {
    const snapshot = await coleccionMedicamentos.get();
    medicamentos = []
    snapshot.docs.forEach(function(doc) {
      medicamentos.push(doc.data());
    })
    mostrarMedicamentos(medicamentos)
  } catch (error) {
    document.querySelector("section p").textContent = "⚠️ Sin conexión. Intenta de nuevo más tarde.";
  }
}

 function mostrarMedicamentos(lista){
   
   const container = document.getElementById("lista-medicamentos");
   container.innerHTML = ""
   document.querySelector("section p").style.display = "none";
   lista.forEach(function(medicamento){container.innerHTML+=`
<div class="tarjeta">
    <h3>${medicamento.Nombre}</h3>
    <p>${medicamento.Presentacion} • ${medicamento.Dosis}</p>
    <p>${medicamento.Precio} CUP</p>
    <p class="${medicamento.Estado === 'Disponible' ? 'disponible' : 'proximamente'}">
    ${medicamento.Estado === 'Disponible' ? '✅ Disponible' : '🕐 ' + medicamento.Fecha}
</p>
    <a class="btn-whatsapp" href="https://wa.me/+5358270890?text=Hola,%20quiero%20comprar%20${medicamento.Nombre}" target="_blank">Pedir por WhatsApp</a>
</div>
`})
 };

cargarMedicamentos();

buscador.addEventListener('input', function(event){
  const texto = event.target.value
  const filtrados = medicamentos.filter(function(medicamento){
    return medicamento.Nombre.toLowerCase().includes(texto.toLowerCase())
  })
mostrarMedicamentos(filtrados);
})
