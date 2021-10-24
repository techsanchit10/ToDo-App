const jwt = require('jsonwebtoken');
const UserModel = require('../model/User');

const getUserDetails = async (email) => {
  try {
    const user = await UserModel.findOne({ email: email }).select("name email");
    if (!user) {
      return {
        success: false,
        message: "User not found!"
      }
    }
    return {
      success: true,
      user_details: user
    }
  } catch (err) {
    throw err;
  }
}

const signupUser = async (signupDetails) => {
  try {
    const existingUserResponse = await getUserDetails(signupDetails.email);
    if (existingUserResponse.success) {
      return {
        success: false,
        message: "User already exists."
      }
    }
    let userResponse = await UserModel.create(signupDetails);
    userResponse = {
      _id: userResponse._id,
      name: userResponse.name,
      email: userResponse.email,
    };
    if (userResponse) {
      return {
        success: true,
        data: {
          token: jwt.sign({ user: userResponse }, process.env.JWT_SECRET)
        }
      }
    }
  } catch (err) {
    throw err;
  }
}

const loginUser = async (loginDetails) => {
  try {
    const user = await UserModel.findOne({
      email: loginDetails.email,
      password: loginDetails.password,
    }).select("name email");
    if (user) {
      return {
        success: true,
        data: {
          token: jwt.sign({ user }, process.env.JWT_SECRET)
        }
      }
    } else {
      return {
        success: false,
        message: "Your Email & Password do not match."
      }
    }
  } catch (err) {
    throw err;
  }
}

const LoginService = {
  getUserDetails,
  signupUser,
  loginUser,
}

module.exports = LoginService;