export type InformationCardData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  navigateTo:string;
};

export const Information_Card_Data: InformationCardData[] = [
  {
    id: 'signup',
    title: 'Sign Up',
    description:"Getting started is easy! Pick a username and drop your email. Then you're ready to take the next step with us.",
    imageUrl: '/signup.svg', 
    navigateTo: "/createAccount"
  },
  {
    id: 'wallet',
    title: 'Setup Your Wallet',
    description:'Choose a wallet and connect it to BidChain. Start participating in live NFT auctions in minutes.',
    imageUrl: '/setup-wallet.svg',
    navigateTo: "/addFunds"
  },
  {
    id: 'browse',
    title: 'Start Browsing',
    description:'Dive right in! Explore categories or search for that one piece that catches your eye.',
    imageUrl: '/start-earning.svg',
    navigateTo:"/marketplace"
  },
];
