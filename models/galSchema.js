const mongoose = require('mongoose');

const category = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    thumb:{
        type: String
    },
    cloudinaryId:{
        type: String
    }


});
category.pre('save', function () {      
    if (this.isNew) {
      this._doc.id = this._id;
      this.delete._id      
    } 
})
category.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});

const Category = mongoose.model('category', category)
module.exports = Category;