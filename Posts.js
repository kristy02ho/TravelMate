const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Post schema
const PostSchema = new Schema({
    id: { type: Number},
    name: { type: String, required: true },
    location: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: Number, default: 0 },
    date: { type: String, default: Date.now },
});


// const Post = mongoose.model('Posts', PostSchema);

// const postsDB = [
//     {
//       id: 1,
//       name: "Jimmy Tran",
//       location: "Denver, Colorado",
//       content: "I love Denver So Much! 🌸",
//       image: "https://assets.milestoneinternet.com/cdn-cgi/image/f=auto/the-slate-denver/slatedenver/innerpageoverviewimage/the-slate-denver-colorado-ttd-overview.jpg?width=640&height=580",
//       likes: 12000,
//       date: "04/20/2024",
//     },
//     {
//       id: 2,
//       name: "John Doe",
//       location: "Kyoto, Japan",
//       content: "Ancient beauty meets modernity. #Kyoto",
//       image: "https://i.natgeofe.com/n/508c82e4-efb5-4273-80ad-dcf1a043e6e6/temple-kyoto-japan_4x3.jpg",
//       likes: 95,
//       date: "04/15/2024",
//     },
//     {
//       id: 3,
//       name: "Emma Johnson",
//       location: "Osaka, Japan",
//       content: "The street food here is incredible! So much to try! 🍣",
//       image: "https://boutiquejapan.com/wp-content/uploads/2017/10/takoyaki-osaka-japan-e1542938850575.png",
//       likes: 230,
//       date: "04/13/2024",
//     },
//     {
//       id: 4,
//       name: "Olivia Brown",
//       location: "Hokkaido, Japan",
//       content: "Snowy paradise. Winter wonderland at its best. ❄️",
//       image: "https://www.skiing-hokkaido.com/wp/wp-content/uploads/2021/09/img_hokkaido01.jpg",
//       likes: 340,
//       date: "04/19/2024",
//     },
// ];

// postsDB.forEach(postData => {
//   const post = new Post(postData);
//   post.save()
//     .then(() => console.log(`Saved posts`))
//     .catch(err => console.error('Error saving post:', err));
// });

module.exports = mongoose.model('Posts', PostSchema);