import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { css } from '@emotion/core';
import Jdenticon from 'components/Jdenticon';
import { IfAuthed, IfUnAuthed, useUser } from "common/user";
import app from 'common/app';
import { Link } from 'gatsby';


export default () => {
  const user = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}
        <div css={css`
          &>* {
            margin-right: 8px;
          }
        `}>
          <Link to='/'>ホーム</Link>
          <Link to='/users'>ユーザー</Link>
          <Link to='/places'>レストラン</Link>

        </div>
        <Typography css={css`
          flex-grow: 1
        `}></Typography>

        <IfUnAuthed>
          <Button component={Link} to={'/login'}
          // state={{ callback: window ? window.location.pathname : '/' }}
          color="inherit">Login</Button>
        </IfUnAuthed>

        <IfAuthed>
          <Button  onClick={() => app.auth().signOut()} color="inherit">Logout</Button>
          <Link to={`/users/${user.uid}`} css={css`
            margin-left: 8px;
            background-color: white;
            height: 32px;
            width: 32px;
            border-radius: 50%;
          `}>
            <Jdenticon size='32' value={user.uid} />
          </Link>
        </IfAuthed>
      </Toolbar>
    </AppBar>
  );
};
