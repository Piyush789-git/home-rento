const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./user');
const Booking = require('./booking');

const homeSchema = new mongoose.Schema({
    houseName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    photo: String,
    description: String,
});

homeSchema.pre('findOneAndDelete', async function(next) {
    const homeId = this.getQuery()._id;
    
    // Remove the home from all users' favorites
    await User.updateMany(
        { favourites: homeId },
        { $pull: { favourites: homeId } }
    );

    // Update associated bookings to mark them as cancelled
    await Booking.updateMany(
        { home: homeId },
        { 
            $set: { 
                bookingStatus: 'cancelled',
                cancellationReason: 'Home no longer available'
            }
        }
    );

    next();
});

module.exports = mongoose.model('Home', homeSchema);

