const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const MONGO_URL=process.env.ATLASDB_URL;
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB=async ()=> {
    await Listing.deleteMany({});
    
    // Find or create default user
    let owner = await User.findOne({ username: "Sanjilka Saxena" });
    if (!owner) {
        owner = new User({
            username: "Sanjilka Saxena",
            email: "sanjilka@example.com",
        });
        await User.register(owner, "defaultPassword123");
        console.log("✅ Created default user: Sanjilka Saxena");
    }
    
    // Geocode and insert listings
    for (let obj of initData.data) {
        try {
            const geoData = await geocodingClient
                .forwardGeocode({
                    query: `${obj.location}, ${obj.country}`,
                    limit: 1,
                })
                .send();
            
            const listing = new Listing({
                ...obj,
                owner: owner._id,
                geometry: geoData.body.features.length > 0 
                    ? geoData.body.features[0].geometry 
                    : { type: "Point", coordinates: [0, 0] }
            });
            
            await listing.save();
            console.log(`✅ Added: ${obj.title}`);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
            console.error(`❌ Error adding ${obj.title}:`, err.message);
        }
    }
    
    console.log("🎉 Data initialization complete!");
};

initDB();
