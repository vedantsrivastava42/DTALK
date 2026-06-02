import React from "react";

//INTERNAL IMPORT
import Style from "./UserCard.module.css";

const UserCard = ({ el, i, addFriends }) => {
  return (
    <div className={Style.UserCard}>
      <div className={Style.top}>
        <span className={Style.avatar}>
          {(el.name || "?").charAt(0).toUpperCase()}
        </span>
        <span className={Style.index}>#{i + 1}</span>
      </div>

      <h3 className={Style.name}>{el.name}</h3>
      <p className={Style.addr}>
        {el.accountAddress.slice(0, 10)}…{el.accountAddress.slice(-8)}
      </p>

      <button
        className={Style.addBtn}
        onClick={() =>
          addFriends({ name: el.name, userAddress: el.accountAddress })
        }
      >
        + Add Friend
      </button>
    </div>
  );
};

export default UserCard;
