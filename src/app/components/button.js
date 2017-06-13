import React from 'react';

import PropTypes from 'prop-types'

import { RaisedButton } from 'material-ui';

const ButtonGeneric = ({label, primary, onClickFunction}) => {
  return(
    <RaisedButton
      label={label}
      primary={primary}
      onTouchTap={onClickFunction}
    />
  )
}

const { string, bool, func } = PropTypes

ButtonGeneric.propTypes = {
  label: string.isRequired,
  primary: bool.isRequired,
  onClickFunction: func.isRequired,
}

export default ButtonGeneric;
