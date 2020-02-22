var express = require("express");
var router = express.Router();	 
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req,res){
	//Get components from the DB
	Campground.find({},function(err, allCampgrounds){
	if(err){
			console.log(err)
	} else {
			res.render("campgrounds/index",{campgrounds: allCampgrounds, /*currentUser: req.user*/});
	}
	});
	//res.render("campgrounds",{campgrounds: campgrounds});
});

//CREATE - ADD NEW CAMPGROUNDS
router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	};
	var newcamground = { name:name, price:price, image:image, description:desc, author:author};
	//create a new campground and save it to DB
	Campground.create(newcamground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
	//campgrounds.push(newcamground);
	//res.redirect("/campgrounds");
});

//SHOW FORM TO CREATE A NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//SHOW MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id",function(req,res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			return res.redirect("back");
		} else {
			//render show template with campground	
			//console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
	//res.render("show");
	//find the campground with provided id  
	//render show template with the campground 
});

// EDIT  CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundsOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundsOwnership, function(req,res){
	//find and update the correct campground page
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
	//redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundsOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;
