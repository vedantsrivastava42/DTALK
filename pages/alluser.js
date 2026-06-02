import React, { useContext } from "react";

//INTERNAL IMPORT
import { UserCard } from "../Components/index";
import Style from "../styles/alluser.module.css";
import { ChatAppContect } from "../Context/ChatAppContext";

const AllUser = () => {
  const { userLists, addFriends, account, dataLoading } =
    useContext(ChatAppContect);

  return (
    <div className={Style.wrap}>
      <header className={Style.head}>
        <span className={Style.tag}>Discover</span>
        <h1 className={Style.title}>
          Find your <span className="gradient-text">friends</span>
        </h1>
        <p className={Style.sub}>
          Everyone on DeTALK you haven't added yet. Send a request to start a
          private on-chain chat.
        </p>
      </header>

      {!account ? (
        <div className={Style.state}>
          <span>🔌</span>
          <p>Connect your wallet to discover other users.</p>
        </div>
      ) : dataLoading ? (
        <div className={Style.state}>
          <span className={Style.spin} />
          <p>Loading users…</p>
        </div>
      ) : userLists.length === 0 ? (
        <div className={Style.state}>
          <span>🎉</span>
          <p>You've already added everyone here!</p>
        </div>
      ) : (
        <div className={Style.grid}>
          {userLists.map((el, i) => (
            <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUser;
