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

const UNS = 'https://images.unsplash.com/photo-';
const Q   = '?auto=format&fit=crop&w=400&q=80';

const IMAGE_MAP = {
  'wireless earbuds': `${UNS}1590658268037-6bf12165a8df${Q}`,
  'headphones':       `${UNS}1505740420928-5e560c06d30e${Q}`,
  'iphone':           `${UNS}1510557880182-3d4d3cba35a5${Q}`,
  'samsung phone':    `${UNS}1610945264803-c22b62d2a7b3${Q}`,
  'oneplus phone':    `${UNS}1601784551446-20c326a4ccf6${Q}`,
  'xiaomi phone':     `${UNS}1598327105854-764ff9e6e730${Q}`,
  'google pixel':     `${UNS}1565849904461-04a58ad377e0${Q}`,
  'smartphone':       `${UNS}1591337676887-a217a8c3d9a6${Q}`,
  'macbook laptop':   `${UNS}1517336714731-489689fd1ca8${Q}`,
  'gaming laptop':    `${UNS}1593640495253-23196b27a87f${Q}`,
  'laptop computer':  `${UNS}1496181133206-80ce9b88a853${Q}`,
  'ipad tablet':      `${UNS}1544244015-0df4b3ffc6b0${Q}`,
  'android tablet':   `${UNS}1544244015-0df4b3ffc6b0${Q}`,
  'apple watch':      `${UNS}1523275335684-37898b6baf30${Q}`,
  'smartwatch':       `${UNS}1523275335684-37898b6baf30${Q}`,
  'digital camera':   `${UNS}1502920917128-1aa500764f4c${Q}`,
  'webcam':           `${UNS}1502920917128-1aa500764f4c${Q}`,
  'mechanical keyboard': `${UNS}1587829741301-dc798b83add3${Q}`,
  'computer mouse':   `${UNS}1527864550417-7fd91fc51a46${Q}`,
  'computer monitor': `${UNS}1527443224154-c4a3942d3acf${Q}`,
  'bluetooth speaker':`${UNS}1608043152269-423dbba4e7e1${Q}`,
  'phone charger':    `${UNS}1583394293010-8bd2a0d2c803${Q}`,
  'laptop bag':       `${UNS}1553062407-98eeb64c6a62${Q}`,
  'wifi router':      `${UNS}1558494949-ef010cbdcc31${Q}`,
};

export function getProductImageUrl(name) {
  const n = (name || '').toLowerCase();
  let key = '';

  if (n.includes('airpods') || n.includes('earbud') || n.includes('buds'))              key = 'wireless earbuds';
  else if (n.includes('headphone') || n.includes('wh-') || n.includes('xm')
        || n.includes('boat') || n.includes('rockerz') || n.includes('jbl')
        || n.includes('bose') || n.includes('sennheiser'))                               key = 'headphones';
  else if (n.includes('webcam') || n.includes('c920'))                                  key = 'webcam';
  else if (n.includes('macbook'))                                                        key = 'macbook laptop';
  else if (n.includes('iphone') || (n.includes('apple') && !n.includes('watch') && !n.includes('ipad'))) key = 'iphone';
  else if (n.includes('samsung') && !n.includes('bud'))                                 key = 'samsung phone';
  else if (n.includes('oneplus'))                                                        key = 'oneplus phone';
  else if (n.includes('xiaomi') && !n.includes('bud'))                                  key = 'xiaomi phone';
  else if (n.includes('pixel'))                                                          key = 'google pixel';
  else if (n.includes('smartphone') || n.includes('phone')
        || n.includes('oppo') || n.includes('vivo')
        || n.includes('realme') || n.includes('motorola') || n.includes('nokia'))        key = 'smartphone';
  else if (n.includes('rog') || n.includes('gaming laptop') || n.includes('gaming'))    key = 'gaming laptop';
  else if (n.includes('laptop') || n.includes('zenbook') || n.includes('thinkpad') || n.includes('notebook')) key = 'laptop computer';
  else if (n.includes('ipad'))                                                           key = 'ipad tablet';
  else if (n.includes('tablet') || n.includes('tab '))                                  key = 'android tablet';
  else if (n.includes('apple watch') || n.includes('watch ultra'))                      key = 'apple watch';
  else if (n.includes('watch') || n.includes('band') || n.includes('wearable'))         key = 'smartwatch';
  else if (n.includes('camera') || n.includes('alpha') || n.includes('eos'))            key = 'digital camera';
  else if (n.includes('keyboard') || n.includes('mx keys'))                             key = 'mechanical keyboard';
  else if (n.includes('mouse'))                                                          key = 'computer mouse';
  else if (n.includes('monitor') || n.includes('display'))                              key = 'computer monitor';
  else if (n.includes('speaker'))                                                        key = 'bluetooth speaker';
  else if (n.includes('charger') || n.includes('cable') || n.includes('adapter'))       key = 'phone charger';
  else if (n.includes('bag') || n.includes('backpack') || n.includes('case'))           key = 'laptop bag';
  else if (n.includes('router') || n.includes('wifi'))                                  key = 'wifi router';

  return IMAGE_MAP[key] || null;
}

