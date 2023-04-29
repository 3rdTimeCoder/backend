import errorHandler from '../helpers/dbErrorHandler.js';
import Blog from '../models/blog.model.js';
import config from '../../config/config.js';
import lodash from 'lodash';

const { extend } = lodash;


const create = async (req, res) => {
    const blog = new Blog(req.body)

    try{
        await blog.save()
        return res.status(200).json({
            message: "blog post created."
        })

    }catch(err){
        res.status(400).json({
            error: errorHandler.getMessage(err)
        })
    }
}

const list = async (req, res) => {
    try{
        const blogs = await Blog.find().sort({date:1})
        res.json(blogs)
    }catch(err){
        res.status(400).json({
            error: errorHandler.getMessage(err)
        })
    }
}

const blogByID = async (req, res, next, id) => {
    try{
        const blog = await Blog.findById(id)
        if (!blog){
            return res.json({
                error: "Blog Post Not Found."
            })
        }
        req.profile = blog
        next()

    }catch(err){
        return res.status(400).json({
            error: "Could Not Retrieve Blog Post."
        })
    }
}

const read = async (req, res) => {
    return res.json(req.profile)
}

const update = async (req, res) => {
    try{
        let blog = req.profile
        blog = extend(blog, req.body)
        await blog.save()
        res.json(blog)

    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try{
        let blog = req.profile
        let deletedBlog = await blog.remove()
        res.json(deletedBlog)

    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const search = async (req, res) => {
    try{
        const searchString = req.body.search_key //what to search for
        const matches = await Blog.find({$text: {$search: searchString}}).select('title')

        // One of these headers or some combination of these headers finally overcame cors, don't know which one though...
        res.setHeader('Access-Control-Allow-Origin', config.frontend_host)
        res.setHeader('Origin', config.frontend_host)
        res.setHeader('HOST', config.backend_host)
        res.setHeader('Access-Control-Allow-Methods', "OPTIONS, POST")
        res.setHeader('Access-Control-Allow-Headers', "Content-Type")
        
        res.status(200).json(matches)
    }
    catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}



export default { create, list, blogByID, read, remove, update, search }