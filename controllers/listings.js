const Listing = require("../models/listing");
const mbxGeocoding= require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const ITEMS_PER_PAGE = 12;

module.exports.index = async (req, res) => {
  const { minPrice, maxPrice, category, sort, page } = req.query;
  const currentPage = parseInt(page) || 1;
  
  // Build filter query
  let filterQuery = {};
  
  // Price filters
  if (minPrice || maxPrice) {
    filterQuery.price = {};
    if (minPrice) filterQuery.price.$gte = parseInt(minPrice);
    if (maxPrice) filterQuery.price.$lte = parseInt(maxPrice);
  }
  
  // Category filter
  if (category && category.trim() !== "") {
    filterQuery.category = category;
  }
  
  // Build sort options
  let sortOptions = {};
  if (sort === "price_asc") {
    sortOptions.price = 1;
  } else if (sort === "price_desc") {
    sortOptions.price = -1;
  } else if (sort === "newest") {
    sortOptions._id = -1;
  }
  
  // Get total count for pagination
  const totalListings = await Listing.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);
  
  // Execute query with pagination
  let query = Listing.find(filterQuery)
    .populate("owner")
    .skip((currentPage - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
    
  if (Object.keys(sortOptions).length > 0) {
    query = query.sort(sortOptions);
  }
  
  const allListings = await query;
  
  // Store filters for form state
  const filters = {
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    category: category || "",
    sort: sort || ""
  };
  
  // Pagination data
  const pagination = {
    currentPage,
    totalPages,
    totalListings,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
  
  res.render("listings/index.ejs", { allListings, searchQuery: "", currentCategory: category || "", filters, pagination });
};

module.exports.search = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.redirect("/listings");
  }
  
  const searchRegex = new RegExp(q, "i"); // case-insensitive search
  const allListings = await Listing.find({
    $or: [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { description: searchRegex }
    ]
  }).populate("owner");
  
  const filters = { minPrice: "", maxPrice: "", category: "", sort: "" };
  const pagination = { currentPage: 1, totalPages: 1, totalListings: allListings.length, hasNextPage: false, hasPrevPage: false };
  res.render("listings/index.ejs", { allListings, searchQuery: q, currentCategory: "", filters, pagination });
};

module.exports.filter = async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const validCategories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats", "Beach"];
  
  if (!validCategories.includes(category)) {
    return res.redirect("/listings");
  }
  
  const totalListings = await Listing.countDocuments({ category });
  const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);
  
  const allListings = await Listing.find({ category })
    .populate("owner")
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
    
  const filters = { minPrice: "", maxPrice: "", category: category, sort: "" };
  const pagination = {
    currentPage: page,
    totalPages,
    totalListings,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
  
  res.render("listings/index.ejs", { allListings, searchQuery: "", currentCategory: category, filters, pagination });
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

  // Similar listings: same category first, then fill with others
  let similarListings = await Listing.find({
    _id: { $ne: listing._id },
    ...(listing.category ? { category: listing.category } : {}),
  }).limit(4);

  if (similarListings.length < 4) {
    const excludeIds = [listing._id, ...similarListings.map((l) => l._id)];
    const more = await Listing.find({ _id: { $nin: excludeIds } }).limit(
      4 - similarListings.length
    );
    similarListings = [...similarListings, ...more];
  }

  res.render("listings/show.ejs", { listing, similarListings });
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
  let originalImageUrl = (listing.image && listing.image.url) ? listing.image.url : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=60';
  if (originalImageUrl.includes('/upload')) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }
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
