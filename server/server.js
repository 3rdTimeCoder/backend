import config from '../config/config.js';
import app from './express.js';
import mongoose from 'mongoose';


const connectToDB = () => {

    //connect to db...
    mongoose.connect(config.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, function(err, res) {
      
        if (err) {
          return console.error('Error connecting to "%s":', config.mongoUri, err);
        }
        console.log('Successfully connected to db...');
    });
}

const startServer = async () => {

    await connectToDB()

    app.listen(config.port, (err)=>{
        if(err){
            console.log(err)
        }
        console.info("Server started on port %s...", config.port)
    })
}


startServer()