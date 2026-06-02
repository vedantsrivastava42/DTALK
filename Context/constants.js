import chatApp from "./ChatApp.json";

//HARDHAT ADDRESS
// export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//PLOYGON ADDRESS
export const ChatAppAddress = "0x8580056507BBf219B1d2afEBe6a6F0168d5167B5";
export const ChatAppABI = chatApp.abi;

//NETWORK
const networks = {
  polygon_amoy: {
    chainId: `0x${Number(80002).toString(16)}`,
    chainName: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://www.oklink.com/amoy"],
  },
  polygon_mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/bsc"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  base_mainnet: {
    chainId: `0x${Number(8453).toString(16)}`,
    chainName: "Base Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  base_sepolia: {
    chainId: `0x${Number(84532).toString(16)}`,
    chainName: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "localhost",
    nativeCurrency: {
      name: "GO",
      symbol: "GO",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

// The chain we force every transaction to run on.
export const ACTIVE_NETWORK = "polygon_amoy";
export const ACTIVE_CHAIN_ID = networks[ACTIVE_NETWORK].chainId; // 0x13882 (80002)

/* Actively SWITCH the wallet to the target network. `wallet_switchEthereumChain`
   is what changes the active chain — `wallet_addEthereumChain` alone only adds it
   to MetaMask and leaves you on whatever chain you were already on. */
const switchOrAddNetwork = async (networkName) => {
  if (!window.ethereum) throw new Error("NO_WALLET");
  const target = networks[networkName];

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: target.chainId }],
    });
  } catch (err) {
    // 4902 = the chain isn't in MetaMask yet → add it (adding also switches to it)
    const code = err?.code ?? err?.data?.originalError?.code;
    if (code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [target],
      });
    } else {
      // e.g. 4001 = user rejected the switch — bubble up so the UI can warn
      throw err;
    }
  }
};

export const handleNetworkSwitch = async () => {
  await switchOrAddNetwork(ACTIVE_NETWORK);
};
