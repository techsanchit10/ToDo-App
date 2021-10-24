const jwt = require('jsonwebtoken');
const encryption = require('./../utils/encryption');

const authenticate = {
  checkToken: (req, res, next) => {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.split(' ')[1];
    }
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
          return res.json({
            success: false,
            code: 401,
            message: "Unauthorized",
          });
        }
        req.user = data.user;
        next();
      });
    } else {
      return res.json({
        success: false,
        code: 400,
        message: "Bad request!! Please send a valid token.",
      });
    }
  },
  decryptData: (req, res, next) => {
    const decryptedPassword = encryption.decrypt(req.body.password);
    req.body.password = decryptedPassword;
    next();
  },
}

module.exports = authenticate;