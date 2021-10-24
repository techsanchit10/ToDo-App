const router = require('express').Router();
const AuthService = require('../services/AuthService');

router.get("/", async (req, res) => {
  try {
    const userDetails = await AuthService.getUserDetails(req.user.email)
    res.send(userDetails);
  } catch(err) {
    res.status(400).send(ex);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const signupResponse = await AuthService.signupUser(req.body);
    res.send(signupResponse);    
  } catch (ex) {
    res.status(400).send(ex);
  }
});

router.post("/login", async (req, res) => {
  try {
    const loginResponse = await AuthService.loginUser(req.body);
    res.send(loginResponse);
  } catch (ex) {
    res.status(400).send(ex);
  }
});

module.exports = router;