import React from "react";


//
// ユーザーデータの保持
//
const UserContext = React.createContext({});

export const injectUser = app => Component => ({ ...props }) => {
  const [user, setUser] = React.useState({
    isLogin: null,
    uid: null,
    doc: null,
  });

  React.useEffect(() => app.auth().onAuthStateChanged(async u => {
    if (u) {
      setUser({
        isLogin: true,
        uid: u.uid,
        docRef: app.firestore().collection("UserInfos").doc(u.uid),
      });
    } else {
      setUser({
        isLogin: false,
        uid: null,
        docRef: null,
      });
    }
  }), []);

  return (
    <UserContext.Provider value={user}>
      <Component {...props} />
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);

export const IfAuthing = ({ children }) => (
  <UserContext.Consumer>{user => user.isLogin === null ? children : null}</UserContext.Consumer>
);

export const IfAuthed = ({ children }) => (
  <UserContext.Consumer>{user => user.isLogin === true ? children : null}</UserContext.Consumer>
);


export const IfUnAuthed = ({ children }) => (
  <UserContext.Consumer>{user => user.isLogin === false ? children : null}</UserContext.Consumer>
);


// export const IfAuthedAnd = ({ children, filter }) => (
//   <appAuthContextConsumer>
//     {authState =>
//       authState.isSignedIn === true
//         ? filter(authState)
//           ? renderAndAddProps(children, authState)
//           : null
//         : null
//     }
//   </appAuthContextConsumer>
// );

// export const IfAuthedOr = ({ children, filter }) => (
//   <appAuthContextConsumer>
//     {authState =>
//       authState.isSignedIn === true || filter(authState)
//         ? renderAndAddProps(children, authState)
//         : null
//     }
//   </appAuthContextConsumer>
// );



export default {
  injectUser,
  IfAuthed,
  IfUnAuthed,
};
