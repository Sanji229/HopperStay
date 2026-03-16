const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Rules: each amenity maps to keywords found in title/description/location/category
const amenityRules = {
  "Free WiFi": () => true, // everyone gets WiFi
  "Kitchen": (text) =>
    !text.includes("hotel") && !text.includes("safari lodge"),
  "TV": (text) =>
    text.includes("apartment") ||
    text.includes("loft") ||
    text.includes("penthouse") ||
    text.includes("villa") ||
    text.includes("cabin") ||
    text.includes("cottage") ||
    text.includes("chalet") ||
    text.includes("bungalow") ||
    text.includes("city") ||
    text.includes("tokyo") ||
    text.includes("miami") ||
    text.includes("boston") ||
    text.includes("castle") ||
    text.includes("brownstone"),
  "Washer": (text) =>
    text.includes("apartment") ||
    text.includes("loft") ||
    text.includes("penthouse") ||
    text.includes("villa") ||
    text.includes("cottage") ||
    text.includes("bungalow") ||
    text.includes("brownstone") ||
    text.includes("chalet"),
  "Pool": (text) =>
    text.includes("pool") ||
    text.includes("villa") ||
    text.includes("resort") ||
    text.includes("luxury") ||
    text.includes("maldives") ||
    text.includes("dubai") ||
    text.includes("bali") ||
    text.includes("phuket") ||
    text.includes("penthouse") ||
    text.includes("island"),
  "Air Conditioning": (text) =>
    text.includes("tropical") ||
    text.includes("beach") ||
    text.includes("bali") ||
    text.includes("phuket") ||
    text.includes("dubai") ||
    text.includes("cancun") ||
    text.includes("miami") ||
    text.includes("maldives") ||
    text.includes("fiji") ||
    text.includes("costa rica") ||
    text.includes("greece") ||
    text.includes("apartment") ||
    text.includes("penthouse") ||
    text.includes("loft") ||
    text.includes("tokyo"),
  "Heating": (text) =>
    text.includes("mountain") ||
    text.includes("cabin") ||
    text.includes("chalet") ||
    text.includes("ski") ||
    text.includes("aspen") ||
    text.includes("alpine") ||
    text.includes("switzerland") ||
    text.includes("scotland") ||
    text.includes("banff") ||
    text.includes("montana") ||
    text.includes("alaska") ||
    text.includes("arctic") ||
    text.includes("new hampshire") ||
    text.includes("castle") ||
    text.includes("cottage") ||
    text.includes("log cabin"),
  "Free Parking": (text) =>
    !text.includes("new york") &&
    !text.includes("tokyo") &&
    !text.includes("amsterdam") &&
    !text.includes("downtown") &&
    !text.includes("loft"),
  "Beachfront": (text) =>
    text.includes("beachfront") ||
    text.includes("beach front") ||
    (text.includes("beach") && (text.includes("ocean") || text.includes("sandy") || text.includes("shore") || text.includes("step out"))),
  "Mountain View": (text) =>
    text.includes("mountain view") ||
    text.includes("mountain") ||
    text.includes("alpine") ||
    text.includes("banff") ||
    text.includes("aspen") ||
    text.includes("cabin") ||
    text.includes("chalet") ||
    text.includes("highland"),
  "Gym": (text) =>
    text.includes("luxury") ||
    text.includes("penthouse") ||
    text.includes("resort") ||
    text.includes("villa") ||
    text.includes("dubai") ||
    text.includes("maldives") ||
    text.includes("art deco") ||
    text.includes("loft"),
  "Pet Friendly": (text) =>
    text.includes("cabin") ||
    text.includes("farm") ||
    text.includes("ranch") ||
    text.includes("countryside") ||
    text.includes("cottage") ||
    text.includes("montana") ||
    text.includes("treehouse") ||
    text.includes("lake") ||
    text.includes("nature") ||
    text.includes("forest") ||
    text.includes("serengeti"),
};

function assignAmenities(listing) {
  const text =
    `${listing.title} ${listing.description} ${listing.location} ${listing.country} ${listing.category || ""}`.toLowerCase();

  const amenities = [];
  for (const [amenity, ruleFn] of Object.entries(amenityRules)) {
    if (ruleFn(text)) {
      amenities.push(amenity);
    }
  }
  return amenities;
}

const addAmenities = async () => {
  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings to update`);

  for (let listing of listings) {
    // Only update listings that have no amenities set
    if (!listing.amenities || listing.amenities.length === 0) {
      const amenities = assignAmenities(listing);
      listing.amenities = amenities;
      await listing.save();
      console.log(`✅ ${listing.title} -> [${amenities.join(", ")}]`);
    } else {
      console.log(`⏩ ${listing.title} already has amenities, skipping.`);
    }
  }

  console.log("\n🎉 All listings updated with amenities!");
  mongoose.connection.close();
};

addAmenities();
