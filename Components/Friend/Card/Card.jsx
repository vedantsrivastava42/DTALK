import React from "react";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./Card.module.css";

const Card = ({ readMessage, el, i, readUser, active }) => {
  const handleOpen = () => {
    readMessage(el.pubkey);
    readUser(el.pubkey);
  };

  return (
    <Link
      href={{
        pathname: "/",
        query: { name: `${el.name}`, address: `${el.pubkey}` },
      }}
    >
      <a
        className={`${Style.Card} ${active ? Style.active : ""}`}
        onClick={handleOpen}
      >
        <span className={Style.avatar}>
          {(el.name || "?").charAt(0).toUpperCase()}
        </span>
        <div className={Style.meta}>
          <h4 className={Style.name}>{el.name}</h4>
          <small className={Style.addr}>
            {el.pubkey.slice(0, 6)}…{el.pubkey.slice(-4)}
          </small>
        </div>
        <span className={Style.online} />
      </a>
    </Link>
  );
};

export default Card;
