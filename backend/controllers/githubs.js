const passport = require("passport");
const User = require("../models/user.js");
require('dotenv').config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// Only initialize GitHub OAuth strategy if credentials are provided
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_CALLBACK_URL) {
	let GitHubStrategy = require("passport-github2").Strategy;

	passport.use(new GitHubStrategy({
		clientID: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET,
		callbackURL: GITHUB_CALLBACK_URL,
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({ githubId: profile.id }, function (err, user) {
			return done(err, user);
		});
	}));
	console.log("GitHub OAuth strategy initialized");
} else {
	console.log("GitHub OAuth credentials not provided. GitHub login will not be available.");
}

module.exports = passport;