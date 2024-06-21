import { initMap } from "./modules/map.js";
import { addMarkers } from "./modules/markers.js";
import { setStores, updateStoreList, setFilter } from "./modules/stores.js";

let myCoords = {
  lat: 42.646184,
  lng: 12.932628,
  zoom: 6
}

/* Pulsanti per filtrare categorie */ 
let buttons = Array.from(document.querySelectorAll('.category-buttons-container button'));
const categoryFiltersContainer = document.querySelector('.category-buttons-container');

categoryFiltersContainer.addEventListener('click', (e) => {
  let pressedButton = e.target.closest('button');
  if(pressedButton) {
    pressedButton.classList.add('active');
    let otherButtons = buttons.filter(button => button !== pressedButton);
    otherButtons.forEach(button => button.classList.remove('active'));
    /* Chiamo la funzione setFilter per impostare un filtro sulla categoria 
     corrispondente al pulsante premuto */
    setFilter('category', pressedButton.dataset.filter);
  }
})

/* Input per filtrare negozi */ 
const searchStore = document.querySelector('#search-store');
const clearInputButton = document.querySelector('#clear-input');

searchStore.addEventListener('keyup', () => processInput());
clearInputButton.addEventListener('click', () => clearInput());

function processInput() {
  let userInput = searchStore.value.toLowerCase();
  /* Chiamo setFilter per impostare il filtro in base al testo inserito nell'input */
  setFilter('searchTerm', userInput);
}

function clearInput() {
  searchStore.value = '';
  processInput();
}


// Inizializzazione dell'applicazione
async function initApp() {
  try {
    let stores = await fetch('stores.json')
      .then(res => res.json())
      .then(data => data.stores)
    let map = initMap(myCoords.lat,myCoords.lng, myCoords.zoom);
    // Aggiungo i marker alla mappa
    addMarkers(map, stores);
    // Inizializzo gli stores
    setStores(stores);
    // Mostro gli stores nella UI
    updateStoreList(stores)
  } catch(err) {
    console.log(err);
    document.querySelector('#map').innerHTML = `
      <h1>Sorry, something went wrong</h1>
    `
  }
}

initApp();