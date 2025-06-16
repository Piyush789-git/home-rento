// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");
const isAuth = require("../middleware/is-auth");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.get("/book/:homeId", isAuth, storeController.getBookingPage);
storeRouter.post("/book-home/:homeId", isAuth, storeController.postBookHome);
storeRouter.get("/bookings", isAuth, storeController.getBookings);
storeRouter.get("/favourites", isAuth, storeController.getFavouriteList);
storeRouter.post("/favourites", isAuth, storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);
storeRouter.get("/rules/:homeId", storeController.getRules);

module.exports = storeRouter;