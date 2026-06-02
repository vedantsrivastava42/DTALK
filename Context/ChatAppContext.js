import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
  disconnectWallet,
} from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

/* Turn a raw web3/ethers error into something a human can read */
const parseError = (err, fallback) => {
  const raw =
    err?.reason ||
    err?.data?.message ||
    err?.error?.message ||
    err?.message ||
    "";

  if (raw === "NO_WALLET" || /no_wallet/i.test(raw))
    return "MetaMask not found. Please install it to continue.";
  if (/user rejected|user denied|action_rejected|4001/i.test(raw))
    return "You rejected the request in your wallet.";
  if (/insufficient funds/i.test(raw))
    return "Insufficient funds to cover gas fees.";
  if (/already exist|user already|exists/i.test(raw))
    return "This account already exists.";
  if (/network|chain|underlying network/i.test(raw))
    return "Wrong network. Please switch to Polygon Amoy.";
  return fallback;
};

export const ChatAppProvider = ({ children }) => {
  //CORE STATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [userLists, setUserLists] = useState([]);

  //UI STATE
  const [loading, setLoading] = useState(false); // tx in flight
  const [dataLoading, setDataLoading] = useState(true); // initial fetch
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);

  //ACTIVE CHAT
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();
  const idRef = useRef(0);

  /* ----------------------------- NOTIFICATIONS ----------------------------- */
  const removeNotification = useCallback((id) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type, message, title) => {
      const id = ++idRef.current;
      setNotifications((list) => [...list, { id, type, message, title }]);
      setTimeout(() => removeNotification(id), 5000);
      return id;
    },
    [removeNotification]
  );

  /* ------------------------------- DATA FETCH ------------------------------ */
  const filterUsersExcludingFriends = (allUsers, friends) => {
    const friendAddresses = new Set(friends.map((f) => f.pubkey?.toLowerCase()));
    return allUsers.filter(
      (u) => !friendAddresses.has(u.accountAddress?.toLowerCase())
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const address = await CheckIfWalletConnected();
      if (!address) {
        setDataLoading(false);
        return;
      }

      const contract = await connectingWithContract();
      setAccount(address);

      const name = await contract.getUsername(address);
      setUserName(name);

      const friends = await contract.getMyFriendList();
      setFriendLists(friends);

      const allUsers = await contract.getAllAppUser();
      const others = allUsers.filter(
        (u) => u.accountAddress.toLowerCase() !== address.toLowerCase()
      );
      setUserLists(filterUsersExcludingFriends(others, friends));
    } catch (error) {
      // Silent on initial load — user simply may not be connected yet
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ------------------------ WALLET EVENT LISTENERS ------------------------- */
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts.length) {
        setAccount("");
        setUserName("");
        setFriendLists([]);
        setUserLists([]);
        notify("info", "Wallet disconnected.");
      } else {
        fetchData();
        notify("info", "Account switched.");
      }
    };
    const handleChainChanged = () => fetchData();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener?.(
        "accountsChanged",
        handleAccountsChanged
      );
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [fetchData, notify]);

  /* ------------------------------- ACTIONS --------------------------------- */
  const handleConnectWallet = useCallback(async () => {
    try {
      const connected = await connectWallet();
      setAccount(connected);
      await fetchData();
      notify("success", "Wallet connected.");
    } catch (error) {
      notify("error", parseError(error, "Could not connect your wallet."));
    }
  }, [fetchData, notify]);

  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    setAccount("");
    setUserName("");
    setFriendLists([]);
    setFriendMsg([]);
    setUserLists([]);
    setCurrentUserName("");
    setCurrentUserAddress("");
    notify("info", "You've been logged out.");
    router.push("/");
  }, [notify, router]);

  const readMessage = useCallback(async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      setFriendMsg([]);
      console.log("No messages yet");
    }
  }, []);

  const createAccount = useCallback(
    async ({ name }) => {
      try {
        if (!name) return notify("warning", "Please enter a username.");
        if (!account)
          return notify("warning", "Connect your wallet first.");

        const contract = await connectingWithContract();
        setLoading(true);
        const tx = await contract.createAccount(name);
        await tx.wait();
        setLoading(false);
        notify("success", `Welcome, ${name}! Your account is ready.`);
        await fetchData();
        return true;
      } catch (error) {
        setLoading(false);
        notify("error", parseError(error, "Could not create your account."));
      }
    },
    [account, fetchData, notify]
  );

  const addFriends = useCallback(
    async ({ name, userAddress }) => {
      try {
        if (!name || !userAddress)
          return notify("warning", "Name and address are required.");
        if (userAddress.toLowerCase() === account.toLowerCase())
          return notify("warning", "You can't add yourself as a friend.");

        const contract = await connectingWithContract();
        setLoading(true);
        const tx = await contract.addFriend(userAddress, name);
        await tx.wait();
        setLoading(false);
        notify("success", `${name} was added to your friends.`);
        await fetchData();
        router.push("/");
        return true;
      } catch (error) {
        setLoading(false);
        notify("error", parseError(error, "Could not add this friend."));
      }
    },
    [account, fetchData, notify, router]
  );

  const sendMessage = useCallback(
    async ({ msg, address }) => {
      try {
        if (!msg?.trim()) return notify("warning", "Type a message first.");
        if (!address) return notify("warning", "No conversation selected.");

        const contract = await connectingWithContract();
        setLoading(true);
        const tx = await contract.sendMessage(address, msg);
        await tx.wait();
        setLoading(false);
        await readMessage(address);
        return true;
      } catch (error) {
        setLoading(false);
        notify("error", parseError(error, "Message could not be sent."));
      }
    },
    [notify, readMessage]
  );

  const readUser = useCallback(async (userAddress) => {
    try {
      const contract = await connectingWithContract();
      const name = await contract.getUsername(userAddress);
      setCurrentUserName(name);
      setCurrentUserAddress(userAddress);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <ChatAppContect.Provider
      value={{
        // actions
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet: handleConnectWallet,
        disconnectWallet: handleDisconnect,
        CheckIfWalletConnected,
        notify,
        removeNotification,
        // data
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        currentUserName,
        currentUserAddress,
        // ui
        loading,
        dataLoading,
        notifications,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
