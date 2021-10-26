import React from 'react';
import PropTypes from 'prop-types';
import {Router} from 'react-router-dom'
import Main from '_environment/Main';

export default function Root({ history }) {
  return (
    <Router history={history}>
      <Main />
    </Router>
  );
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
};
