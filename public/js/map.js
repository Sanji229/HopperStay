if (
  listing.geometry &&
  Array.isArray(listing.geometry.coordinates) &&
  listing.geometry.coordinates.length === 2
) {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9,
  });

  map.on("load", () => map.resize());

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset:25}).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking.</p>`
      )
    )
    .addTo(map);
} else {
  console.warn("Map not rendered: geometry missing");
}
