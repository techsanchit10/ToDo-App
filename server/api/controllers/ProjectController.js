const router = require("express").Router();
const ProjectService = require("../services/ProjectService");
const validation = require("../middlewares/validation");

router.post("/", validation.validateProjectBody, async (req, res) => {
  try {
    let newProjectDetails = {
      ...req.body,
      createdBy: req.user._id,
    }
    const project = await ProjectService.createProject(newProjectDetails);
    res.send(project);
  } catch (ex) {
    res.status(401).send(ex);
  }
});

router.get("/", async (req, res) => {
  try {
    const projectData = await ProjectService.getAllProjects();
    res.send(projectData);
  } catch (ex) {
    res.status(401).send(ex);
  }
});

router.put("/:projectId", async (req, res) => {
  try {
    if (req.params.projectId) {
      const updatedProjectResponse = await ProjectService.updateProjectData(req.params.projectId, req.body);
      res.send(updatedProjectResponse);
    }
  } catch (ex) {
    res.status(403).send(ex);
  }
})

module.exports = router;