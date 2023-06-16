const GalCategory = require("../models/galSchema");
const GalProject = require("../models/projectSchema");
const ObjectId = require('mongodb').ObjectId;
const cloudinary = require('../middleware/cloudinary')
const fs = require('fs');
var path = require('path');
const { db, findById } = require("../models/suSchema");


/* Uploading */
module.exports.categoryUpload = async (req,res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        const obj = new GalCategory ({
        name: req.body.name,
        thumb: result.secure_url,
        cloudinaryId: result.public_id
        })
        await obj.save()
        res.json (obj)
    } catch(err){
        console.log(err, 'image not saved')
    }
}
module.exports.projectUpload = async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images')
    try {
        // const urls = []
        const files = req.files;
        const filePromises = files.map(file => cloudinary.uploader.upload(file.path)  )
        const urls = await Promise.all(filePromises)
        console.log("urls",urls)
        
        const proj = new GalProject({
            name:req.body.name,
            category:req.body.category,
            thumb: urls[0].url,
            pictures: urls.map( url => ({url:url.url, id:url.public_id})),
            thumbId: urls[0].public_id

        })
        console.log(proj, req.file)
        await proj.save()
        res.status(200).json(proj) 
    } catch (error) {
        console.log(error, 'opps')
    }
        
}

/* get all */
module.exports.categoryGet = async (req, res) => {
    const allData = await GalCategory.find()

    res.json(allData)
}
module.exports.projectGet = async (req, res) => {
    
    const allData = await GalProject.find()
    res.json(allData)
}
module.exports.projectCat = async (req, res) => {
    
    const allData = await GalProject.find({category:req.params.category})
    res.json(allData)
}

/* Get One */
module.exports.categoryGetOne = async (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('categories')
        .findOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'could not find the categorey'})
        })        
    } else{
        res.status(500).json({error: 'not a valid category'})
    }
}

module.exports.projectGetOne = async (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('projects')
        .findOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'project not found '})
        })        
    } else{
        res.status(500).json({error: 'not a valid project'})
    }
}

/* deleting */
module.exports.categoryDel = async (req, res) => {
    try{
        let cat = await GalCategory.findById(req.params.id);
        await cloudinary.uploader.destroy(cat.cloudinaryId);
        await cat.remove();
        res.json(cat);
    } catch (err){
        console.log(err)
    }

}
module.exports.projectDel = (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        let pro = GalProject.findById(req.params.id);
        cloudinary.uploader.destroy(pro.thumbId);
        db.collection('projects')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'could not delete'})
        })        
    } else{
        res.status(500).json({error: 'not a valid project'})
    }

}

/* updating */
module.exports.categoryUpdate = async (req, res) => {
    
    if(ObjectId.isValid(req.params.id)){
        try {
            let cat = await GalCategory.findById(req.params.id);
            await cloudinary.uploader.destroy(cat.cloudinaryId);
    
            const result = cloudinary.uploader.upload(req.file.path)  
           
            const data = {
                name:req.body.name,
                thumb: result.secure_url,
                cloudinaryId: result.public_id
            }
            cat = await GalCategory.updateOne({_id: ObjectId(req.params.id)},{$set: data});
            res.json(cat)
        } catch (error) {
            console.log(error)
        } 
    }

}
module.exports.projectUpdate = async (req, res) => {
    try {
        let proj = await GalProject.findById(req.params.id);
        console.log(proj,req)
        /* await cloudinary.uploader.destroy(proj.thumbId);
        const filePromises = await cloudinary.uploader.upload(req.files,{public_id:proj.pictures.url})
        console.log(filePromises ) */
        /* const data = {
            name:req.body.name,
            pictures: {url:url.url, id:url.public_id}
        }
        proj = await GalProject.updateOne({_id: ObjectId(req.params.id)},{$set: data});
        res.json(proj) */
    } catch (error) {
        console.log(error)
    } 

}