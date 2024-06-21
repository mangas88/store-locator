let map, infoWindow;

function initMap(lat, lng, zoom) {
  // Creiamo un mappa, passando le coordinate e lo zoom
  map = new google.maps.Map(document.querySelector("#map"), {
    center: {
      lat,
      lng
    },
    zoom,
  });
  // Creiamo una infowindow
  infoWindow = new google.maps.InfoWindow();

  return map;
}

/* Funzione per collegare la infowindow al marker,
  popolando il contenuto con le informazioni relative allo store
*/ 
function bindInfoWindow(marker, content) {
  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent(content)
    infoWindow.open(map, marker);
  });
}

// Facciamo un "getter": passiamo la mappa a chi la richiede.
function getMap() {
  return map;
}

function setMap(lat, lng, zoom) {
  map.setOptions({
    center: {
      lat,
      lng
    },
    zoom
  })
}

export {initMap, bindInfoWindow, getMap, setMap}