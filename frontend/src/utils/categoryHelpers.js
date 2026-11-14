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
    Smartphones: 'linear-gradient(145deg, #EEF2FF 0%, #A5B4FC 100%)',
    Laptops:     'linear-gradient(145deg, #ECFDF5 0%, #6EE7B7 100%)',
    Tablets:     'linear-gradient(145deg, #EDE9FE 0%, #C4B5FD 100%)',
    Audio:       'linear-gradient(145deg, #FFF7ED 0%, #FCA57A 100%)',
    Wearables:   'linear-gradient(145deg, #F0FDF4 0%, #86EFAC 100%)',
    Cameras:     'linear-gradient(145deg, #FFF1F2 0%, #FCA5A5 100%)',
    Accessories: 'linear-gradient(145deg, #EFF6FF 0%, #93C5FD 100%)',
    Electronics: 'linear-gradient(145deg, #FEFCE8 0%, #FDE047 100%)',
    Gaming:      'linear-gradient(145deg, #FDF4FF 0%, #D8B4FE 100%)',
    Storage:     'linear-gradient(145deg, #F0FDF4 0%, #6EE7B7 100%)',
    Networking:  'linear-gradient(145deg, #EFF6FF 0%, #7DD3FC 100%)',
    Monitors:    'linear-gradient(145deg, #F8FAFC 0%, #94A3B8 100%)',
  };
  return map[cat] || 'linear-gradient(145deg, #F4F4F5 0%, #D4D4D8 100%)';
}
