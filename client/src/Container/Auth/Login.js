import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import crypto from 'crypto';
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
    email: "",
    password: "",
  },
  touched: {},
  errors: {},
};

const schema = {
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

const Login = ({ history }) => {
  const [loginDetails, setLoginDetails] = useState(config);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  useEffect(() => {
    const errors = validate(loginDetails.values, schema);
    setLoginDetails((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [loginDetails.values]);

  const handlePasswordVisibility = (field_name) => {
    setShowPassword(!showPassword);
  }

  const hasError = (field) =>
  loginDetails.touched[field] && loginDetails.errors[field] ? true : false;

  const handleChange = (event) => {
    setLoginDetails((loginDetails) => ({
      ...loginDetails,
      values: {
        ...loginDetails.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...loginDetails.touched,
        [event.target.name]: true,
      }
    }));
  }

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  }

  const encrypt = (value) => {
    return crypto.publicEncrypt(
      {
        key: Config.publicKey,
      },
      Buffer.from(value)
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setFormLoading(true);
    localStorage.setItem('rememberMe', rememberMe);
    setErrorText('');
    const encryptedLoginDetails = {
      ...loginDetails.values,
      password: encrypt(loginDetails.values.password).toString('base64'),
    }
    axios.post(`${Config.serverURL}/auth/login`, encryptedLoginDetails)
        .then(resp => {
          setFormLoading(false);
          let responseData = resp && resp.data;
          if (responseData?.success) {
            Common.setToken(responseData.data.token);
            setLoginDetails(config);
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
      <p className="continue-text">To Continue</p>
      <p className="login-helper-text">We need your Name & Email</p>
      <form className="form" onSubmit={handleLogin}>
        <TextField
          name="email"
          className="input-field"
          label="Email"
          variant="outlined"
          value={loginDetails.values.email}
          fullWidth
          onChange={handleChange}
          error={hasError("email")}
          helperText={
            hasError("email") ? loginDetails.errors.email[0] : null
          }
        />
        <TextField
          name="password"
          className="input-field"
          type={showPassword ? "text" : "password"}
          label="Password"
          variant="outlined"
          value={loginDetails.values.password}
          fullWidth
          onChange={handleChange}
          error={hasError("password")}
          helperText={
            hasError("password") ? loginDetails.errors.password[0] : null
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
          disabled={!loginDetails.isValid}
        >
          {formLoading ? (
            <CircularProgress color="inherit" size={25} />
          ) : (
            "Log In"
          )}
        </Button>
      </form>
      <FormControlLabel
        control={
          <Checkbox color="success" size="small" onChange={handleRememberMe} checked={rememberMe}/>
        }
        label="Remember Me"
        className="remember-me-text"
      />
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Login);