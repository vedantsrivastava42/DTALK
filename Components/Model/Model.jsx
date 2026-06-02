import React, { useState, useContext, useEffect } from "react";

//INTERNAL IMPORT
import Style from "./Model.module.css";
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Loader } from "../../Components/index";

const Model = ({
  openBox,
  title,
  address,
  head,
  info,
  functionName,
  singleField = false,
}) => {
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address || "");

  const { loading } = useContext(ChatAppContect);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !loading && openBox(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openBox, loading]);

  const handleSubmit = async () => {
    const result = await functionName(
      singleField ? { name } : { name, userAddress }
    );
    if (result) openBox(false);
  };

  return (
    <div
      className={Style.overlay}
      onClick={() => !loading && openBox(false)}
    >
      <div className={Style.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={Style.dismiss}
          onClick={() => !loading && openBox(false)}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={Style.left}>
          <div className={Style.glow} />
          <span className={Style.badge}>web3 · on-chain</span>
          <h2 className={Style.bigLogo}>
            De<span className="gradient-text">TALK</span>
          </h2>
          <p className={Style.tagline}>
            Messages secured by your wallet. No servers, no middlemen.
          </p>
        </div>

        <div className={Style.right}>
          <h3 className={Style.title}>
            {title} <span className="gradient-text">{head}</span>
          </h3>
          <p className={Style.info}>{info}</p>

          {loading ? (
            <div className={Style.loaderWrap}>
              <Loader />
              <span>Confirming on-chain…</span>
            </div>
          ) : (
            <div className={Style.form}>
              <label className={Style.field}>
                <span>Username</span>
                <input
                  type="text"
                  placeholder="e.g. satoshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </label>

              {!singleField && (
                <label className={Style.field}>
                  <span>Wallet address</span>
                  <input
                    type="text"
                    placeholder="0x…"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                  />
                </label>
              )}

              <div className={Style.actions}>
                <button className={Style.primary} onClick={handleSubmit}>
                  Confirm
                </button>
                <button
                  className={Style.ghost}
                  onClick={() => openBox(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;
