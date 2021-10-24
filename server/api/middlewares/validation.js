const validateAuthDetails = (req, res, next) => {
  if (req.url === "/signup") {
    if (!req.body.email || !req.body.name || !req.body.password) {
      return res.status(400).json({ message: "Invalid Request Body." });
    }
  } else if (req.url === "/login") {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Invalid Request Body." });
    }
  }
  next();
}

const validateProjectBody = (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: "Invalid Request Body." });
  }
  next();
}

module.exports = {
  validateAuthDetails,
  validateProjectBody
}