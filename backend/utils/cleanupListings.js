/**
 * Cleanup script to remove listings without valid owners
 * Run this with: node utils/cleanupListings.js
 * Make sure your .env file has DATABASE_URI set
 */

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const dbUrl = process.env.DATABASE_URI;

async function cleanupListings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    // Find all listings
    const allListings = await Listing.find({});
    console.log(`Total listings in database: ${allListings.length}`);

    // Find listings without owners or with invalid owner references
    const listingsWithoutOwners = [];
    
    for (const listing of allListings) {
      if (!listing.owner) {
        listingsWithoutOwners.push(listing._id);
      } else {
        // Try to populate owner to check if it exists
        await listing.populate("owner");
        if (!listing.owner || !listing.owner._id) {
          listingsWithoutOwners.push(listing._id);
        }
      }
    }

    if (listingsWithoutOwners.length === 0) {
      console.log("✓ No orphaned listings found. All listings have valid owners.");
      await mongoose.disconnect();
      return;
    }

    console.log(`\nFound ${listingsWithoutOwners.length} listings without valid owners:`);
    
    // Delete the orphaned listings
    const result = await Listing.deleteMany({ _id: { $in: listingsWithoutOwners } });
    console.log(`✓ Deleted ${result.deletedCount} orphaned listings.`);

    // Verify cleanup
    const remainingListings = await Listing.find({});
    console.log(`\nRemaining listings in database: ${remainingListings.length}`);

    await mongoose.disconnect();
    console.log("\n✓ Cleanup completed successfully!");
  } catch (error) {
    console.error("Error during cleanup:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

cleanupListings();


