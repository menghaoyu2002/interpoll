import React from 'react';
import { Route, Switch } from 'react-router';
import Home from './components/Home';
import Login from './components/Login';
import PollPage from './components/PollPage';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import PollForm from './components/CreatePoll';
import ShowMore from './components/ShowMore';
import EditPoll from './components/EditPoll';
import Settings from './components/Settings';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/user/login" component={Login} />
      <Route path="/user/register" component={Register} />
      <Route path="/user/settings/:username" component={Settings} />
      <Route path="/user/:username/:type" component={ShowMore} />
      <Route path="/user/:username" component={UserProfile} />
      <Route path="/poll/create" component={PollForm} />
      <Route path="/poll/edit/:pollId/" component={EditPoll} />
      <Route path="/poll/:pollId" component={PollPage} />
    </Switch>
  );
}
