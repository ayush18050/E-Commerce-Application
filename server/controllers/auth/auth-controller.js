const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Some error occurred while registering the user'
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.json({
                success: false,
                message: 'User with this email does not exist. Please register first.'
            });
        }
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch) {
            return res.json({
                success: false,
                message: 'Incorrect password. Please try again.'
            });
        }
        const token = jwt.sign({ userId: checkUser._id, role: checkUser.role, email: checkUser.email, userName: checkUser.userName }, 'CLIENT_SECRET_KEY', { expiresIn: '3h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        });
        res.json({
            success: true,
            message: 'Login successful',
            user : {
                email: checkUser.email,
                role: checkUser.role,
                userName: checkUser.userName,
                id: checkUser._id
            }
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Some error occurred while registering the user'
        })
    }
}

const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logout successful'
    });
}

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided'
        });
    }
    jwt.verify(token, 'CLIENT_SECRET_KEY', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token'
            });
        }
        req.user = decoded;
        next();
    });
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware
}