const mongoose = require('mongoose');
const User = require('../models/user');
const stories = require('../models/story');
const dashboardHome = async (req,res)=>{
    const {id,firstName} = req.user;
    const userName = firstName.toUpperCase();
    const storiesCount = await stories.find({}).countDocuments();
    // const combinedData = await stories.aggregate([{$lookup:{from:'users',localField:'user',foreignField:'_id',as:'By'}},{$project:{title:true,body:true}}])
    const combinedData = await stories.aggregate([{$lookup:{from:'users',localField:'user',foreignField:'_id',as:'As'}}]);
    const matchTheStories = await stories.aggregate([{$match:{user:new mongoose.Types.ObjectId(id)}}])
    console.log("User = "+userName);
    res.render('dashboard/index',{
        layout:'../views/layouts/dashboard',
        firstName,matchTheStories,
        userName,storiesCount
    })
}
const addStory = (req,res) =>{
    res.render('dashboard/addStory',{
        layout:'../views/layouts/dashboard'
    });
}

const addStoryPost = async (req,res)=>{
    const {title,status,story} = req.body;
    const {id} =req.user;
    const newStory = new stories({
        user:id,title,body:story,status
    })
    const saveNote = await newStory.save();
    saveNote?res.redirect('/dashboard'):res.send("unable to save your note");
}

const publicStories = async (req,res) =>{
    const {id} = req.user;
    const AllStoriesCount = await stories.find({}).countDocuments();
    // console.log("Total Stories "+AllStoriesCount);
    const storiesWithData = await stories.aggregate([{$match:{status:"public"}},{$lookup:{from:'users',localField:'user',foreignField:'_id',as:'As1'}}]);
    const AllPublicStoriesCountFind = await stories.find({status:"public"}).countDocuments();
    const AllPublicStoriesCount = await stories.aggregate([{$match:{status:"public"}},{$project:{_id:false,createdAt:false,updatedAt:false}}]);
    const AllPrivateStoriesCount = await stories.aggregate([{$match:{status:"private"}},{$project:{_id:false,createdAt:false,updatedAt:false}}]);
    const allStoriesData = await stories.find({});
    const populateAllStories = await stories.find({}).populate("user");
    const storiesByThatUser = await stories.aggregate([{$match:{user:id}}]);
    res.render('dashboard/publicStories',{
       AllStoriesCount,allStoriesData,AllPublicStoriesCount,populateAllStories,id,storiesWithData,storiesByThatUser,
       layout:'../views/layouts/dashboard'
    });
}

const editTheStory = async (req,res) =>{
    const {id} = req.user;
    const StoryId = req.params.id
    const Story = await stories.find({_id:StoryId});
    console.log(Story);
    res.render('dashboard/editTheStory',{id,StoryId,Story});
}
const updateTheStory = async (req,res) =>{
    const {id} = req.user;
    const StoryId = req.params.id;
    const {title,body,status} = req.body;
    const update = await stories.updateOne({_id:StoryId},{$set:{title,body,status}});
    update?res.redirect(`/dashboard/edit/${StoryId}`):res.send("couldn't able to update");
}

const showParticularUserPublicStories =async (req,res) =>{
    const userId = req.params.id;
    console.log(userId);
    const type = typeof userId;  //checking the typeOf the userId
    const findAllStoriesOfParticularUser = await stories.find({user:userId});
    console.log(findAllStoriesOfParticularUser);
    res.render('dashboard/particularUserStories',{findAllStoriesOfParticularUser});
    // res.send("send");
}
const deleteStory = async (req,res) =>{
    const {id}=req.params;
    const deleteStory = await stories.deleteOne({_id:id});
    deleteStory?res.send("deleted Successfully"):res.send("Unavle to delete");
    // res.send("deleting the STory"+id);
}
module.exports ={
    dashboardHome,
    addStory,addStoryPost,publicStories,editTheStory,updateTheStory,showParticularUserPublicStories,deleteStory
}