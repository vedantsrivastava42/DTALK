import React from "react";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "../styles/about.module.css";

const FEATURES = [
  {
    icon: "🔐",
    title: "Decentralized identity",
    text: "Create a username tied to your wallet. No email, no password — your MetaMask account is your login.",
  },
  {
    icon: "💬",
    title: "On-chain messaging",
    text: "Every message is a transaction stored on the blockchain. No central server can read, edit, or delete your chats.",
  },
  {
    icon: "🤝",
    title: "Friend system",
    text: "Add friends by username and wallet address, then exchange private messages directly through the smart contract.",
  },
  {
    icon: "🧭",
    title: "Discover users",
    text: "Browse everyone registered on Synapse (excluding yourself and existing friends) and send a friend request.",
  },
  {
    icon: "⚡",
    title: "Live wallet sync",
    text: "Switch accounts or networks in MetaMask and the app re-syncs automatically — no manual refresh needed.",
  },
  {
    icon: "🌐",
    title: "Runs on Polygon",
    text: "Built on the Polygon Amoy testnet for fast, low-cost transactions while keeping full Web3 ownership.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Connect your wallet",
    text: "Click “Connect Wallet” in the navbar. Synapse requests your MetaMask account and switches you to the Polygon Amoy network.",
  },
  {
    n: "02",
    title: "Create your account",
    text: "Pick a username. This calls the createAccount function on the smart contract, registering your on-chain identity.",
  },
  {
    n: "03",
    title: "Add friends",
    text: "Use “Add Friend” or the Discover page to add someone by their username and wallet address.",
  },
  {
    n: "04",
    title: "Start chatting",
    text: "Open a conversation and send a message. Each message is confirmed on-chain and visible to both participants.",
  },
];

const STACK = [
  "Next.js",
  "React",
  "ethers.js",
  "Web3Modal",
  "Solidity",
  "Hardhat",
  "Polygon Amoy",
  "MetaMask",
];

const About = () => {
  return (
    <div className={Style.wrap}>
      {/* HERO */}
      <header className={Style.hero}>
        <span className={Style.tag}>About the project</span>
        <h1 className={Style.title}>
          What is <span className="gradient-text">Synapse</span>?
        </h1>
        <p className={Style.lead}>
          Synapse is a fully decentralized chat application built on Web3. Instead
          of relying on a company's servers, it runs on a blockchain smart
          contract — your identity, your friends, and every message you send are
          owned by you and secured by your crypto wallet.
        </p>
        <div className={Style.heroActions}>
          <Link href="/">
            <a className={Style.primary}>Launch Chat</a>
          </Link>
          <Link href="/alluser">
            <a className={Style.ghost}>Discover Users</a>
          </Link>
        </div>
      </header>

      {/* FEATURES */}
      <section className={Style.section}>
        <h2 className={Style.h2}>Features</h2>
        <div className={Style.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={Style.card}>
              <span className={Style.cardIcon}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={Style.section}>
        <h2 className={Style.h2}>How it works</h2>
        <div className={Style.steps}>
          {STEPS.map((s, i) => (
            <div key={i} className={Style.step}>
              <span className={Style.stepNum}>{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className={Style.section}>
        <h2 className={Style.h2}>Built with</h2>
        <div className={Style.chips}>
          {STACK.map((t, i) => (
            <span key={i} className={Style.chip}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* NOTE */}
      <section className={Style.note}>
        <h3>⚠️ A note on requirements</h3>
        <p>
          Synapse is a Web3 app. To send and read messages you need the MetaMask
          browser extension installed and connected to the{" "}
          <strong>Polygon Amoy</strong> testnet. Transactions require a small
          amount of test MATIC for gas. Without a connected wallet you can browse
          the interface, but on-chain actions will prompt you to connect first.
        </p>
      </section>

      <footer className={Style.footer}>
        Built on the blockchain · Owned by you · © Synapse
      </footer>
    </div>
  );
};

export default About;
