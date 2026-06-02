import React, { useContext } from "react";

//INTERNAL IMPORT
import Style from "./Friend.module.css";
import Card from "./Card/Card";
import Chat from "./Chat/Chat";
import { ChatAppContect } from "../../Context/ChatAppContext";

const Friend = () => {
  const {
    sendMessage,
    account,
    friendLists,
    readMessage,
    userName,
    loading,
    friendMsg,
    currentUserName,
    currentUserAddress,
    readUser,
    dataLoading,
    searchTerm,
  } = useContext(ChatAppContect);

  const filtered = friendLists.filter((f) =>
    f.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={Style.Friend}>
      {/* SIDEBAR */}
      <aside className={Style.sidebar}>
        <div className={Style.sidebarHead}>
          <h3>Messages</h3>
          <span className={Style.count}>{friendLists.length}</span>
        </div>

        <div className={Style.list}>
          {dataLoading ? (
            <div className={Style.empty}>
              <span className={Style.skelDot} />
              Loading…
            </div>
          ) : !account ? (
            <div className={Style.empty}>
              <span className={Style.emoji}>🔌</span>
              Connect your wallet to start chatting.
            </div>
          ) : filtered.length === 0 ? (
            <div className={Style.empty}>
              <span className={Style.emoji}>💬</span>
              {searchTerm
                ? "No friends match your search."
                : "No friends yet — add one to begin."}
            </div>
          ) : (
            filtered.map((el, i) => (
              <Card
                key={i + 1}
                el={el}
                i={i}
                active={currentUserAddress === el.pubkey}
                readMessage={readMessage}
                readUser={readUser}
              />
            ))
          )}
        </div>
      </aside>

      {/* CHAT */}
      <section className={Style.main}>
        <Chat
          functionName={sendMessage}
          readMessage={readMessage}
          friendMsg={friendMsg}
          account={account}
          userName={userName}
          loading={loading}
          currentUserName={currentUserName}
          currentUserAddress={currentUserAddress}
          readUser={readUser}
        />
      </section>
    </div>
  );
};

export default Friend;
