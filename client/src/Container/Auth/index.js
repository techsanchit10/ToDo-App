import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './auth.scss';
import AuthImage from '../../assets/AuthImage.png';
import Login from './Login';
import Signup from './Signup';

const Auth = ({ history }) => {
  const [selectedSection, setSelectedSection] = useState('login');

  useEffect(() => {
    let currentPath = history.location.pathname;
    setSelectedSection(currentPath.substring(1, currentPath.length)); // removing '/' from the path to store as selectedSection
  }, [history.location.pathname]);
  
  const appliedSectionClass = (btnName) =>
    btnName === selectedSection ? "selected-section" : "unselected-section";

  const renderAuthComponent = () => selectedSection === 'login' ? <Login /> : <Signup />;

  return (
    <div className="auth-page">
      <div className="container">
        <div className="image-section">
          <img src={AuthImage} alt="auth" className="auth-image" />
        </div>
        <div className="auth-form-box">
          <div className="auth-section-row">
            <div
              className={appliedSectionClass("login")}
              onClick={() => history.push("/login")}
            >
              Log In
            </div>
            <div
              className={appliedSectionClass("signup")}
              onClick={() => history.push("/signup")}
            >
              Sign up
            </div>
          </div>
          <div className="auth-form-container">{renderAuthComponent()}</div>
        </div>
      </div>
    </div>
  );
}

Auth.propTypes = {
  history: PropTypes.object,
}

export default Auth;