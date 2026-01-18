console.log("🗺️ Map Script Loaded");
console.log("Listing data:", listing);
console.log("Geometry:", listing.geometry);
console.log("Coordinates:", listing.geometry?.coordinates);

if (
  listing.geometry &&
  listing.geometry.coordinates &&
  Array.isArray(listing.geometry.coordinates) &&
  listing.geometry.coordinates.length === 2
) {
  try {
    mapboxgl.accessToken = mapToken;
    console.log("✅ MapBox token set");

    const coordinates = listing.geometry.coordinates;
    console.log(`📍 Setting map center to: [${coordinates[0]}, ${coordinates[1]}]`);

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates,
      zoom: 12,
    });

    console.log("✅ Map created");

    map.on("load", () => {
      console.log("✅ Map loaded");
      map.resize();
    });

    new mapboxgl.Marker({ color: "#fe424d" })
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`
        )
      )
      .addTo(map);

    console.log("✅ Marker added");
  } catch (error) {
    console.error("❌ Error creating map:", error);
  }
} else {
  console.error("❌ Map not rendered - Missing or invalid geometry data");
  console.log("Available data:", {
    hasListing: !!listing,
    hasGeometry: !!listing.geometry,
    hasCoordinates: !!listing.geometry?.coordinates,
    isArray: Array.isArray(listing.geometry?.coordinates),
    length: listing.geometry?.coordinates?.length
  });
}
