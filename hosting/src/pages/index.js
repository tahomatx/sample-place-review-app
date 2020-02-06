import React from "react";
import { IfAuthed, IfUnAuthed } from "common/user";
import page from 'common/page';
import app from "common/app";
import { compose } from 'recompose';
import NavBar from 'components/NavBar';


const Page = () => (
  <React.Fragment>
    <NavBar />
  </React.Fragment>
);


export default page(Page);
