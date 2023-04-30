import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

import Template from '../template.js'
import userRoutes from './routes/user.routes.js'
import blogRoutes from './routes/blog.routes.js'
import projectRoutes from './routes/project.routes.js'
import authRoutes from './routes/auth.routes.js'


const app = express()

//Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors({Origin: true}))
//custom routes/endpoints
app.use('/', userRoutes) 
app.use('/', blogRoutes) 
app.use('/', projectRoutes) 
app.use('/', cors({'Access-Control-Allow-Credentials': true}), authRoutes) 
//handle auth-related errors thrown by express-jwt when it tries to validate JWT tokens in incoming requesting
//add the following error-catching code:
app.use((err, req, res, next)=>{
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({"error": err.name + ":" + err.message})
    }else{
        res.status(400).json({"error": err.name + ":" + err.message})
        console.log(err)
    }
})


//Default Endpoint
app.get('/testing', (req, res)=>{
    res.status(200).send(Template())
})


export default app
