import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Snackbar,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import Common from '../../utils/Common';
import Config from '../../utils/Config';
import ProjectCard from '../../Components/ProjectCard';
import './dashboard.scss';
import SideDrawer from '../../Components/SideDrawer';
import Loader from '../../Components/Loader';

const projectColumns = ['To Do', 'In Progress', 'Completed'];

const ProjectsDashboard = ({ history }) => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState({});
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [projectsList, setProjectsList] = useState({
    "To Do": [],
    "In Progress": [],
    "Completed": [],
  });
  const [addProjectCounter, setAddProjectCounter] = useState({});
  const [draggedProjectStatus, setDraggedProjectStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${Config.serverURL}/user-details`, {
      headers: {
        'Authorization': `Bearer ${Common.getToken()?.token}`
      }
    }).then(resp => {
      setIsLoading(false);
      let responseData = resp && resp.data;
      if (responseData?.success) {
        setLoggedInUser(responseData?.user_details);
        setNotificationMessage(`Welcome ${responseData?.user_details?.name}`);
      } else {
        history.push('/login');
      }
    }).catch(err => {
      setIsLoading(false);
      console.log(err);
    });
  }, [history]);

    
  const getAllProjects = useCallback(() => {
    setIsLoading(true);
    axios.get(`${Config.serverURL}/project`, {
      headers: {
        'Authorization': `Bearer ${Common.getToken()?.token}`
      }
    }).then(resp => {
      let responseData = resp && resp.data;
      setIsLoading(false);
      if (responseData?.success) {
        let projects = responseData.project_data;
        groupProjectsByStatus(projects);
      }
    }).catch(err => {
      setIsLoading(false);
      console.log(err);
    });
  }, []);



  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  const groupProjectsByStatus = (projects) => {
    let list = {};
    list = projects && projects.reduce((list, project) => {
      list[project.status] = list[project.status] || [];
      list[project.status].push(project);
      return list;
    }, Object.create(null));
    setProjectsList(list);
  }

  const handleLogout = () => {
    setIsLoading(true);
    Common.signOut();
    setNotificationMessage('Logging out');
    setTimeout(() => {
      history.push("/login");
    }, 3000);
  }

  const handleRenderAddCard = (projectStatus) => {
    setAddProjectCounter(currentCounter => {
      if (!currentCounter.hasOwnProperty(projectStatus)) {
        currentCounter[projectStatus] = 0;
      }
      currentCounter = {
        ...currentCounter,
        [projectStatus]: currentCounter[projectStatus] + 1
      };
      return currentCounter;
    });
  }

  const handleDiscardAddProject = (e, projectStatus) => {
    e.stopPropagation();
    setAddProjectCounter(currentValue => ({
      ...currentValue,
      [projectStatus]: currentValue[projectStatus] - 1
    }));
  }
  
  const handleSaveAddProject = (projectDetails) => {
    axios.post(`${Config.serverURL}/project`, projectDetails, {
      headers: {
        'Authorization': `Bearer ${Common.getToken()?.token}`
      }
    }).then(resp => {
      let responseData = resp && resp.data;
      if (responseData?.success) {
        let projectStatus = projectDetails.status;
        setAddProjectCounter(currentValue => ({
          ...currentValue,
          [projectStatus]: currentValue[projectStatus] - 1
        }));
        getAllProjects();
        setNotificationMessage(`New project added to ${projectDetails.status}`);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleUpdateProject = (projectId, updateBody, previousStatus = '') => {
    axios.put(`${Config.serverURL}/project/${projectId}`, updateBody, {
      headers: {
        'Authorization': `Bearer ${Common.getToken()?.token}`
      }
    }).then(resp => {
      let responseData = resp && resp.data;
      if (responseData?.success) {
        if (previousStatus) {
          window.location.reload();
        } else {
          getAllProjects();
          setNotificationMessage('Project updated');
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const projectClickHandler = (e, projectId, status) => {
    setSideDrawerOpen(true);
    let selectedProject = projectsList[status].filter(project => project._id === projectId)[0];
    setSelectedProject(selectedProject);
  }

  const handleSideDrawerClose = () => {
    setSideDrawerOpen(false);
  }


  const dragStartHandler = (e) => {
    e.target.classList.add('dragging-card');
    setDraggedProjectStatus(e.target.parentElement.id);
  }

  const dragEndHandler = (e) => {
    e.target.classList.remove('dragging-card');
  }

  const dragOverHandler = (e, status) => {
    e.preventDefault();
    document.getElementById(status).classList.add('selected-project-list');
  }
  
  const dropHandler = (e, status) => {
    const projectList = document.getElementById(status);
    const draggedCard = document.querySelector('.dragging-card');
    projectList.prepend(draggedCard);
    projectList.insertBefore(draggedCard, projectList.firstChild);
    document.getElementById(status).classList.remove('selected-project-list');
    if(draggedProjectStatus !== status) {
      handleUpdateProject(draggedCard.id, { status }, draggedProjectStatus);
    }
  }

  const dragLeaveHandler = (e, status) => {
    document.getElementById(status).classList.remove('selected-project-list');
  }

  return (
    <div className="projects-dashboard">
      <div className="dashboard-header">
        <h2 style={{ letterSpacing: "2px" }}>Projects</h2>
        {Object.keys(loggedInUser).length && (
          <div className="user-actions">
            <p>Hi {loggedInUser.name}</p>
            <div className="logout-btn" title="Logout" onClick={handleLogout}>
              <LogoutIcon size="medium" className="icon" />
            </div>
          </div>
        )}
      </div>
      <div className="container">
        {Object.keys(projectColumns)?.length &&
          projectColumns.map((projectStatus) => (
            <div className="project-column" key={projectStatus}>
              <div className="column-header">
                <div className="status">{projectStatus}</div>
                <div className="project-counter">
                  {projectsList[projectStatus]?.length || 0}
                </div>
              </div>
              <button
                className="add-project-btn"
                title="Add Project"
                onClick={() => handleRenderAddCard(projectStatus)}
              >
                +
              </button>
              <div
                className="projects-list"
                id={projectStatus}
                onDragOver={(e) => dragOverHandler(e, projectStatus)}
                onDrop={(e) => dropHandler(e, projectStatus)}
                onDragLeave={(e) => dragLeaveHandler(e, projectStatus)}
              >
                {addProjectCounter.hasOwnProperty(projectStatus) &&
                addProjectCounter[projectStatus] ? (
                  [...Array(addProjectCounter[projectStatus])]?.map(
                    (_, index) => (
                      <ProjectCard
                        key={index}
                        createMode={true}
                        draggable="false"
                        status={projectStatus}
                        discardHandler={(e) =>
                          handleDiscardAddProject(e, projectStatus)
                        }
                        saveHandler={handleSaveAddProject}
                      />
                    )
                  )
                ) : (
                  <div></div>
                )}
                {Object.keys(projectsList)?.length ? (
                  projectsList[projectStatus]?.map((project) => (
                    <ProjectCard
                      key={project._id}
                      projectId={project._id}
                      title={project.title}
                      draggable="true"
                      status={projectStatus}
                      clickHandler={projectClickHandler}
                      dragStart={dragStartHandler}
                      dragEnd={dragEndHandler}
                      description={project.description}
                      creatorName={project.createdBy?.name}
                    />
                  ))
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ))}
      </div>
      <SideDrawer
        open={sideDrawerOpen}
        closeHandler={handleSideDrawerClose}
        project={selectedProject}
        updateProject={handleUpdateProject}
      />
      <Snackbar
        open={Boolean(notificationMessage.length)}
        autoHideDuration={3000}
        onClose={() => setNotificationMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert severity="success" variant="filled">
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
      <Loader open={isLoading} />
    </div>
  );
}

ProjectsDashboard.propTypes = {
  history: PropTypes.object
};

export default ProjectsDashboard;