import React from 'react'

import PropTypes from 'prop-types'

import { AppBar } from 'material-ui'

const Header = ({title}) => {
  return(
    <AppBar
      title={title}
    />
  )
}

const { string } = PropTypes

Header.propTypes = {
  title: string.isRequired,
}

export default Header
