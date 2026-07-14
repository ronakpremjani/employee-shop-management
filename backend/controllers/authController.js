const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
   try{
    const{
        name,
        email,
        phone,
        password,
    } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({
        success: false,
        message: 'All fields are required'
    });
}

    const existingUser = await User.findOne({ email });

    if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
}

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userCount = await User.countDocuments();

    let role;

    if (userCount === 0) {
        role = 'admin';
}   
    else {
        role = 'staff';
}

const user = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    role
});

await user.save();

return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

}catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,            
        });
    }
};

const loginUser = async (req, res) => {


const { email, password } = req.body;

    try{
  if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

const user = await User.findOne({ email }).select('+password');

     if (!user) {
      return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
    {
        user_id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN
    }   );

     return res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    data: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
}); 


}
catch (error) {
    console.error(error);

    return res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack
    });
}
}

const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user
    });
};


module.exports = {
  registerUser,
  loginUser,
    getMe
};  