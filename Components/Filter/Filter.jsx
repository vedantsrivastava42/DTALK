import React, { useState, useContext } from "react";

//INTERNAL IMPORT
import Style from "./Filter.module.css";
import images from "../../assets";
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Model } from "../index";

const Filter = () => {
  const { addFriends, searchTerm, setSearchTerm } =
    useContext(ChatAppContect);

  const [addFriend, setAddFriend] = useState(false);

  return (
    <div className={Style.Filter}>
      <div className={Style.search}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path
            d="M20 20l-3-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search friends…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className={Style.clearInput}
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <button className={Style.addBtn} onClick={() => setAddFriend(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        Add Friend
      </button>

      {addFriend && (
        <Model
          openBox={setAddFriend}
          title="Add a"
          head="Friend"
          info="Enter your friend's username and wallet address to start a private, on-chain conversation."
          image={images.hero}
          functionName={addFriends}
          singleField={false}
        />
      )}
    </div>
  );
};

export default Filter;
