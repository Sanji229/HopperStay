const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const MONGO_URL = process.env.ATLASDB_URL;
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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

const fixListings = async () => {
  try {
    // 1️⃣ Find or create user "Sanjilka Saxena"
    let user = await User.findOne({ username: "Sanjilka Saxena" });
    
    if (!user) {
      console.log("User 'Sanjilka Saxena' not found. Creating new user...");
      user = new User({
        username: "Sanjilka Saxena",
        email: "sanjilka@example.com",
      });
      await User.register(user, "defaultPassword123"); // Change this password
      console.log("✅ User created: Sanjilka Saxena");
    } else {
      console.log("✅ User found: Sanjilka Saxena");
    }

    // 2️⃣ Get all listings
    const listings = await Listing.find({});
    console.log(`\n📋 Found ${listings.length} listings to update`);

    // 3️⃣ Update each listing
    let successCount = 0;
    let failCount = 0;

    for (let listing of listings) {
      try {
        // Update owner
        listing.owner = user._id;

        // Geocode location if coordinates are [0, 0]
        if (
          !listing.geometry ||
          !listing.geometry.coordinates ||
          (listing.geometry.coordinates[0] === 0 &&
            listing.geometry.coordinates[1] === 0)
        ) {
          console.log(`🔍 Geocoding: ${listing.title} (${listing.location}, ${listing.country})`);

          const geoData = await geocodingClient
            .forwardGeocode({
              query: `${listing.location}, ${listing.country}`,
              limit: 1,
            })
            .send();

          if (geoData.body.features.length > 0) {
            listing.geometry = geoData.body.features[0].geometry;
            console.log(`   ✅ Coordinates: ${listing.geometry.coordinates}`);
          } else {
            console.log(`   ⚠️  Could not geocode: ${listing.location}`);
          }

          // Add a small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        await listing.save();
        successCount++;
      } catch (err) {
        console.error(`❌ Error updating ${listing.title}:`, err.message);
        failCount++;
      }
    }

    console.log(`\n✨ Update complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`\n🎉 All listings are now owned by: Sanjilka Saxena`);
    console.log(`🗺️  Map locations have been fixed!`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

fixListings();
