export const MOCK_USER = {
  name: 'Koushith Amin',
  email: 'koushith@def.com',
  imageUrl:
    'https://pbs.twimg.com/profile_images/1733931010977640448/KTlA02mC_400x400.jpg',
};

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New transaction detected',
    description: '+5,000 USDC received in Treasury Wallet',
    time: '2h ago',
    unread: true,
    icon: '↓',
  },
  {
    id: 2,
    title: 'Wallet balance updated',
    description: 'Operations wallet balance changed by 15%',
    time: '5h ago',
    unread: true,
    icon: '📊',
  },
  {
    id: 3,
    title: 'Weekly report ready',
    description: 'Your weekly transaction summary is ready',
    time: '1d ago',
    unread: true,
    icon: '📄',
  },
  {
    id: 4,
    title: 'New team member',
    description: 'Sarah Johnson joined your workspace',
    time: '2d ago',
    unread: false,
    icon: '👤',
  },
];
