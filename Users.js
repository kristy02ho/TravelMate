var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('dotenv').config();

mongoose.Promise = global.Promise;

try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

//user schema
var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false },
    biography: { type: String },
    imageUrl: { type: String },
    hobby: [{
        type: String,
        enum: ['Swimming', 'Photography', 'Dance', 'Cooking', 'Music', 'Hiking']
      }],      
    placesToVisit: [{
        placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Places' },
      }],
      placesVisited: [{
        placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Places' },
      }]
});

UserSchema.pre('save', function(next) {
    var user = this;

    //hash the password
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        //change the password
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (password, callback) {
    var user = this;

    bcrypt.compare(password, user.password, function(err, isMatch) {
        callback(isMatch);
    })
}

// const User = mongoose.model('User', UserSchema);

// const users = [
//   {
//     name: "Alice",
//     username: "alice123",
//     password: "password123",
//     hobby: "Photography",
//     placesToVisit: [],
//     placesVisited: []
//   },
// ];

// users.forEach(userData => {
//   const user = new User(userData);
//   user.save()
//     .then(() => console.log(`Saved user`))
//     .catch(err => console.error('Error saving user:', err));
// });

//return the model to server
module.exports = mongoose.model('User', UserSchema);