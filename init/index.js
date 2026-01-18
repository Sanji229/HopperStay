const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/HopperStay";

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
    const fakeOwnerId=new mongoose.Types.ObjectId();
    initData.data=initData.data.map((obj)=>({
        ...obj, owner: fakeOwnerId,
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();