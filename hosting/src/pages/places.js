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

import firebase from "firebase/app";
import LinearProgress from '@material-ui/core/LinearProgress';

import EditIcon from '@material-ui/icons/Edit';


const PlaceViewer = ({ specifiedPlaceId }) => {

  //
  // ステート
  //
  const [place, setPlace] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  //
  // [新板発行なし] プレースIDの取得
  //
  React.useEffect(() => {
    setPlace(null);

    (async () => {
      const col = app.firestore().collection('Places');
      const doc = await col.doc(specifiedPlaceId).get();

      if (doc.exists) {
        setPlace(doc);
      } else {
        setPlace(false);
      }
    })();
  }, [specifiedPlaceId]);


  //
  // [新板発行あり] レビューIDの取得
  //
  React.useEffect(() => {
    setReviews([]);

    (async () => {
      if (place) {
        setReviews((await place.ref.collection('PlaceReviews').orderBy('createdAt', 'desc').limit(10).get()).docs);
      }
    })();
  }, [place]);

  if (place && reviews) {
    const placeData = place.data();

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
            <p><Link to='/places'>一覧に戻る</Link></p>
            <h1>{placeData.title}</h1>
            <p>{placeData.description}</p>
            <Divider />
            <div>
              {reviews && reviews.map(review => {
                return <Review key={review.id} review={review} />;
              })}
            </div>
          </div>
          <IfAuthed>
            <Fab component={Link} to={`/places/${specifiedPlaceId}/reviews/create`} color="secondary" css={css`
              position: fixed;
              bottom: 96px;
              right: 32px;
            `}>
              <AddIcon />
            </Fab>
            <Fab component={Link} to={`/places/${specifiedPlaceId}/edit`} color="secondary" css={css`
              position: fixed;
              bottom: 32px;
              right: 32px;
            `}>
              <EditIcon />
            </Fab>
          </IfAuthed>
        </React.Fragment>
    );
  } else if (place === false) {
    return (<div>レストランが見つかりません</div>);
  } else {
    return (<LinearProgress color='secondary' />);
  }
};


const PlaceReviewEditor = ({ specifiedPlaceId, specifiedReviewId = 'default', create }) => {
  //
  // ユーザー情報
  //
  const user = useUser();

  //
  // ステート
  //
  const [draft, setDraft] = React.useState(null);
  const [place, setPlace] = React.useState(null);
  const [review, setReview] = React.useState(null);

  const [saving, setSaving] = React.useState(false);

  //
  // [新板発行なし] プレースIDの取得
  //
  React.useEffect(() => {
    setPlace(null);

    (async () => {
      const col = app.firestore().collection('Places');
      const doc = await col.doc(specifiedPlaceId).get();

      if (doc.exists) {
        setPlace(doc);
      }
    })();
  }, [specifiedPlaceId]);


  //
  // [新板発行あり] レビューIDの取得
  //
  React.useEffect(() => {
    setDraft(null);
    setReview(null);

    (async () => {
      if (user.isLogin && place) {
        const col = place.ref.collection('PlaceReviews');
        let doc = await col.doc(specifiedReviewId).get();

        if (doc.exists) {
          const data = doc.data();

          if (data.uid === user.uid) {
            setDraft({
              title: data.title,
              description: data.description,
            });
          } else {
            setDraft(false);
          }
        } else if (create) {
          doc = await col.doc().get();
          setDraft({
            title: '',
            description: '',
          });
        } else {
          setDraft(false);
        }

        setReview(doc);
      }
    })();
  }, [user, place, specifiedReviewId]);


  if (user.isLogin && place && review && draft) {
    //
    // データベースへの書き込みに必要な情報がすべてある → 編集準備完了
    //

    return (

      <div css={css`
        max-width: ${breakpoints.md.maxWidth};
        margin: 0 auto;
        padding: 0 32px;
      `}>
        <h1>新しいレビュー</h1>

        <div>
          <TextField label="タイトル" placeholder="うまかった" variant="outlined" autoFocus margin='dense' fullWidth value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />

          <TextField label="レビューの本文" placeholder="最高級の具材に最高レベルの腕前。とてもおいしかった。" variant="outlined" multiline margin='dense' rows={3} fullWidth value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />

          <div css={css`
            text-align: right;
            &>* {
              margin-left: 8px;
            }
          `}>
            {/* <Button component={Link} to={`/places/${place.id}`}>戻る</Button> */}

            <Button variant='contained' color='secondary' disabled={!draft.title || saving} onClick={async () => {
              setSaving(true);

              const data = {
                ...draft,
                uid: user.uid,
                placeId: place.id,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              };

              if(!draft.createdAt) {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
              }

              await review.ref.set(data, { merge: true });

              navigate(`/places/${place.id}`);

              setSaving(false);
            }}>レビューを保存</Button>
          </div>
        </div>
      </div>
    );
  } else if (draft === false || user.isLogin === false) {
    return (<div>編集できません</div>);
  } else {
    //
    // データベースへの書き込みに必要な情報がない → 編集できない
    //

    return (<LinearProgress color='secondary' />);
  }
};


const List = () => {

  const [places, setPlaces] = React.useState(null);

  React.useEffect(() => app.firestore().collection("Places")
    .orderBy('createdAt', 'desc')
    .limit(10)
    .onSnapshot(snapshot => setPlaces(snapshot.docs)), []);

  return (
    <div css={css`
      max-width: ${breakpoints.md.maxWidth};
      margin: 0 auto;
      padding: 0 32px;
    `}>
      <h1>お店を探す</h1>

      <h2>新しいお店</h2>
      <div>{places && places.map((place, i) => {
        const data = place.data();
          return (<p key={i}><Link key={place.id} to={`/places/${place.id}`}>{data.title}</Link></p>);
      })}</div>
      <IfAuthed>
        <Fab component={Link} to={'/places/create'} color="secondary" css={css`
          position: fixed;
          bottom: 32px;
          right: 32px;
        `}>
          <AddIcon />
        </Fab>
      </IfAuthed>
    </div>
  );
};


const Editor = ({ specifiedPlaceId = 'default', create }) => {
  //
  // ユーザー情報
  //
  const user = useUser();

  //
  // ステート
  //
  const [draft, setDraft] = React.useState(null);
  const [place, setPlace] = React.useState(null);

  const [saving, setSaving] = React.useState(false);


  //
  // [新板発行あり] レビューIDの取得
  //
  React.useEffect(() => {
    setDraft(null);

    (async () => {
      if (user.isLogin) {
        const col = app.firestore().collection('Places');
        let doc = await col.doc(specifiedPlaceId).get();

        if (doc.exists) {
          const data = doc.data();

          if (data.uid === user.uid) {
            setDraft({
              title: data.title,
              description: data.description,
            });
          } else {
            setDraft(false);
          }
        } else if (create) {
          doc = await col.doc().get();
          setDraft({
            title: '',
            description: '',
          });
        } else {
          setDraft(false);
        }

        setPlace(doc);
      }
    })();
  }, [user, specifiedPlaceId]);


  if (user.isLogin && place && draft) {
    //
    // データベースへの書き込みに必要な情報がすべてある → 編集準備完了
    //

    return (

      <div css={css`
        max-width: ${breakpoints.md.maxWidth};
        margin: 0 auto;
        padding: 0 32px;
      `}>
        <h1>お店</h1>

        <div>
          <TextField label="名称" placeholder="ホテルニューオータニ" variant="outlined" autoFocus margin='dense' fullWidth value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />

          <TextField label="説明" placeholder="東京都港区にある高級ホテル・レストラン。" variant="outlined" multiline margin='dense' rows={3} fullWidth value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />

          <div css={css`
            text-align: right;
            &>* {
              margin-left: 8px;
            }
          `}>
            {/* <Button component={Link} to={`/places/${place.id}`}>戻る</Button> */}

            <Button variant='contained' color='secondary' disabled={!draft.title || saving} onClick={async () => {
              setSaving(true);

              const data = {
                ...draft,
                uid: user.uid,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              };

              if(!draft.createdAt) {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
              }

              await place.ref.set(data, { merge: true });

              navigate(`/places/${place.id}`);

              setSaving(false);
            }}>お店を保存</Button>
          </div>
        </div>
      </div>
    );
  } else if (draft === false || user.isLogin === false) {
    return (<div>編集できません</div>);
  } else {
    //
    // データベースへの書き込みに必要な情報がない → 編集できない
    //

    return (<LinearProgress color='secondary' />);
  }
};

const Page = () => (
  <React.Fragment>
    <NavBar />
    <Router basepath="/places">
      <PlaceReviewEditor path=":specifiedPlaceId/reviews/:specifiedReviewId/edit" />
      <PlaceReviewEditor path=":specifiedPlaceId/reviews/create" create />
      <PlaceViewer path=":specifiedPlaceId" />
      <Editor path=":specifiedPlaceId/edit" />
      <Editor path="create" create />
      <List path='/' />
    </Router>
  </React.Fragment>
);

export default page(Page);
