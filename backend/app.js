if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const FRONTEND_DIR = path.join(__dirname, "../frontend");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const googleRoute = require("./routes/google.js");
// const twitterRoute = require("./routes/twitter.js");
const githubRoute = require("./routes/github.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { isLoggedIn, validateReview } = require("./middleware.js");

const dbUrl = process.env.DATABASE_URI;

// Validate required environment variables
if (!dbUrl) {
  console.error("ERROR: DATABASE_URI environment variable is not set!");
  console.error("Please create a .env file with DATABASE_URI and other required variables.");
  process.exit(1);
}

if (!process.env.SECRET) {
  console.error("ERROR: SECRET environment variable is not set!");
  console.error("Please create a .env file with SECRET for session encryption.");
  process.exit(1);
}

// Validate Cloudinary environment variables
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("WARNING: Cloudinary environment variables are not set!");
  console.error("Image upload functionality will not work without Cloudinary credentials.");
  console.error("Please add the following to your .env file:");
  console.error("  CLOUD_NAME=your_cloudinary_cloud_name");
  console.error("  CLOUD_API_KEY=your_cloudinary_api_key");
  console.error("  CLOUD_API_SECRET=your_cloudinary_api_secret");
  console.error("\nTo get Cloudinary credentials:");
  console.error("1. Sign up at https://cloudinary.com");
  console.error("2. Go to Dashboard and copy your Cloud Name, API Key, and API Secret");
}

main()
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(FRONTEND_DIR, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(FRONTEND_DIR, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  // res.send("Hi, I am root");
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Review Edit Route button ---

app.get("/listings/:id/reviewedit",(req,res) => {
  res.send("<h2>Bro you can simply delete it and add a new review!</h2>");
  // res.render("/reviewedit");
});

// --- Google oauth ---

app.use("/auth/google", googleRoute);

// -- Twitter auth ---

// app.use("/auth/twitter", twitterRoute, (req,res)=>{
//   res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${request_token}`);
// });

// -- Github oauth ---

app.use("/auth/github", githubRoute, (req,res) =>{
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(messaege);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
