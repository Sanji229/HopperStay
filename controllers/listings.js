const Listing = require("../models/listing");
const mbxGeocoding= require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Does Not Exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  // 1️ Convert location to coordinates
  const geoData = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  //  SAFETY CHECK
  if (!geoData.body.features.length) {
    req.flash("error", "Invalid location. Please enter a valid place.");
    return res.redirect("/listings/new");
  }

  // 2️ Create listing
  const newListing = new Listing(req.body.listing);

  // 3️ Save geometry
  newListing.geometry = geoData.body.features[0].geometry;

  // 4️ Image
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // 5️ Owner
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};



module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does Not Exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  //  Re-geocode if location or country changed
  if (req.body.listing.location || req.body.listing.country) {
    const geoData = await geocodingClient
      .forwardGeocode({
        query: `${listing.location}, ${listing.country}`,
        limit: 1,
      })
      .send();

    if (geoData.body.features.length) {
      listing.geometry = geoData.body.features[0].geometry;
    }
  }

  // Image update
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
