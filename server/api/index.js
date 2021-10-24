const router = require('express').Router();
const authenticate = require('./middlewares/authenticate');
const validation = require('./middlewares/validation');

router.use(
  "/auth",
  validation.validateAuthDetails,
  require("./controllers/AuthController")
);

router.use(
  "/user-details",
  authenticate.checkToken,
  require("./controllers/AuthController")
);

router.use(
  "/project",
  authenticate.checkToken,
  require("./controllers/ProjectController")
);

module.exports = router;