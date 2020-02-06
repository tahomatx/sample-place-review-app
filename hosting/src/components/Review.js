import React from "react";
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import { TextField, Button, Paper, Divider, Select, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import { IfAuthed, IfUnAuthed, useUser } from "common/user";



export default ({ review }) => {
  const user = useUser();
  const data = review.data();
  //
  // ステート
  //
  const [place, setPlace] = React.useState(null);

  //
  // [新板発行あり] レビューIDの取得
  //
  React.useEffect(() => {
    setPlace(null);

    (async () => {
      // if (place) {
      setPlace(await review.ref.parent.parent.get());
      // }
    })();
  }, []);

  return (
    <Paper css={css`
      padding: 8px 16px;
      margin: 16px 0;
    `}>
      <h2>{data.title}</h2>
      {place && <div>{place.data().title}</div>}
      <p>{data.description}</p>
      <div>ユーザーID: {data.uid}</div>
      {data.uid === user.uid && (
        <Button component={Link} to={`/places/${review.ref.parent.parent.id}/reviews/${review.id}/edit`}>編集</Button>
      )}
    </Paper>
  );
};
