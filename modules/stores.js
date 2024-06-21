import { refreshMarkers } from "./markers.js";
import { getMap, setMap } from "./map.js";

const storeListContainer = document.querySelector('#stores-list');
// In questo array metteremo tutti gli stores provenienti dal file .json
let stores = [];

// Funzione per importare gli stores
function setStores(storesList) {
  stores = storesList;
}

/* LOGICA FILTRI */
// Voglio creare una "catena" di filtri
// STORES ----***-----***-----***----***----***--- FILTEREDSTORES
// Gli asterischi *** rappresentano una funzione che prende un elenco di negozi,
// li filtra e ritorna il risultato filtrato.
// function(stores) {
  // logica del filtro ...
  // return filteredStores
// }
// In questo modo posso aggiungere quanti filtri voglio!

// Ogni tipologia di filtro viene inserita in questo oggetto:
// Al momento vogliamo filtrare per categoria e per testo inserito nell'input
let filterParams = {
  category: 'all',
  searchTerm: ''
}

// Questa è la funzione che esportiamo, in modo da richiamarla nel codice
// nel momento in cui vogliamo impostare un filtro
function setFilter(filter, value) {
  // aggiorniamo l'oggetto che contiene i filtri
  updateFilterParam(filter, value);
  // otteniamo l'elenco di negozi filtrati
  let filteredStores = applyFilter();
  // aggiorniamo la UI
  updateStoreList(filteredStores);
  // Adesso possiamo aggiornare anche i markers sulla mappa!
  // Prendiamo la mappa
  let map = getMap();
  // Aggiorniamo i markers, in modo da visualizzare quelli corrispondenti ai negozi filtrati
  refreshMarkers(map, filteredStores)
}

// Con questa funzione possiamo aggiornare l'elenco di filtri, inserendo i nuovi valori.
// Praticamente copiamo il vecchio elenco di filtri e modifichiamo una delle proprietà
function updateFilterParam(filter, value) {
  filterParams = {
    ...filterParams,
    [filter]: value
  }
}

// Questa funzione rappresenta il flusso a cascata dei vari filtri:
// Si comincia prendendo l'array completo di negozi e lo si passa ai vari filtri.
function applyFilter() {
  let filteredStores = stores;
  // Filtro per categoria (solo se non è stato selezionato il pulsante "all")
  if(filterParams.category !== 'all') {
    filteredStores = filteredStores.filter(
      // Ritorno solo i negozi che rientrano nella categoria selezionata
      store => store.categories.includes(filterParams.category)
    );
  }
  // Filtro in base a quanto è stato inserito nell'input di ricerca
  if(filterParams.searchTerm !== '') {
    filteredStores = filteredStores.filter(
      store => 
        // ritorno i negozi il cui nome o indirizzo include il termine di ricerca dell'input
        store.name.toLowerCase().includes(filterParams.searchTerm) || 
        store.address.toLowerCase().includes(filterParams.searchTerm)
    )
  }
  // Alla fine ritorno i negozi filtrati.
  return filteredStores;
}

/* MODIFICHE AL DOM */
function updateStoreList(stores) {
  // Svuotiamo il contenitore
  storeListContainer.innerHTML = '';
  // Per ogni negozio, creo un nuovo div con tutti i dettagli
  stores.forEach(store => {
    let storeDetailsContainer = document.createElement('div');
    storeDetailsContainer.classList.add('store');
    storeDetailsContainer.addEventListener('click', () => {
      // TODO: implementare funzione di zoom sul negozio.
      setMap(store.coords.lat, store.coords.lng, 15)
    });
  
    let name = document.createElement('h3');
    name.textContent = store.name;
    let address = document.createElement('p');
    address.textContent = store.address;
    let email = document.createElement('p');
    email.textContent = store.email;
    let phone = document.createElement('p');
    phone.textContent = store.phone;
    let link = document.createElement('a');
    link.textContent = 'Directions';
    link.href = `https://www.google.com/maps?saddr=My+Location&daddr=${store.coords.lat},${store.coords.lng}`;
    link.target = '_blank';
    // Metto tutte le info nel div
    storeDetailsContainer.appendChild(name);
    storeDetailsContainer.appendChild(address);
    storeDetailsContainer.appendChild(phone);
    storeDetailsContainer.appendChild(email);
    storeDetailsContainer.appendChild(link);
    // Aggiungo il div al contenitore
    storeListContainer.appendChild(storeDetailsContainer);
  })
}

export {setStores, updateStoreList, setFilter}