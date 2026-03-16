const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

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

// Keywords to match categories
const categoryKeywords = {
  "Beach": ["beach", "ocean", "sea", "coastal", "seaside", "surf", "island", "tropical", "waterfront", "bay"],
  "Mountains": ["mountain", "hill", "alpine", "peak", "highlands", "valley", "hiking", "trek", "summit"],
  "Camping": ["camp", "tent", "outdoor", "wilderness", "nature", "forest", "woods", "glamping"],
  "Farms": ["farm", "rural", "countryside", "barn", "ranch", "vineyard", "agricultural", "cottage"],
  "Arctic": ["arctic", "snow", "ice", "winter", "frozen", "cold", "nordic", "alaska", "glacier"],
  "Castles": ["castle", "palace", "manor", "historic", "medieval", "royal", "fortress", "heritage"],
  "Amazing Pools": ["pool", "swim", "resort", "luxury", "spa", "villa"],
  "Iconic Cities": ["city", "urban", "downtown", "metropolitan", "skyline", "apartment", "loft", "penthouse"],
  "Rooms": ["room", "studio", "cozy", "private", "guest", "suite", "accommodation"],
  "Boats": ["boat", "yacht", "ship", "houseboat", "cruise", "marina", "sailing", "dock"],
  "Domes": ["dome", "igloo", "geodesic", "unique", "bubble", "pod"],
  "Trending": ["popular", "featured", "special", "amazing", "beautiful", "stunning", "perfect"]
};

function assignCategory(listing) {
  const text = `${listing.title} ${listing.description} ${listing.location} ${listing.country}`.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Default to "Rooms" if no match found
  return "Rooms";
}

const addCategories = async () => {
  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings to update`);

  for (let listing of listings) {
    const category = assignCategory(listing);
    listing.category = category;
    await listing.save();
    console.log(`✅ ${listing.title} -> ${category}`);
  }

  console.log("\n🎉 All listings updated with categories!");
  mongoose.connection.close();
};

addCategories();
