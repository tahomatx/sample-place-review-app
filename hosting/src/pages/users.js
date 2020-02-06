import React from "react";
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import breakpoints from 'common/breakpoints';
import { Router } from "@reach/router";
import app from 'common/app';

import page from "common/page";
import { TextField, Button, Paper, Divider, Select, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import { IfAuthed, IfUnAuthed, useUser } from "common/user";
import { navigate } from "@reach/router";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import NavBar from 'components/NavBar';
import Review from 'components/Review';
import Jdenticon from 'components/Jdenticon';

import firebase from "firebase/app";
import LinearProgress from '@material-ui/core/LinearProgress';


const Reader = ({ specifiedUserId }) => {

  const user = useUser();

  //
  // ステート
  //
  const [userInfo, setUserInfo] = React.useState(null);
  const [reviews, setReviews] = React.useState(null);
  const [follow, setFollow] = React.useState(null);

  //
  // [新板発行なし] プレースIDの取得
  //
  React.useEffect(() => {
    setUserInfo(null);

    (async () => {
      const doc = await app.firestore().collection('UserInfos').doc(specifiedUserId).get();

      if (doc.exists) {
        setUserInfo(doc);
      } else {
        setUserInfo(false);
      }
    })();
  }, [specifiedUserId]);


  //
  // [新板発行あり] レビューIDの取得
  //
  React.useEffect(() => {
    setReviews(null);

    (async () => {
      if (userInfo) {
        return app.firestore().collectionGroup('PlaceReviews')
          .where('uid', '==', userInfo.id)
          .orderBy('createdAt', 'desc')
          .limit(10)
          .onSnapshot(snapshot => setReviews(snapshot.docs));
      }
    })();
  }, [userInfo]);


  //
  // フォロー
  //
  React.useEffect(() => {
    setFollow(null);

    if (user.isLogin && userInfo) {
      return user.docRef.collection('Follows').doc(userInfo.id)
        .onSnapshot(snapshot => setFollow(snapshot));
    }
  }, [user, userInfo]);

  if (userInfo && reviews && follow) {
    const data = userInfo.data();

    return (
      <React.Fragment>
        <div css={css`
          max-width: ${breakpoints.md.maxWidth};
          margin: 0 auto;
          padding: 0 16px;
          ${breakpoints.md.up} {
            padding: 0 32px;
          }
        `}>
          <div css={css`
            margin: 16px 0;
          `}>
            <p><Link to='/users'>一覧に戻る</Link></p>
            <div css={css`
              display: flex;
              &>* {
                margin-right: 8px;
              }
            `}>
              <Jdenticon size='64' value={userInfo.id} />
              <div>
                <h1>{data.displayName}</h1>
              </div>
            </div>

            {(user.isLogin && user.uid !== userInfo.id && !follow.exists) && (
              <div>
                <Button variant='contained' color='secondary' onClick={() => {
                  const batch = app.firestore().batch();
                  const since = firebase.firestore.FieldValue.serverTimestamp();
                  batch.set(follow.ref, {
                    userRef: userInfo.ref,
                    since
                  });

                  batch.set(userInfo.ref.collection('Followers').doc(user.uid), {
                    userRef: user.docRef,
                    since,
                  });

                  batch.commit();
                }}>フォロー</Button>
              </div>
            )}

            {(user.isLogin && user.uid !== userInfo.id && follow.exists) && (
              <div>
                <Button variant='outlined' color='secondary' onClick={() => {
                  const batch = app.firestore().batch();
                  batch.delete(follow.ref);
                  batch.delete(userInfo.ref.collection('Followers').doc(user.uid));
                  batch.commit();
                }}>フォロー中</Button>
              </div>
            )}
          </div>
          <Divider />
          <div>
            {reviews.map(review => {
            return <Review key={review.id} review={review} />;
            })}
          </div>
        </div>
        {/* <IfAuthed>
          <Fab component={Link} to={`/places/${specifiedPlaceId}/reviews/create`} color="secondary" css={css`
            position: fixed;
            bottom: 32px;
            right: 32px;
          `}>
            <EditIcon />
          </Fab>
        </IfAuthed> */}
      </React.Fragment>
    );
  } else if (userInfo === false) {
    return (<div>ユーザーが見つかりません</div>);
  } else {
    return (<LinearProgress color='secondary' />);
  }
};


const List = () => {

  //
  // ステート
  //
  const [users, setUsers] = React.useState(null);

  //
  // ユーザーリストのリッスン
  //
  React.useEffect(() => app.firestore().collection("UserInfos")
    .limit(10)
    .onSnapshot(snapshot => setUsers(snapshot.docs)), []);


  if (users) {
    return (
      <div css={css`
        max-width: ${breakpoints.md.maxWidth};
        margin: 0 auto;
        padding: 0 32px;
      `}>
        <h1>ユーザー</h1>

        <h2>新しいユーザー</h2>
        <div>{users.map((u) => {
          const data = u.data();
          return (<p key={u.id}><Link key={u.id} to={`/users/${u.id}`}>{u.id}</Link></p>);
        })}</div>
        {/* <IfAuthed>
          <Fab component={Link} to={'/places/create'} color="secondary" css={css`
            position: fixed;
            bottom: 32px;
            right: 32px;
          `}>
            <AddIcon />
          </Fab>
        </IfAuthed> */}
      </div>
    );
  } else {
    return (<LinearProgress color='secondary' />);
  }
};

const Page = () => (
  <React.Fragment>
    <NavBar></NavBar>
    <Router basepath="/users">
      <Reader path="/:specifiedUserId" />
      <List path='/' />
    </Router>
  </React.Fragment>
);

export default page(Page);
