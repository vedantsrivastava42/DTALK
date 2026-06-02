import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import Style from "./Chat.module.css";
import { formatMessageTime, formatDayLabel } from "../../../Utils/apiFeature";
import { Loader } from "../../index";

const Chat = ({
  functionName,
  readMessage,
  friendMsg,
  userName,
  loading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({ name: "", address: "" });

  const router = useRouter();
  const endRef = useRef(null);

  // Sync the active conversation from the URL query and load it
  useEffect(() => {
    if (!router.isReady) return;
    const { name, address } = router.query;
    if (address) {
      setChatData({ name, address });
      readMessage(address);
      readUser(address);
    }
  }, [router.isReady, router.query.address]);

  // Auto-scroll to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [friendMsg]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const sent = await functionName({
      msg: message,
      address: chatData.address || router.query.address,
    });
    if (sent) setMessage("");
  };

  const active = currentUserName && currentUserAddress;

  if (!active) {
    return (
      <div className={Style.placeholder}>
        <span className={Style.placeholderIcon}>💬</span>
        <h3>Your messages</h3>
        <p>Select a conversation from the left to start chatting securely.</p>
      </div>
    );
  }

  return (
    <div className={Style.Chat}>
      {/* HEADER */}
      <div className={Style.header}>
        <span className={Style.avatar}>
          {currentUserName.charAt(0).toUpperCase()}
        </span>
        <div className={Style.headerMeta}>
          <h4>{currentUserName}</h4>
          <small>
            {currentUserAddress.slice(0, 8)}…{currentUserAddress.slice(-6)}
          </small>
        </div>
        <span className={Style.statusPill}>● Active</span>
      </div>

      {/* MESSAGES */}
      <div className={Style.messages}>
        {friendMsg.length === 0 ? (
          <div className={Style.noMsg}>
            No messages yet. Say hello 👋
          </div>
        ) : (
          (() => {
            let lastDay = null;
            let lastSender = null;

            return friendMsg.map((el, i) => {
              const incoming =
                el.sender?.toLowerCase() === chatData.address?.toLowerCase();

              // Day separator whenever the calendar day changes
              const dayLabel = formatDayLabel(el.timestamp);
              const showDivider = dayLabel !== lastDay;
              lastDay = dayLabel;

              // Group consecutive messages from the same sender (reset on a new day)
              const grouped = !showDivider && el.sender === lastSender;
              lastSender = el.sender;

              return (
                <React.Fragment key={i}>
                  {showDivider && (
                    <div className={Style.divider}>
                      <span>{dayLabel}</span>
                    </div>
                  )}
                  <div
                    className={`${Style.row} ${
                      incoming ? Style.rowIn : Style.rowOut
                    } ${grouped ? Style.grouped : ""}`}
                  >
                    <div className={Style.bubble}>
                      {!grouped && (
                        <span className={Style.senderName}>
                          {incoming ? chatData.name : userName}
                        </span>
                      )}
                      <p className={Style.text}>{el.msg}</p>
                      <span className={Style.meta}>
                        <span className={Style.time}>
                          {formatMessageTime(el.timestamp)}
                        </span>
                        {!incoming && (
                          <svg
                            className={Style.tick}
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-label="Sent"
                          >
                            <path
                              d="M2 13l4 4L13 8m4-1l-6 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            });
          })()
        )}
        <div ref={endRef} />
      </div>

      {/* COMPOSER */}
      <div className={Style.composer}>
        <input
          type="text"
          placeholder="Type a message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
          disabled={loading}
        />
        <button
          className={Style.sendBtn}
          onClick={handleSend}
          disabled={loading || !message.trim()}
          aria-label="Send"
        >
          {loading ? (
            <Loader />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12l16-8-6 16-3-7-7-1z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.15"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
