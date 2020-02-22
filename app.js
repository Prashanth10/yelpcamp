var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");	
var passport = require("passport");
var LocalStratagy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

//mongoose.set('useUnifiedTopology', true);
//mongoose.connect("mongodb://localhost/yelp_camp");
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url, {
	useNewUrlParser:true,
	useCreateIndex: true,
	useUnifiedTopology:true,
	useFindAndModify:false
}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR", err.message);
});
//mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passoport configuration
app.use(require("express-session")({
	secret: "welcome to yelp_camp",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

/*Campground.create(
	{name: "Jessy", 
	 image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c722679d4934ecd51_340.jpg",
	 description: "It's a nice to have camping in a beatiful hill"
	},function(err,campground){
		if(err){
			console.log(err);
		} else {
			console.log("newly created campground");
			console.log(campground);
		}
	});	*/


/*var campgrounds = [
	{name: "Jessy", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c722679d4934ecd51_340.jpg"},
	{name: "Franklin", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722679d4934ecd51_340.jpg"},
	{name: "Hilary", image:"https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744e7c2d7bd09445cc_340.jpg"}
];*/


// ***********************
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


/*app.listen(5000,function(){
	console.log("Yelpcamp serve running");
});  */

app.listen(process.env.PORT, process.env.IP, () => console.log("The YelpCamp Server Has Started!"));