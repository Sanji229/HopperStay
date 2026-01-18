const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const checkCoordinates = async () => {
  try {
    const listings = await Listing.find({}).limit(5);
    
    console.log("\n📍 Checking coordinates for first 5 listings:\n");
    
    for (let listing of listings) {
      console.log(`\n${listing.title}`);
      console.log(`  Location: ${listing.location}, ${listing.country}`);
      console.log(`  Geometry:`, listing.geometry);
      
      if (listing.geometry && listing.geometry.coordinates) {
        const [lng, lat] = listing.geometry.coordinates;
        console.log(`  Coordinates: [${lng}, ${lat}] (lng, lat)`);
        console.log(`  Google Maps: https://www.google.com/maps?q=${lat},${lng}`);
      } else {
        console.log(`  ⚠️  NO COORDINATES FOUND!`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

checkCoordinates();
