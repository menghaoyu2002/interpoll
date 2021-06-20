import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@material-ui/core';
import AccountBox from '@material-ui/icons/AccountBox';
import HistoryIcon from '@material-ui/icons/History';
import PollIcon from '@material-ui/icons/Poll';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import auth from '../auth/auth';

export default function UserDrawer() {
  const user = auth.isAuthenticated().user;
  return (
    <Paper variant="outlined" className="UserDrawer">
      <List component="nav">
        <ListItem button component="a" href={'/user/' + user.username}>
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          button
          component="a"
          href={'/user/' + user.username + '/polls'}
        >
          <ListItemIcon>
            <PollIcon />
          </ListItemIcon>
          <ListItemText primary="Created Polls" />
        </ListItem>
        <ListItem
          button
          component="a"
          href={'/user/' + user.username + '/comments'}
        >
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Comments" />
        </ListItem>
        <ListItem
          button
          component="a"
          href={'/user/' + user.username + '/votes'}
        >
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Vote History" />
        </ListItem>
        <Divider />
        <ListItem button component="a" href={'/user/settings/' + user.username}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem
          button
          component="a"
          href={document.URL}
          onClick={() => sessionStorage.clear()}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Paper>
  );
}
