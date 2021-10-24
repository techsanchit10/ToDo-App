import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";
import validate from "validate.js";
import axios from 'axios';
import Config from '../../utils/Config';
import Common from '../../utils/Common';
import { withRouter } from 'react-router-dom';

const config = {
  isValid: false,
  values: {
    name: "",
    email: "",
    password: "",
  },
  touched: {},
  errors: {},
};

const schema = {
  name: {
    presence: { allowEmpty: false, message: "is required"}
  },
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
  password: {
    presence: { allowEmpty: false, message: "is required" },
  },
}

const Signup = ({ history }) => {
  const [signupDetails, setSignupDetails] = useState(config);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const errors = validate(signupDetails.values, schema);
    setSignupDetails((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [signupDetails.values]);

  const handlePasswordVisibility = (field_name) => {
    setShowPassword(!showPassword);
  }

  const hasError = (field) =>
  signupDetails.touched[field] && signupDetails.errors[field] ? true : false;

  const handleChange = (event) => {
    setSignupDetails((signupDetails) => ({
      ...signupDetails,
      values: {
        ...signupDetails.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...signupDetails.touched,
        [event.target.name]: true,
      }
    }));
  }

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  }

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorText('');
    localStorage.setItem('rememberMe', rememberMe);
    setFormLoading(true);
    axios.post(`${Config.serverURL}/auth/signup`, signupDetails.values)
          .then(resp => {
            setFormLoading(false);
            let responseData = resp && resp.data;
            if (responseData?.success) {
              Common.setToken(responseData.data.token);
              setSignupDetails(config);
              history.push('/');
            } else {
              setErrorText(responseData.message);
            }
          })
          .catch(err => {
            setFormLoading(false);
            setErrorText('Some error occured! Please try again.');
          });
  }

  return (
    <div>
      <form onSubmit={handleSignup}>
        <TextField
          name="name"
          className="input-field"
          label="Full Name"
          variant="outlined"
          value={signupDetails.values.name}
          fullWidth
          onChange={handleChange}
          error={hasError("name")}
          helperText={hasError("name") ? signupDetails.errors.name[0] : null}
        />
        <TextField
          name="email"
          className="input-field"
          label="Email"
          variant="outlined"
          value={signupDetails.values.email}
          fullWidth
          onChange={handleChange}
          error={hasError("email")}
          helperText={hasError("email") ? signupDetails.errors.email[0] : null}
        />
        <TextField
          name="password"
          className="input-field"
          type={showPassword ? "text" : "password"}
          label="Password"
          variant="outlined"
          value={signupDetails.values.password}
          fullWidth
          onChange={handleChange}
          error={hasError("password")}
          helperText={
            hasError("password") ? signupDetails.errors.password[0] : null
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handlePasswordVisibility("password")}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errorText && (
          <span className="error-text">
            <ErrorOutlineIcon fontSize="small" /> {errorText}
          </span>
        )}
        <Button
          className="form-button"
          variant="contained"
          fullWidth
          type="submit"
          disabled={!signupDetails.isValid}
        >
          {formLoading ? (
            <CircularProgress color="inherit" size={25} />
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
      <FormControlLabel
        control={
          <Checkbox
            color="success"
            size="small"
            onChange={handleRememberMe}
            checked={rememberMe}
          />
        }
        label="Remember Me"
        className="remember-me-text"
      />
    </div>
  );
}

Signup.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Signup);