export function categoryIcon(cat) {
  const map = {
    Smartphones: '📱', Laptops: '💻', Tablets: '📲', Audio: '🎧',
    Wearables: '⌚', Cameras: '📷', Accessories: '🖱️', Electronics: '⚡',
    Gaming: '🎮', Storage: '💾', Networking: '📡', Monitors: '🖥️',
  };
  return map[cat] || '📦';
}

export function categoryGradient(cat) {
  const map = {
    Smartphones: 'linear-gradient(145deg, #E8F0FE 0%, #C7D7FC 100%)',
    Laptops:     'linear-gradient(145deg, #F0F4FF 0%, #D9E3FF 100%)',
    Tablets:     'linear-gradient(145deg, #EDE9FE 0%, #D4CAFE 100%)',
    Audio:       'linear-gradient(145deg, #FFF7ED 0%, #FDE8C8 100%)',
    Wearables:   'linear-gradient(145deg, #F0FDF4 0%, #BBFCD0 100%)',
    Cameras:     'linear-gradient(145deg, #FFF1F2 0%, #FFD1D6 100%)',
    Accessories: 'linear-gradient(145deg, #F0F9FF 0%, #BFEDFF 100%)',
    Electronics: 'linear-gradient(145deg, #FEFCE8 0%, #FEF08A 100%)',
    Gaming:      'linear-gradient(145deg, #FDF4FF 0%, #EDCAFE 100%)',
    Storage:     'linear-gradient(145deg, #F0FDF4 0%, #C8F7DC 100%)',
    Networking:  'linear-gradient(145deg, #EFF6FF 0%, #BFDBFE 100%)',
    Monitors:    'linear-gradient(145deg, #F8FAFC 0%, #E2E8F0 100%)',
  };
  return map[cat] || 'linear-gradient(145deg, #F4F4F5 0%, #E4E4E7 100%)';
}
