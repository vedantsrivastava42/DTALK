import React, { useContext } from "react";

//INTERNAL IMPORT
import Style from "./Notification.module.css";
import { ChatAppContect } from "../../Context/ChatAppContext";

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

const Notification = () => {
  const { notifications, removeNotification } = useContext(ChatAppContect);

  if (!notifications?.length) return null;

  return (
    <div className={Style.wrap}>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`${Style.toast} ${Style[n.type] || Style.info}`}
          role="alert"
        >
          <span className={Style.icon}>{ICONS[n.type] || ICONS.info}</span>
          <div className={Style.body}>
            {n.title && <strong className={Style.title}>{n.title}</strong>}
            <span className={Style.msg}>{n.message}</span>
          </div>
          <button
            className={Style.close}
            onClick={() => removeNotification(n.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
          <span className={Style.bar} />
        </div>
      ))}
    </div>
  );
};

export default Notification;
