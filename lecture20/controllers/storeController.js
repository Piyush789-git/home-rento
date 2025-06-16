const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");

exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: res.locals.isLoggedIn, 
      user: res.locals.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: res.locals.isLoggedIn, 
      user: res.locals.user,
    });
  });
};

exports.getBookings = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate('home')
      .sort({ createdAt: -1 });

    // Filter out bookings where home is null (deleted homes)
    const validBookings = bookings.filter(booking => booking.home !== null);

    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: res.locals.isLoggedIn,
      user: res.locals.user,
      bookings: validBookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.redirect('/');
  }
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: res.locals.isLoggedIn, 
    user: res.locals.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
    
    if (!home) {
      return res.redirect('/homes');
    }

    res.render("store/home-detail", {
      home: home,
      pageTitle: home.houseName,
      currentPage: "Home",
      isLoggedIn: res.locals.isLoggedIn,
      user: res.locals.user,
    });
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.redirect('/homes');
  }
};

exports.getBookingPage = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
    
    if (!home) {
      return res.redirect('/');
    }

    res.render("store/booking-page", {
      home: home,
      pageTitle: "Book Your Stay",
      currentPage: "booking",
      isLoggedIn: res.locals.isLoggedIn,
      user: res.locals.user
    });
  } catch (error) {
    console.error('Error loading booking page:', error);
    res.redirect('/');
  }
};

exports.postBookHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const { checkIn, checkOut, numberOfGuests, paymentMethod, totalPrice } = req.body;

    const booking = new Booking({
      home: homeId,
      user: req.session.user._id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      numberOfGuests: parseInt(numberOfGuests),
      totalPrice: parseFloat(totalPrice),
      paymentMethod: paymentMethod,
      paymentStatus: 'pending'
    });

    await booking.save();
    res.redirect('/bookings');
  } catch (error) {
    console.error('Error creating booking:', error);
    res.redirect(`/book/${homeId}`);
  }
};

exports.getRules =  [(req, res, next) => {
  if(!req.session.isLoggedIn){
    return res.redirect("/Login");

  }
  next();
}, (req, res, next) => {
  const homeId = req.params.homeId;
  const rulesFilename='HouseRules.pdf';
  const filePath = path.join(rootDir, 'rules', rulesFilename);
  //res.sendFile(filePath);
 res.download(filePath,'Rules.pdf');
}];