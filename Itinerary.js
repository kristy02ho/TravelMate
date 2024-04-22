var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Itinerary schema
const ItinerarySchema = new mongoose.Schema({
    // placeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Places'},
    imageUrl: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: [
        'Swimming', 'Photography', 'Dance', 'Cooking', 'Music', 'Hiking'
      ],
      required: true
    },
    itinerary: [{
        subImageUrl: {type: String, required: true},
        time: {type: String, required: true },
        header: {type: String, required: true},
        description: {type: String, required: true}
      }]
  }); 

// return the model
module.exports = mongoose.model('Itinerary', ItinerarySchema);