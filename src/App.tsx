import { isString, _validateObject } from 'commonInterface/kacheryTypes';
import { isEqualTo } from 'commonInterface/util/misc';
import React, { useEffect, useState } from 'react';
// import './App.css';
import { getFigureData, useWindowDimensions } from 'figurl';
import WorkspaceComponent from './WorkspaceComponent/WorkspaceComponent'
import { MuiThemeProvider } from '@material-ui/core';
import theme from './theme'

type SortingViewData = {
  type: 'workspace',
  workspaceUri: string
}

const isSortingViewData = (x: any): x is SortingViewData => {
  return _validateObject(x, {
    type: isEqualTo('workspace'),
    workspaceUri: isString
  })
}


function App() {
  const [data, setData] = useState<SortingViewData>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const {width, height} = useWindowDimensions()

  useEffect(() => {
    getFigureData().then((data: any) => {
      if (!isSortingViewData(data)) {
        setErrorMessage(`Invalid figure data`)
        console.error('Invalid figure data', data)
        return
      }
      setData(data)
    }).catch(err => {
      setErrorMessage(`Error getting figure data`)
      console.error(`Error getting figure data`, err)
    })
  }, [])

  if (errorMessage) {
    return <div style={{color: 'red'}}>{errorMessage}</div>
  }

  if (!data) {
    return <div>Waiting for data</div>
  }

  return (
    <MuiThemeProvider theme={theme}>
      <WorkspaceComponent
        workspaceUri={data.workspaceUri}
        width={width - 10}
        height={height - 5}
      />
    </MuiThemeProvider>
  )
}

export default App;
