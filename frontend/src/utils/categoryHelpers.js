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
    Smartphones: 'linear-gradient(145deg, #1a1f3c 0%, #2d3a8c 100%)',
    Laptops:     'linear-gradient(145deg, #0d2818 0%, #1a5c35 100%)',
    Tablets:     'linear-gradient(145deg, #1e0a3d 0%, #4c1d95 100%)',
    Audio:       'linear-gradient(145deg, #2d1a0e 0%, #7c3a1a 100%)',
    Wearables:   'linear-gradient(145deg, #0d2818 0%, #1b5e33 100%)',
    Cameras:     'linear-gradient(145deg, #2d0a0a 0%, #7c1d1d 100%)',
    Accessories: 'linear-gradient(145deg, #0c1a3d 0%, #1d4ed8 100%)',
    Electronics: 'linear-gradient(145deg, #2d1a00 0%, #92400e 100%)',
    Gaming:      'linear-gradient(145deg, #1e0a3d 0%, #5b21b6 100%)',
    Storage:     'linear-gradient(145deg, #0d2818 0%, #1a5c35 100%)',
    Networking:  'linear-gradient(145deg, #0c1a3d 0%, #075985 100%)',
    Monitors:    'linear-gradient(145deg, #1c1c1e 0%, #3A3A3F 100%)',
  };
  return map[cat] || 'linear-gradient(145deg, #1E1E42 0%, #2A2A55 100%)';
}
