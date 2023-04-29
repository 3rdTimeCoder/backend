import errorHandler from '../helpers/dbErrorHandler.js';
import User from '../models/user.model.js';
import lodash from 'lodash';

const { extend } = lodash;

const create = async (req, res) => {

    const user = new User(req.body) 

    try{
        await user.save() //attmpts to save user on database after mongoose performs validation checks
        return res.status(200).json({
            message: "Successfully signed up!"
        })

    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//finds all users from database, populates only the name,email,created and updated fields in resulting list. 
//and return list as json object to requesting client
const list = async (req, res) => {
    try{
        let users = await User.find().select('name email updated created')
        res.json(users)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//whenever express recieves a req to a route that matches path containig :userId parameter, it will execute userByID
//controller function, which fetches and loads the user into the express req object, before propagating it to the next
//function that's specific to the req that came in.
//this is psossible because of the "router.param('userId', userCtrl.userByID)" in user.routes.js
const userByID = async (req, res, next, id) => {
    try{
        let user = await User.findById(id)

        if(!user){
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user
        next() //call the next function
    }catch(err){
        return res.status(400).json({
            error: "Could not retrieve user"
        })
    }
}

//the read function retrieves the user details from req.profile and removes sensitive info, such as hashed_password and salt values,
//before sending the user object in the response to the requesting client.
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

//The update func retrieves the user details from req.profile and then uses the lodash module to extend and merge the changes that came
//in the req body to update the user data
//Upon successfully saving this update, the updated user object is cleaned by removing sensitive data, such as hashed_password and salt,
//before sending the response to the requesting client.
const update = async (req, res) => {
    try{
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//The remove func retrieves the user from req.profile and uses the remove() query to delete user from db.
//On successful deletion, the requesting client is returned the de-sensitized deleted user object
const remove = async (req, res) => {
    try{
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


export default { create, userByID, read, list, remove, update }