import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import staking_abi from "../artifacts/contracts/userProfile.sol/UserProfile.json";
import staking_abi from "../artifacts/contracts/userProfile.sol/StakingContract.json";
import sCore_abi from "../artifacts/contracts/sCore.sol/Score.json";

export default function CoreStakingPage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [stakingContract, setStakingContract] = useState(undefined);
  const [sCoreContract, setScoreContract] = useState(undefined);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const contractAddress = "0xA98525e717B90D86950f62aE1b6373D2FA1d34E1";
  const sCoreAddress = "0xcdbDBa075c33D8d7996d45a06D2e1b39880F759a";
  const scoreABI = sCore_abi.abi;
  const stakingABI = staking_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Get the staking contract
    getStakingContract();
  };

  const getStakingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const stakingContractInstance = new ethers.Contract(
      contractAddress,
      stakingABI,
      signer
    );
    const scoreContractInstance = new ethers.Contract(
      sCoreAddress,
      scoreABI,
      signer
    );

    setScoreContract(scoreContractInstance);

    setStakingContract(stakingContractInstance);
  };

  // Stake function
  const handleStake = async () => {
    if (stakingContract && stakeAmount > 0) {
      try {
        const amountInWei = ethers.utils.parseEther(stakeAmount); // Convert to Wei
        const t = await sCoreContract.approve(contractAddress, stakeAmount);
        await t.wait();
        const tx = await stakingContract.stake(stakeAmount, 10);
        await tx.wait();
        alert(`Successfully staked ${stakeAmount} CORE`);
        setStakeAmount(""); // Reset stake input
        fetchStakedAmount(); // Refresh staked balance
      } catch (error) {
        console.error("Error during staking:", error);
      }
    }
  };

  // Withdraw function
  const handleWithdraw = async () => {
    if (stakingContract && withdrawAmount > 0) {
      try {
        const tx = await stakingContract.unstake();
        await tx.wait();
        alert(`Successfully withdrew ${withdrawAmount} CORE`);
        setWithdrawAmount(""); // Reset withdraw input
        fetchStakedAmount(); // Refresh staked balance
      } catch (error) {
        console.error("Error during withdrawal:", error);
      }
    }
  };

  // Fetch staked amount for connected account
  const fetchStakedAmount = async () => {
    if (stakingContract && account) {
      try {
        const balance = await stakingContract.checkUserStakedBalance(account);
        setStakedAmount(Number(balance));
      } catch (error) {
        console.error("Error fetching staked amount:", error);
      }
    }
  };

  useEffect(() => {
    getWallet();
    fetchStakedAmount();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Core Staking DApp</h1>
      </header>
      <div className="user-interface">
        {!ethWallet && (
          <p className="connect-message">
            Please install MetaMask to use this dApp.
          </p>
        )}
        {ethWallet && !account && (
          <button className="connect-button" onClick={connectAccount}>
            Connect Metamask Wallet
          </button>
        )}
        {account && (
          <>
            <p>Connected Account: {account}</p>
            <p>Staked Balance: {stakedAmount} CORE</p>

            <div className="action-section">
              <h2>Stake CORE</h2>
              <input
                className="input-field"
                type="number"
                placeholder="Amount to stake"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
              <button className="action-button" onClick={handleStake}>
                Stake
              </button>
            </div>

            <div className="action-section">
              <h2>Withdraw CORE</h2>
              <input
                className="input-field"
                type="number"
                placeholder="Amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              />
              <button className="action-button" onClick={handleWithdraw}>
                Withdraw
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        header {
          margin-bottom: 20px;
        }
        .connect-message {
          font-size: 18px;
          color: red;
          margin-bottom: 20px;
        }
        .connect-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .user-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .action-section {
          margin-top: 20px;
        }
        .input-field {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 300px;
          font-size: 16px;
        }
        .action-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
