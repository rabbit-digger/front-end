import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Index } from './pages/index/Index'
import { Net } from './pages/net/Net'

export const Routes: React.FC = () => {
  return <>
    <Route path='/'>
      <Index>
        <Switch>
          <Route path='/' exact><Redirect to='/net' /></Route>
          <Route path='/net' component={Net}></Route>
        </Switch>
      </Index>
    </Route>
  </>
}
