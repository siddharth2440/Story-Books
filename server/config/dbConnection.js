const mongoose = require('mongoose');

const dbConn = () =>{
    mongoose
        .connect(process.env.MongoDB_URI)
        .then(()=>console.log("Successfully Connected to the Database"))
        .catch((err)=>{
            console.log(`Couldn't able to connect to the Database`)
        })
}


module.exports = dbConn;