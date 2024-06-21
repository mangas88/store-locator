import { bindInfoWindow } from "./map.js";

let markers = [];
let markerClusterer = '';

// Funzione per aggiungere i markers alla mappa
function addMarkers(map, stores) {
  // console.log(map, stores);
  stores.forEach(store => {
    // Per ogni store creiamo il marker
    // Documentazione marker: https://developers.google.com/maps/documentation/javascript/markers
    let marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position:  store.coords,
      map,
    });
    // Aggiungiamo anche il collegamento alla infowindow
    bindInfoWindow(marker, createMarkerDetails(store));
    // Adesso possiamo aggiungere il marker all'elenco di markers
    markers.push(marker);
  });

  // Usiamo il clusterer per raggruppare i markers vicini
  // Documentazione sui clusterer: https://developers.google.com/maps/documentation/javascript/marker-clustering
  markerClusterer = new MarkerClusterer(map, markers, {
    gridSize: 50,
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
}

// Funzione per nascondere i markers
function hideMarkers() {
  markers.map(marker => marker.setMap(null));
  // Se i markers sono raggruppati in un clusterer, svuotiamo anche quello!
  if(markerClusterer) {
    markerClusterer.clearMarkers();
  }
}

function refreshMarkers(map, stores) {
  // nascondiamo i markers
  hideMarkers();
  // Nuovo ciclo con marker filtrati in base alle coordinate degli stores da visualizzare
  let activeMarkers = markers.filter(marker => {
    // Prendo le coordinate del marker
    let markerPosition = marker.getPosition().toJSON();
    // Trovo lo store che corrisponde al marker in base alle coordinate
    let activeMarker = stores.find(store => 
      store.coords.lat === markerPosition.lat &&
      store.coords.lng === markerPosition.lng
    )
    // Se trovo la corrispondenza, mostro il marker sulla mappa
    if(activeMarker) {
      marker.setMap(map);
      return true;
    }
    return false;
  });
  // utilizziamo anche il clusterer per raggruppare i marker
  markerClusterer.addMarkers(activeMarkers);
}

// Creiamo il contenuto da visualizzare nella infoWindow
function createMarkerDetails(store) {
  return `
    <h3>${store.name}</h3>
    <p>${store.address}</p>
    <p>${store.email}</p>
    <p>${store.phone}</p>
    <a href="https://www.google.com/maps?saddr=My+Location&daddr=${store.coords.lat},${store.coords.lng}" target="_blank">Directions</a>
  `
}

export {addMarkers, refreshMarkers}