(function () {
  var placesAutocomplete = places({
    appId: "pl8WSTRA9Y32",
    apiKey: "d5bb4482d2253b3f9c4c20e05e7c277b",
    container: document.querySelector("#address-input"),
    countries: ["fr"],
  });

  const updateForm = (e) => {
    console.log("event", e);
    const postcodeEl = document.querySelector("[name='postcode']");
    const streetEl = document.querySelector("[name='street']");
    const cityEl = document.querySelector("[name='city']");
    const countryEl = document.querySelector("[name='country']");
    const areaEl = document.querySelector("[name='area']");

    postcodeEl.value = e.suggestion.postcode;
    streetEl.value = e.suggestion.name;
    cityEl.value = e.suggestion.county;
    countryEl.value = e.suggestion.country;
    areaEl.value = e.suggestion.administrative;
  };

  //   placesAutocomplete.on("change", updateForm);

  var map = L.map("map-example-container", {
    scrollWheelZoom: false,
    zoomControl: false,
  });

  var osmLayer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      minZoom: 1,
      maxZoom: 13,
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );

  var markers = [];

  map.setView(new L.LatLng(47, 2), 5);
  map.addLayer(osmLayer);

  placesAutocomplete.on("suggestions", handleOnSuggestions);
  placesAutocomplete.on("cursorchanged", handleOnCursorchanged);
  placesAutocomplete.on("change", handleOnChange);
  placesAutocomplete.on("clear", handleOnClear);

  function handleOnSuggestions(e) {
    markers.forEach(removeMarker);
    markers = [];

    if (e.suggestions.length === 0) {
      map.setView(new L.LatLng(0, 0), 1);
      return;
    }

    e.suggestions.forEach(addMarker);
    findBestZoom();
  }

  function handleOnChange(e) {
    updateForm(e);
    markers.forEach(function (marker, markerIndex) {
      if (markerIndex === e.suggestionIndex) {
        markers = [marker];
        marker.setOpacity(1);
        findBestZoom();
      } else {
        removeMarker(marker);
      }
    });
  }

  function handleOnClear() {
    map.setView(new L.LatLng(0, 0), 1);
    markers.forEach(removeMarker);
  }

  function handleOnCursorchanged(e) {
    markers.forEach(function (marker, markerIndex) {
      if (markerIndex === e.suggestionIndex) {
        marker.setOpacity(1);
        marker.setZIndexOffset(1000);
      } else {
        marker.setZIndexOffset(0);
        marker.setOpacity(0.5);
      }
    });
  }

  function addMarker(suggestion) {
    var marker = L.marker(suggestion.latlng, { opacity: 0.4 });
    marker.addTo(map);
    markers.push(marker);
  }

  function removeMarker(marker) {
    map.removeLayer(marker);
  }

  function findBestZoom() {
    var featureGroup = L.featureGroup(markers);
    map.fitBounds(featureGroup.getBounds().pad(0.5), { animate: true });
  }
})();
