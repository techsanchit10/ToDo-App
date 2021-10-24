import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types'
import { Drawer, Box } from '@mui/material'
import validate from 'validate.js';
import UserImage from './../../assets/User.png';
import './SideDrawer.scss';

const config = {
  isValid: false,
  values: {
    title: "",
    description: "",
  },
  touched: {},
  errors: {},
};

const schema = {
  title: {
    presence: { allowEmpty: false },
  },
  description: {
    presence: { allowEmpty: false },
  },
}


const SideDrawer = (props) => {
  const { open, closeHandler, project, updateProject } = props;

  const [ projectDetails, setProjectDetails ] = useState(config);

  useEffect(() => {
    const errors = validate(projectDetails.values, schema);
    setProjectDetails((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [projectDetails.values]);

  const handleChange = (event) => {
    setProjectDetails((projectDetails) => ({
      ...projectDetails,
      values: {
        ...projectDetails.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...projectDetails.touched,
        [event.target.name]: true,
      }
    }));
  }

  const initializeProjectDetails = useCallback(() => {
    setProjectDetails(projectDetails => ({
      ...projectDetails,
      values: {
        ...projectDetails.values,
        title: project.title,
        description: project.description
      }
    }));
  }, [project]);


  useEffect(() => {
    initializeProjectDetails();
  }, [initializeProjectDetails]);


  const updateProjectHandler = (e) => {
    e.preventDefault();
    let updateDetails = {
      ...projectDetails.values,
      status: project.status
    }
    updateProject(project._id, updateDetails);
    closeHandler();
  }

  const discardHandler = () => {
    initializeProjectDetails();
    closeHandler();
  }

  return (
    <div className="side-drawer">
      <Drawer open={open} anchor="right" onClose={closeHandler}>
        <Box sx={{ width: 550 }} className="drawer-container">
          <form onSubmit={updateProjectHandler}>
            <div className="title-container">
              <input
                name="title"
                type="text"
                className="project-title input-field"
                placeholder="Title"
                onChange={handleChange}
                value={projectDetails.values.title}
              />
            </div>
            <div className="body-container">
              <div className="body-item-row">
                <div className="field-name">Created By</div>
                <div className="field-value">
                  <div className="creator-detail">
                    <img src={UserImage} alt="user" className="profile-pic" />
                    <div>{project.createdBy?.name}</div>
                  </div>
                </div>
              </div>
              <div className="body-item-row">
                <div className="field-name">Description</div>
                <div className="field-value">
                  <textarea
                    name="description"
                    placeholder="Description.."
                    className="desc-textarea input-field"
                    onChange={handleChange}
                    value={projectDetails.values.description}
                  />
                </div>
              </div>
            </div>
            <div className="actions-rows">
              <input
                type="submit"
                value="Update"
                className="update-btn"
                disabled={!projectDetails.isValid}
              />
              <input type="reset" value="Discard" className="discard-btn" onClick={discardHandler}/>
            </div>
          </form>
        </Box>
      </Drawer>
    </div>
  );
}

SideDrawer.propTypes = {
  open: PropTypes.bool,
  closeHandler: PropTypes.func,
  project: PropTypes.object,
  updateProject: PropTypes.func
}

export default SideDrawer;