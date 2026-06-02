import React, { useState, useContext } from "react";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NavBar.module.css";
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Model } from "../index";
import images from "../../assets";

const shorten = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

const NavBar = () => {
  const menuItems = [
    { menu: "Chat", link: "/" },
    { menu: "Discover", link: "/alluser" },
    { menu: "About", link: "/about" },
  ];

  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    account,
    userName,
    friendLists,
    connectWallet,
    disconnectWallet,
    createAccount,
  } = useContext(ChatAppContect);

  const hasAccount = !!userName;

  const handleAccountClick = () => {
    if (hasAccount) setOpenProfile((v) => !v);
    else setOpenModel(true);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      /* clipboard may be unavailable */
    }
  };

  const handleLogout = () => {
    setOpenProfile(false);
    disconnectWallet();
  };

  return (
    <header className={Style.NavBar}>
      <div className={Style.inner}>
        {/* BRAND */}
        <Link href="/">
          <a className={Style.brand}>
            <span className={Style.logoMark}>D</span>
            <span className={Style.brandText}>
              De<span className="gradient-text">TALK</span>
            </span>
          </a>
        </Link>

        {/* DESKTOP MENU */}
        <nav className={Style.menu}>
          {menuItems.map((el, i) => (
            <Link key={i} href={el.link}>
              <a className={Style.menuItem}>{el.menu}</a>
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className={Style.right}>
          {account === "" ? (
            <button className={Style.connectBtn} onClick={connectWallet}>
              <span className={Style.dot} />
              Connect Wallet
            </button>
          ) : (
            <div className={Style.accountWrap}>
              <button className={Style.accountBtn} onClick={handleAccountClick}>
                <span className={Style.avatar}>
                  {(userName || "?").charAt(0).toUpperCase()}
                </span>
                <span className={Style.accountMeta}>
                  <span className={Style.accountName}>
                    {userName || "Create Account"}
                  </span>
                  <span className={Style.accountAddr}>{shorten(account)}</span>
                </span>
              </button>

              {/* PROFILE DROPDOWN */}
              {hasAccount && openProfile && (
                <>
                  <div
                    className={Style.profileBackdrop}
                    onClick={() => setOpenProfile(false)}
                  />
                  <div className={Style.profile}>
                    <div className={Style.profileHeader}>
                      <span className={Style.profileAvatar}>
                        {userName.charAt(0).toUpperCase()}
                      </span>
                      <div className={Style.profileName}>
                        <strong>{userName}</strong>
                        <span>Web3 identity</span>
                      </div>
                    </div>

                    <div className={Style.profileRow}>
                      <span className={Style.profileLabel}>Wallet ID</span>
                      <button
                        className={Style.copyBtn}
                        onClick={copyAddress}
                        title="Copy address"
                      >
                        <span className={Style.profileAddr}>
                          {shorten(account)}
                        </span>
                        <span className={Style.copyHint}>
                          {copied ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>

                    <div className={Style.profileRow}>
                      <span className={Style.profileLabel}>Friends</span>
                      <span className={Style.friendCount}>
                        {friendLists?.length || 0}
                      </span>
                    </div>

                    <button
                      className={Style.logoutBtn}
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className={Style.burger}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className={Style.mobileMenu}>
          {menuItems.map((el, i) => (
            <Link key={i} href={el.link}>
              <a className={Style.mobileItem} onClick={() => setOpen(false)}>
                {el.menu}
              </a>
            </Link>
          ))}
        </div>
      )}

      {/* CREATE ACCOUNT MODAL */}
      {openModel && (
        <Model
          openBox={setOpenModel}
          title="Welcome to"
          head="DeTALK"
          info="A decentralized chat that lives on-chain. Pick a username to create your web3 identity — secured by your wallet, owned by you."
          image={images.hero}
          functionName={createAccount}
          address={account}
          singleField={!hasAccount}
        />
      )}
    </header>
  );
};

export default NavBar;
