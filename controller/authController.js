
const User = require("../models/suSchema");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { userName: '', password: '' };

  // incorrect userName
  if (err.message === 'incorrect userName') {
    errors.userName = 'That userName is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate userName error
  if (err.code === 11000) {
    errors.userName = 'that userName is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  console.log("this is the signup get");
}

module.exports.signup_post = async (req, res) => {
  
  const { userName, password } = req.body;

  try {
    const user = await User.create({ userName, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.admin_login = (req, res) => {
  console.log('This is the admin login');
}

module.exports.admin_login_post = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.login(userName, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
    console.log('Logged In')
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    console.log(errors)
  }

}
module.exports.admin_logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  console.log("Logged Out")
 
}

/* module.exports.login_post = async (req, res) => {
  const { userName, password } = req.body;

  console.log(userName, password);
  res.send('user login');
} */