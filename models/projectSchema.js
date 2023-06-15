const mongoose = require('mongoose');


const project = new mongoose.Schema({
    name:{
        type: String,
    },
    thumb:{
        type: String
    },
    category:{
        type: String
    },
    pictures:[{
        url: String,
        Id:  String,
    }],
    thumbId:{
        type: String
    }

},{timestamps:true});
project.pre('save', function () {      
    if (this.isNew) {
      this._doc.id = this._id;
      this.delete._id      
    } 
})
project.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});
const Project = mongoose.model('project', project)
module.exports = Project;