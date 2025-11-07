const Listing = require("../models/listing");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
  // Only fetch listings that have an owner
  const allListings = await Listing.find({ owner: { $exists: true, $ne: null } })
    .populate("owner", "username"); // Populate to verify owner exists
  // Filter out any listings where owner didn't populate (owner was deleted)
  const validListings = allListings.filter(listing => listing.owner !== null && listing.owner !== undefined);
  res.render("listings/index.ejs", { allListings: validListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID!");
    return res.redirect("/listings");
  }
  
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username", // Only select fields that exist
        },
      })
      .populate({
        path: "owner",
        select: "username email", // Select username and email fields
      });
      
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    
    // Filter out reviews with null authors (deleted users)
    if (listing.reviews && listing.reviews.length > 0) {
      listing.reviews = listing.reviews.filter(review => review.author !== null);
    }
    
    // Check if owner exists
    if (!listing.owner) {
      req.flash("error", "Listing owner information is missing!");
      return res.redirect("/listings");
    }
    
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    req.flash("error", "An error occurred while loading the listing. Please try again.");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update route (updates listing details)
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    updatedListing.save();
  }
  req.flash("success", "Listing Updated !!");
  res.redirect(`/listings/${id}`);
};

// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if (typeof req.file !== "undefined") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }

//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);
// };

// --- Display listings by category ---

module.exports.filter = async (req, res, next) => {
  let { id } = req.params;
  let allListings = await Listing.find({ 
    category: { $all: [id] },
    owner: { $exists: true, $ne: null }
  }).populate("owner", "username");
  // Filter out listings with deleted owners
  const validListings = allListings.filter(listing => listing.owner !== null && listing.owner !== undefined);
  console.log(validListings);
  if (validListings.length != 0) {
    res.locals.success = `Listings Find by ${id}`;
    res.render("listings/index.ejs", { allListings: validListings });
  } else {
    req.flash("error", "Listings is not here !!!");
    res.redirect("/listings");
  }
};

// --- Search ---

module.exports.search = async (req, res) => {
  console.log(req.query.q);
  let input = req.query.q.trim().replace(/\s+/g, " ");
  console.log(input);
  if (input == "" || input == " ") {
    req.flash("error", "Search value empty !!!");
    res.redirect("/listings");
  }

  let data = input.split("");
  let element = "";
  let flag = false;
  for (let index = 0; index < data.length; index++) {
    if (index == 0 || flag) {
      element = element + data[index].toUpperCase();
    } else {
      element = element + data[index].toLowerCase();
    }
    flag = data[index] == " ";
  }
  console.log(element);
  let allListings = await Listing.find({
    title: { $regex: element, $options: "i" },
    owner: { $exists: true, $ne: null }
  }).populate("owner", "username");
  let validListings = allListings.filter(listing => listing.owner !== null && listing.owner !== undefined);
  if (validListings.length != 0) {
    res.locals.success = "Listings searched by Title";
    res.render("listings/index.ejs", { allListings: validListings });
    return;
  }

  if (validListings.length == 0) {
    allListings = await Listing.find({
      category: { $regex: element, $options: "i" },
      owner: { $exists: true, $ne: null }
    }).populate("owner", "username").sort({ _id: -1 });
    validListings = allListings.filter(listing => listing.owner !== null && listing.owner !== undefined);
    if (validListings.length != 0) {
      res.locals.success = "Listings searched by Category";
      res.render("listings/index.ejs", { allListings: validListings });
      return;
    }
  }
  if (validListings.length == 0) {
    allListings = await Listing.find({
      country: { $regex: element, $options: "i" },
      owner: { $exists: true, $ne: null }
    }).populate("owner", "username").sort({ _id: -1 });
    validListings = allListings.filter(listing => listing.owner !== null && listing.owner !== undefined);
    if (validListings.length != 0) {
      res.locals.success = "Listings searched by Location";
      res.render("listings/index.ejs", { allListings: validListings });
      return;
    }
  }

  const intValue = parseInt(element, 10);
  const intDec = Number.isInteger(intValue);

  if (validListings.length == 0 && intDec) {
    allListings = await Listing.find({ 
      price: { $lte: element },
      owner: { $exists: true, $ne: null }
    }).populate("owner", "username").sort({
      price: 1,
    });
    validListings = allListings.filter(listing => listing.owner !== null && listing.owner !== undefined);
    if (validListings.length != 0) {
      res.locals.success = `Listings searched for less than Rs ${element}`;
      res.render("listings/index.ejs", { allListings: validListings });
      return;
    }
  }
  if (validListings.length == 0) {
    req.flash("error", "Listings is not here !!!");
    res.redirect("/listings");
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
