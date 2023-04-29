import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from '../../config/config.js';


//The POST request object recieves the email and password in req.body. This email is used to retrieve a matching user from the database
//Then, the password authentication method defined in UserSchema is used to verify the password that's recieved in req.bofy from client
//If the password is successfully verified, the JWT module is used to generate a signed JWT using a secret key and the user's _id value.
const signin = async (req, res) =>{

    try{
        let user = await User.findOne({"email": req.body.email})

        if (!user) return res.status(401).json({error: "User not found"})

        if (!user.authenticate(req.body.password)){
            return res.status(400).send({error: "Email and password don't match."})
        }

        const token = jwt.sign({_id: user._id}, config.jwtSecret)

        res.cookie('t', token, { expire: new Date() + 9999 })

        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            }
        })
    }catch(err){
        return res.status(400).json({ error: "Could not sign in" })
    }

}

//the signout func clears the response cookie containing the signed JWT. This us an optional endpoint 
//its not really necessary for auth purposes if cookies are not used at all in the frontend.
const signout = async (req, res) =>{
    res.clearCookie('t')
    return res.status(200).json({
        message: "signed out"
    })
}

//verifies that the incoming request has a valid JWT in the Authorization header. If the token is valid, it appends
//user's ID in an 'auth' key to the request object; otherwise, it throws an authentication error.
//We can add requireSignin to any route that should be protected against unauthenticated access.
const requireSignin = expressJwt.expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    userProperty: 'auth'
})

//For some of the protected routes, such as update and delete, on top od checking for authentication we also want to make sure the requesting 
//user is only updating or deleting their own user infomation.
//check whether the authenticated user is the same as the user being updated or deleted before the corresponding CRUD controller func is allowed to proceed.
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)){
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next()
}
/*The req.auth object is populated by express-jwt in requireSignin after authentication verification, while
req.profile is populated by the userByID function in user.controller.js
We add hasAuthorization routes that require both authentication and authorization
*/

export default { signin, signout, requireSignin, hasAuthorization }