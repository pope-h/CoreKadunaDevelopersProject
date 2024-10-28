DApp README

Introduction
Welcome to the Metacrafters ATM decentralized application (DApp)!

This DApp allows users to send messages on the Ethereum blockchain using a smart contract. Users can connect their MetaMask wallet to interact with the DApp and send messages.

Getting Started
To run this DApp locally, follow these steps:

Clone the repository:

bash
Copy code
git clone <repository-url>
Install dependencies:

Copy code
npm install
Run the DApp:

sql
Copy code
npm start
Make sure you have MetaMask installed in your browser.

Connect your MetaMask wallet to the DApp by clicking on the "Connect Metamask Wallet" button.

Interact with the DApp by setting messages, getting the last message sent, and getting the sender of the last message.

Functionality
Setting a Favourite Drink
Enter a message in the input field under the "Set Favourite Drink" section.
Click on the "Set Favourite Drink" button.
Your message will be sent to the blockchain.
Getting the Favourite Drink
Click on the "Get Favourite Drink" button under the "Get Favourite Drink" section.
The last Favourite Drink sent on the blockchain will be displayed.
Getting the Last Sender
Click on the "Get Last Sender" button under the "Get Last Sender" section.
The address of the sender who sent the last message will be displayed.
Resetting Messages
Click on the "Reset" button under the "Reset" section to clear the last message and last sender.
Smart Contract
The smart contract MessageContract.sol deployed on the Localhost blockchain facilitates message sending and retrieval.

Technologies Used
React.js for the front-end development.
Solidity for smart contract development.
MetaMask for wallet interaction.
ethers.js for Ethereum interaction.
License
This DApp is licensed under the MIT License.
