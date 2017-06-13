import React, { Component } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { muiTheme } from './app/themes'

import './App.css'

import Home from './app/containers/homeContainer'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Home />
      </MuiThemeProvider>
    );
  }
}

export default App;
