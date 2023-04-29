import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "Nomah S."
    },
    body: {
        type: String,
        required: true
    },
    cover_img_url: String,
    comments: [{body: String, date: Date, hidden: Boolean}],
    date: {
        type: Date, 
        default: Date.now
    },
    hidden: Boolean,
    tags: [String]
})


//gives me the ablility to search all fields.
BlogSchema.index({'$**': 'text'}) 

export default mongoose.model('blog', BlogSchema)