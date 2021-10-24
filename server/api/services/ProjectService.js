const ProjectModel = require('../model/Project');

const createProject = async (projectDetails) => {
  try {
    const response = await ProjectModel.create(projectDetails);
    const projectData = await response.populate("createdBy", "name email");
    if (!projectData) {
      return {
        success: false,
        message: "Error creating new project! Please try again later."
      }
    }
    return {
      success: true,
      project_data: projectData,
    };
  } catch (err) {
    throw err;
  }
};

const getAllProjects = async () => {
  try {
    const projects = await ProjectModel.find()
      .populate("createdBy", "name email")
      .sort({ updatedOn: -1 });
    if (!projects) {
      return {
        success: false,
        message: "Error fetching projects! Please try again later."
      }
    }
    return {
      success: true,
      project_data: projects
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const updateProjectData = async (projectId, updateDetails) => {
  try {
    const updateResponse = await ProjectModel.updateOne(
      { _id: projectId },
      updateDetails
    );
    if (updateResponse.modifiedCount || updateResponse.matchedCount) {
      return {
        success: true,
        message: "Project updated successfully"
      }
    } else {
      return {
        success: false,
        message: "Unexpected error occurred while updating."
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  createProject,
  getAllProjects,
  updateProjectData
}