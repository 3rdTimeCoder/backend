import errorHandler from '../helpers/dbErrorHandler.js';
import Project from '../models/project.model.js';
import config from '../../config/config.js';
import lodash from 'lodash';

const { extend } = lodash;

const create = async (req, res) => {
    const project = new Project(req.body)

    try{
        await project.save()
        return res.status(200).json({
            message: "project created."
        })
    }
    catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) => {
    //return a list of all projects sorted by title in ascending order.
    try{
        const projects = await Project.find().sort({title:1})
        res.json(projects)
    }
    catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const projectByID = async (req, res, next, id) => {
    try{
        let project = await Project.findById(id)
        if(!project){
            return res.status(400).json({
                error: "Project Not Found!"
            })
        }
        req.profile = project
        next() //used to propagate control to the next relevant controller function
    }catch(err){
        return res.status(400).json({
            error: "Could Not Retrieve Project!"
        })
    }
}

const read = async (req, res) => {
    return res.json(req.profile)
}

const update = async (req, res) => {
    try{
        let project =  req.profile
        project = extend(project, req.body)
        await project.save()
        res.json(project)
    }
    catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try{
        let project = req.profile
        let deletedProject = await project.remove()
        res.json(deletedProject)
    }
    catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const search = async (req, res) => {
    try{
        const searchString = req.body.search_key //what to search for
        const matches = await Project.find({$text: {$search: searchString}}).select('title')

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

// const addtag = async (req, res) => {
//     try{
//         const project = req.profile
//         const tag = req.body.tag
//         project.tags.push(tag)
//         await project.save()
//         res.json(project)
//     }
//     catch(err){
//         return res.status(400).json({
//             error: errorHandler.getErrorMessage(err)
//         })
//     }
// }

// const removetag = async (req, res) => {
//     try{
//         const project = req.profile
//         const tag = req.body.tag
//         project.tags.remove(tag)
//         await project.save()
//         res.json(project)
//     }
//     catch(err){
//         return res.status(400).json({
//             error: errorHandler.getErrorMessage(err)
//         })
//     }
// }

// //This is the only thing that doesn't work.
// const sortByDate = async (req, res) => {
//     try{
//         //return a list of all projects sorted by date created in ascending order.
//         let projects = await Project.find().select('title').sort({created:1})
//         res.json(projects)
//     }
//     catch(err){
//         return res.status(400).json({
//             error: errorHandler.getErrorMessage(err)
//         })
//     }
// }


export default {create, list, projectByID, read, update, remove, search}