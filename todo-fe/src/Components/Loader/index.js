import React from 'react';
import PropTypes from 'prop-types';
import { Backdrop, CircularProgress } from '@mui/material';

const Loader = (props) => {
  const { open } = props;
  return (
    <Backdrop
      sx={{ color: 'white', backgroundColor: 'rgba(0,0,0, 0.7)'}}
      open={open}
    >
      <CircularProgress color="inherit" size={80}/>
    </Backdrop>
  );
}

Loader.defaultProps = {
  open: false
};

Loader.propTypes = {
  open: PropTypes.bool
};

export default Loader;