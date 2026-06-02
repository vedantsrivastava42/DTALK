import React from "react";

//INTERNAL IMPORT
import { Filter, Friend } from "../Components/index";
import Style from "../styles/home.module.css";

const ChatApp = () => {
  return (
    <div className={Style.page}>
      <Filter />
      <Friend />
    </div>
  );
};

export default ChatApp;
