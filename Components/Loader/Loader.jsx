import React from "react";

//INTERNAL IMPORT
import Style from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={Style.Loader}>
      <span className={Style.spinner} />
    </div>
  );
};

export default Loader;
