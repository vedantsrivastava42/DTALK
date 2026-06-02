import { ethers } from "ethers";
import Web3Modal from "web3modal";

import {
  ChatAppAddress,
  ChatAppABI,
  handleNetworkSwitch,
} from "../Context/constants";

export const CheckIfWalletConnected = async () => {
  if (!window.ethereum) throw new Error("NO_WALLET");
  await handleNetworkSwitch();
  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });
  return accounts[0];
};

// Backwards-compatible alias for the historical (misspelled) name
export const ChechIfWalletConnected = CheckIfWalletConnected;

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("NO_WALLET");
  await handleNetworkSwitch();
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
};

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);

export const connectingWithContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

/* Clear the cached wallet connection. MetaMask has no programmatic
   "disconnect", so we drop Web3Modal's cached provider — the app then
   treats the session as logged out until the user reconnects. */
export const disconnectWallet = async () => {
  try {
    const web3modal = new Web3Modal();
    web3modal.clearCachedProvider();
  } catch (error) {
    console.log(error);
  }
};

const pad = (n) => String(n).padStart(2, "0");

/* Solidity's block.timestamp is in SECONDS; JS Date expects milliseconds.
   ethers returns a BigNumber, but tolerate plain numbers too. */
const toDate = (time) => {
  const secs =
    typeof time?.toNumber === "function" ? time.toNumber() : Number(time);
  return new Date(secs * 1000);
};

/* "3:45 PM" — used inside each message bubble */
export const formatMessageTime = (time) => {
  const date = toDate(time);
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${pad(date.getMinutes())} ${ampm}`;
};

/* "Today" / "Yesterday" / "12 May 2026" — used for day separators */
export const formatDayLabel = (time) => {
  const date = toDate(time);
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86400000
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* Full date + time, kept for backwards compatibility */
export const converTime = (time) => {
  const date = toDate(time);
  return `${formatMessageTime(time)} · ${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};
