var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
const PlacesSchema = new mongoose.Schema({
    city: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    continent: { type: String, required: true, index: true },
    activites: [{
        activityName: {type: String },
        category: {
            type: String,
            enum: [
              'Swimming', 'Photography', 'Dance', 'Cooking', 'Music', 'Hiking'
            ],
            required: true
          }, }]
  }); 

// return the model
module.exports = mongoose.model('Places', PlacesSchema);