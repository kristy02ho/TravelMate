const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Post schema
const PostSchema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: Number, required: true },
    date: { type: String, required: true },
});


const Post = mongoose.model('Posts', PostSchema);

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

module.exports = mongoose.model('Posts', PostSchema);