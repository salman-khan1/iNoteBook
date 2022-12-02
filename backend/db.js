const mongoose = require("mongoose");
const mongoUrl =
  "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const connectToMongo=()=>{

    mongoose.connect(mongoUrl,()=>{
        console.log("Conected to Monogs succesfully")
    })
}


module.exports=connectToMongo;