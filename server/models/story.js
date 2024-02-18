const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["public","private"],
        default:"public"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true});

const StoryModel = mongoose.model('story',storySchema);
module.exports = StoryModel;