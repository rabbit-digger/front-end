import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Index } from './pages/index/Index'
import { Select } from './pages/select/Select'
import { Profile } from './pages/profile/Profile'
import { Settings } from './pages/settings/Settings'

export const Routes: React.FC = () => {
  return <>
    <Switch>
      <Route path='/select_endpoint'>select</Route>
      <Route path='/'>
        <Index>
          <Switch>
            <Route path='/' exact><Redirect to='/select' /></Route>
            <Route path='/select' component={Select}></Route>
            <Route path='/profile' component={Profile}></Route>
            <Route path='/settings' component={Settings}></Route>
          </Switch>
        </Index>
      </Route>
    </Switch>
  </>
}
