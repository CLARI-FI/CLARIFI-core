
# CLARIFI-core

**CLARIFI** is a comprehensive decentralized finance (DeFi) platform designed to provide a range of financial services on the Stacks blockchain. The platform includes features such as NFT trading, Dutch auctions, token swaps, liquidity pools, and more, making decentralized finance accessible and efficient for users across the globe.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Contracts](#contracts)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

CLARIFI-core is a suite of decentralized applications (dApps) and smart contracts that enable users to engage in various DeFi activities, such as trading NFTs, participating in Dutch auctions, swapping tokens, and providing liquidity. Built on the Stacks blockchain, CLARIFI-core leverages SIP-10 tokens and STX to offer a secure and decentralized platform for financial interactions.

## Features

1. **SIP-10 Token Integration**: CLARIFI-core uses SIP-10 tokens, enabling users to interact seamlessly with the platform’s applications. The platform supports multiple tokens for transactions, with more tokens to be added over time.

2. **NFT Trading**: Users can trade NFTs using STX and supported SIP-10 tokens. A dedicated marketplace facilitates the buying, selling, and listing of NFTs.

3. **Dutch Auctions**: The platform includes a Dutch auction system for NFT bidding, where the price decreases over time until a bid is placed.

4. **Token Swaps**: Decentralized token swaps allow users to exchange tokens directly on the platform.

5. **Liquidity Pools**: Users can add liquidity to pools to support token swaps and benefit from arbitrage opportunities.

6. **Token Bridging**: Efficiently transfer tokens between different networks within the Stacks ecosystem using the platform’s bridging features.

7. **Future Features**: The platform plans to introduce Real World Assets (RWA) and Real Estate Investment Trusts (REITs) in future phases.

## Contracts

### 1. **SIP-10 Token Contract**
   - **Purpose**: Implements a standard SIP-10 fungible token that can be used across the CLARIFI platform.
   - **Key Functions**: Minting, transferring, and managing token balances.

### 2. **NFT Contract**
   - **Purpose**: Manages the creation, ownership, and transfer of non-fungible tokens (NFTs).
   - **Key Functions**: Minting, transferring, burning NFTs, and managing metadata.

### 3. **NFT Marketplace Contract**
   - **Purpose**: Facilitates the listing, buying, and selling of NFTs on the platform.
   - **Key Functions**: List NFTs, purchase NFTs, cancel listings, and view listings.

### 4. **NFT Dutch Auction Contract**
   - **Purpose**: Enables Dutch auctions for NFTs, where the price decreases over time until a buyer places a bid.
   - **Key Functions**: Start auctions, buy from auctions, cancel auctions, and view auction details.

### 5. **Marketplace Fee Contract**
   - **Purpose**: Manages fee collection from marketplace transactions.
   - **Key Functions**: Set and collect fees, and handle transaction fees.

### 6. **Token Support Contract**
   - **Purpose**: Adds support for additional tokens in the marketplace and auction contracts.
   - **Key Functions**: Add, remove, and check supported tokens, and handle token-based transactions.

## Installation

To set up the CLARIFI-core project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/)
- [Clarinet](https://clarinet.io/) (for Stacks smart contract development)

### Clone the Repository

```bash
git clone https://git@github.com:CLARI-FI/CLARIFI-core.git
cd CLARIFI-core
```

### Install Dependencies

```bash
npm install
```

### Compile Smart Contracts

Before running tests or deploying contracts, compile the smart contracts:

```bash
clarinet check
```

## Usage

### Deploying Contracts

To deploy the contracts to a local testnet or mainnet, update the `Clarinet.toml` configuration file with your deployment details, then run:

```bash
# sample command to deploy contracts
```

### Interacting with Contracts

You can interact with the deployed contracts using the Clarinet CLI or through the Stacks Explorer. For example, to list an NFT for sale, use:

```bash
# sample command for contract interaction
```

Replace `<nft-contract>` with the actual NFT contract address.

## Testing

Tests are written using Vitest and the Clarinet SDK. To run the tests, use:

```bash
npm run test
```

This will execute all the test cases defined for the SIP-10 Token, NFT, Marketplace, Dutch Auction, Fee, and Token Support contracts.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Write tests for your changes.
4. Ensure all tests pass and your code is well-documented.
5. Submit a pull request with a clear description of your changes.

### Code Style

This project follows the standard JavaScript and Clarity coding conventions. Please format your code accordingly.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.