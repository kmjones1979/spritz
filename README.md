# Akash Auth

A modern Next.js authentication application supporting **passkey** (WebAuthn) login via Pimlico smart accounts and **wallet** connection via WalletConnect.

![Akash Auth](https://via.placeholder.com/800x400/1a1625/8b5cf6?text=Akash+Auth)

## Features

- 🔐 **Passkey Authentication** - Passwordless login using device biometrics (Face ID, Touch ID, Windows Hello)
- 💼 **Wallet Connection** - Connect MetaMask, Coinbase Wallet, and 300+ wallets via WalletConnect
- 🧠 **Smart Accounts** - ERC-4337 smart accounts powered by Pimlico and Safe
- ⛽ **Gasless Transactions** - Sponsored transactions via Pimlico Paymaster
- 🎨 **Beautiful UI** - Modern, animated interface with glass morphism effects

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Web3**: viem, wagmi, permissionless.js
- **Account Abstraction**: Pimlico, Safe Smart Accounts
- **Wallet Connection**: WalletConnect AppKit

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd eth-akash
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```env
# Required for WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Required for Pimlico Smart Accounts
NEXT_PUBLIC_PIMLICO_API_KEY=your_pimlico_api_key
```

### Getting API Keys

#### WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID

#### Pimlico API Key
1. Go to [Pimlico Dashboard](https://dashboard.pimlico.io/)
2. Create an account and project
3. Copy your API key
4. Make sure to enable Base Sepolia network

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Passkey Authentication

1. **Registration**: Creates a WebAuthn credential (passkey) stored securely on your device
2. **Smart Account**: Deploys an ERC-4337 Safe smart account with the passkey as the signer
3. **Login**: Authenticates using device biometrics to access your smart account

### Wallet Connection

1. **Connect**: Opens WalletConnect modal with 300+ supported wallets
2. **Sign**: Standard EOA wallet connection for traditional Web3 interactions

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and animations
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Main login page
├── components/
│   ├── PasskeyAuth.tsx  # Passkey authentication component
│   └── WalletConnect.tsx # Wallet connection component
├── config/
│   └── wagmi.ts         # Wagmi and WalletConnect configuration
├── context/
│   └── Web3Provider.tsx # Web3 context provider
└── hooks/
    └── usePasskey.ts    # Passkey authentication hook
```

## Networks

Currently configured for:
- **Base Sepolia** (Testnet) - For passkey smart accounts
- **Ethereum Mainnet** - For wallet connection
- **Sepolia** - Ethereum testnet
- **Base** - L2 mainnet

## Security Considerations

- Passkey credentials are stored locally in the browser
- Smart accounts use Safe's battle-tested infrastructure
- WebAuthn provides phishing-resistant authentication
- No private keys are ever exposed to the application

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with 💜 using [Pimlico](https://pimlico.io) and [WalletConnect](https://walletconnect.com)
