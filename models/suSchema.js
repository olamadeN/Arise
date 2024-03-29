
const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const suTemplate = new mongoose.Schema({
    userName:{
        type:String,
        required:[true, 'Please enter your full name'],
        unique:true,
        lowercase: true,
    },
    password:{
        type:String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

suTemplate.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// static method to login user
suTemplate.statics.login = async function(userName, password) {
    const user = await this.findOne({ userName });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect userName');
};
suTemplate.pre('save', function () {      
    if (this.isNew) {
      this._doc.id = this._id;
      this.delete._id      
    } 
})
suTemplate.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});



const User = mongoose.model('mytable', suTemplate)
module.exports = User;