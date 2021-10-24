import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import validate from "validate.js";
import UserImage from './../../assets/User.png';
import './ProjectCard.scss';

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

const ProjectCard = (props) => {
  const {
    projectId = '',
    title,
    description,
    creatorName,
    status,
    createMode = false,
    clickHandler,
    discardHandler,
    saveHandler,
    draggable,
    dragStart,
    dragEnd,
  } = props;

  const [projectDetails, setProjectDetails] = useState(config);

  useEffect(() => {
    setProjectDetails((projectDetails) => ({
      ...projectDetails,
      values: {
        ...projectDetails.values,
        status: status
      }
    }));
  }, [status]);

  useEffect(() => {
    const errors = validate(projectDetails.values, schema);
    setProjectDetails((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [projectDetails.values]);

  const handleChange = (event) => {
    event.stopPropagation();
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

  const handleSaveProject = (e, projectDetails) => {
    e.stopPropagation();
    saveHandler(projectDetails);
    setProjectDetails(config);
  } 

  const renderComponent = () => {
    if (createMode) {
      return (
        <div>
          <div className="title">
            <input
              type="text"
              className="input-field"
              placeholder="Give your task a title"
              name="title"
              onChange={handleChange}
              value={projectDetails.values.title}
            />
          </div>
          <div className="description-create">
            <textarea
              className="input-field"
              placeholder="Description.."
              name="description"
              onChange={handleChange}
              value={projectDetails.values.description}
            />
          </div>
          <div className="card-action-row">
            <button
              style={{ backgroundColor: "#329C89" }}
              onClick={(e) => handleSaveProject(e, projectDetails.values)}
              disabled={!projectDetails.isValid}
            >
              Save
            </button>
            <button
              style={{ backgroundColor: "#dd4d40" }}
              onClick={discardHandler}
            >
              Discard
            </button>
          </div>
        </div>
      );
    } else {
      return (
      <div onClick={(e) => clickHandler(e, projectId, status)} style={{ cursor: "pointer"}}>
          <div className="title">{title}</div>
          <div className="description">{description}</div>
          <div className="creator-info">
            <img draggable="false" src={UserImage} alt="user" title={creatorName} />
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className="project-card"
      id={projectId}
      draggable={draggable}
      onDragStart={(e) => dragStart(e, status)}
      onDragEnd={dragEnd}
    >
      {renderComponent()}
    </div>
  );
}

ProjectCard.defaultProps = {
  projectId: '',
  createMode: false,
};

ProjectCard.propTypes = {
  projectId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  creatorName: PropTypes.string,
  status: PropTypes.string,
  createMode: PropTypes.bool,
  clickHandler: PropTypes.func,
  discardHandler: PropTypes.func,
  saveHandler: PropTypes.func,
  draggable: PropTypes.bool,
  dragStart: PropTypes.func,
  dragEnd: PropTypes.func,
}

export default ProjectCard;