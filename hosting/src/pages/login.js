import React from "react";
import { css } from '@emotion/core';
import breakpoints from 'common/breakpoints';
import { TextField, Button, ToggleButton } from '@material-ui/core';
import { IfAuthed, IfUnAuthed, IfAuthing, useUser } from "common/user";
import app from 'common/app';
import page from 'common/page';
import { Link, navigate } from 'gatsby';


const Page = ({ location }) => {
  const [info, setInfo] = React.useState({
    email: '',
    password: '',
  });

  return (
    <div css={css`
      max-width: ${breakpoints.md.maxWidth};
      margin: 0 auto;
      padding: 0 32px;
    `}>
      {/* <h1>ログイン</h1> */}
      <div>
        <div css={css`
          margin-top: 16px;
          text-align: center;
          &>* {
            // min-width: 500px;
            width: 100%;
            max-width: 320px;
          }
        `}>
          <div>
            <div>
              <TextField type='email' label='E-mail' value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} />
            </div>
            <div>
              <TextField type='password' label='Password' value={info.password} onChange={e => setInfo({ ...info, password: e.target.value })} />
            </div>
            <div>
              <Button color='secondary' variant='contained' onClick={async () => {

                const { user } = await app.auth().signInWithEmailAndPassword(info.email, info.password);
                app.firestore().collection('UserInfos').doc(user.uid).set({
                  displayName: user.displayName || user.email,
                });

                if (location.state.callback) {
                  navigate(location.state.callback);
                }
              }}>サインイン</Button>
              <Button onClick={() => app.auth().signOut()}>サインアウト</Button>
            </div>
          </div>

          <IfAuthing>
            <h2>signing in</h2>
          </IfAuthing>

          <IfAuthed>
            <h2>You are signed in</h2>
          </IfAuthed>

          <IfUnAuthed>
            <h2>You are not signed in</h2>
          </IfUnAuthed>

        </div>
      </div>
    </div>
  );
};

export default page(Page);
