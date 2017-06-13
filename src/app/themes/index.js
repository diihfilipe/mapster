import { getMuiTheme } from 'material-ui/styles'

import { deepPurple600, grey50 } from 'material-ui/styles/colors'

export const muiTheme = getMuiTheme({
  appBar: {
    color: deepPurple600
  },
  raisedButton: {
    color: deepPurple600,
    textColor: grey50
  }
})
