import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    cover_img_url: String,
    demo_video_url: String,
    repo_url: String,
    desc: {
        type: String,
        required: true
    },
    working_project_link: String,
    tags: {
        type: [String],
        required: true
    },
    featured: {
        type: Boolean,
        default: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
})

//gives me the ablility to search all fields.
ProjectSchema.index({'$**': 'text'}) 

export default mongoose.model('project', ProjectSchema)