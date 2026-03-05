export const MUSIC_STATIONS = [
  { id: 'none', name: 'Theme Default', category: 'System', src: '' },

  // 🎧 Chill & Lo-Fi
  { id: 'lofi', name: '☕ Lofi Hip Hop Radio', category: 'Chill & Lo-Fi', ytId: 'jfKfPfyJRdk' },
  { id: 'synth', name: '🌃 Night Synthwave', category: 'Chill & Lo-Fi', ytId: '4xDzrJKXOOY' },
  { id: 'chill', name: '🍃 Chillhop Beats', category: 'Chill & Lo-Fi', ytId: '5yx6BWlEVcY' },
  { id: 'nature-rain', name: '🌧️ Rainy Day Ambience', category: 'Nature & Ambiance', ytId: 'mPZkdNFkNps' },

  // 🎸 Indie Vibes
  { id: 'tu-shanti', name: '🎸 Tu Shanti - The Local Train', category: 'Indie', ytId: 'G8nlhcmDXNE' },
  { id: 'anuv-baarishein', name: '🌧️ I Think They Call This Love', category: 'Indie', ytId: 'S3rdEQ0M7n4' },
  { id: 'prateek-cold', name: '🥶 Cold/Mess - Prateek Kuhad', category: 'Indie', ytId: '5cAyu5am4Fk' },
  { id: 'tlt-dil-mere', name: '❤️  Tanha Dil ', category: 'Indie', ytId: '-f-X-XlYTo4' },
  { id: 'kho-gaye', name: '🌌 Iraaday', category: 'Indie', ytId: 'Qwm6BSGrOq0' },

  // 🌎 Regional Classics
  { id: 'regional-nila', name: '🌙 Ilaya Nila - Payanangal Mudivathillai', category: 'Regional', ytId: 'mxnsYbab08U' },
  { id: 'neele-ambar', name: '🌊 Roop Ku Mantar', category: 'Regional', ytId: 'Q2qgdDjxCcA' },
  { id: 'premam-malare', name: '🌸 Malare - Premam', category: 'Regional', ytId: '0G2VxhV_gXM' },
  { id: 'munbe-vaa', name: '✨ Munbe Vaa - Sillunu Oru Kaadhal', category: 'Regional', ytId: 'rp3_FhRnIRw' },

  // 🌍 Global Cinematic
  { id: 'interstellar-cornfield', name: '🛰️ Cornfield Chase - Interstellar', category: 'Global Cinematic', ytId: 'JuSsvM8B4Jc' },
  { id: 'lalaland-city', name: '🌃 City of Stars - La La Land', category: 'Global Cinematic', ytId: 'GTWqwSNQCcg' },
  { id: 'bladerunner-2049', name: '🛸 Mesa - Blade Runner 2049', category: 'Global Cinematic', ytId: '8h3SusINdAI' },
  { id: 'batman-theme', name: '🦇 The Batman Theme', category: 'Global Cinematic', ytId: 'NLOp_6uPccQ' },
  { id: 'hollywood-matrix', name: '🕶️ Clubbed to Death - Matrix', category: 'Global Cinematic', ytId: 'pFS4zYWxzNA' },
  { id: 'hollywood-inception', name: '🌀 Time - Inception', category: 'Global Cinematic', ytId: 'RxabLA7UQ9k' },

  // 🌸 Anime & Ghibli
  { id: 'ghibli-merry', name: '🎠 Merry-Go-Round of Life', category: 'Anime & Ghibli', ytId: 'HMGetv40FkI' },
  { id: 'jjk-kaikai', name: '🌀 Kaikai Kitan - Jujutsu Kaisen', category: 'Anime & Ghibli', ytId: 'GwaRztMaoY0' },
  { id: 'aot-rumbling', name: '🧱 The Rumbling - Attack on Titan', category: 'Anime & Ghibli', ytId: 'nLJhIpKNOSo' },
  { id: 'your-name-sparkle', name: '💫 Sparkle - Your Name', category: 'Anime & Ghibli', ytId: 'a2GujJZfXpg' },
  { id: 'naruto-blue-bird', name: '🍥 Blue Bird - Naruto', category: 'Anime & Ghibli', ytId: 'ziABaAUq5Ck' },
  { id: 'op-binks', name: '🏴‍☠️ Binks Sake - One Piece', category: 'Anime & Ghibli', ytId: 'zVvdjlgHAag' },
  { id: 'anime-gurenge', name: '🔥 Gurenge - Demon Slayer', category: 'Anime & Ghibli', ytId: 'YHP9IOkhRis' },

  // 🕹️ Gaming & Modern
  { id: 'elden-ring', name: '🗡️ Elden Ring Main Theme', category: 'Gaming & Modern', ytId: 'N2p_JFF4lR0' },
  { id: 'valorant-die', name: '🎯 Die For You - Valorant', category: 'Gaming & Modern', ytId: 'h7MYJghRWt0' },
  { id: 'cyberpunk-stay', name: '⚡ I Really Want to Stay At Your House', category: 'Gaming & Modern', ytId: 'KvMY1uzSC1E' },
  { id: 'modern-ocean', name: '🌊 Underwater Ambient', category: 'Gaming & Modern', ytId: 'la_AEFO8m7U' },
  { id: 'modern-aurora', name: '✨ Aurora Ambient', category: 'Gaming & Modern', ytId: 'YulTUVbPRaM' },
  { id: 'modern-synth84', name: '📟 Retro Synthwave', category: 'Gaming & Modern', ytId: '4xDzrJKXOOY' },

  // 💻 Editor Ambience
  { id: 'dracula-focus', name: '🦇 Lofi Coding Radio', category: 'Editor Ambience', ytId: 'jfKfPfyJRdk' },
  { id: 'onedark-focus', name: '🌌 Deep Focus Music', category: 'Editor Ambience', ytId: 'DWcJFNfaw9c' },
  { id: 'nord-focus', name: '❄️ Arctic Ambient', category: 'Editor Ambience', ytId: 'j5_WAikd1wI' },
  { id: 'tokyo-focus', name: '🏮 Tokyo Night Music', category: 'Editor Ambience', ytId: 'lN8tzA_Omd0' },
  { id: 'catppuccin-focus', name: '🐾 Cafe Coding Lofi', category: 'Editor Ambience', ytId: '5qap5aO4i9A' },
  { id: 'monokai-focus', name: '🕹️ Retro Coding 8-Bit', category: 'Editor Ambience', ytId: 'vcVDLvWvyEQ' },

  // 📝 Minimal & Ambiance
  { id: 'paper-crumble', name: '📄 Minimal Piano', category: 'Minimal Ambiance', ytId: '4Tr0otuiQuU' },
  { id: 'graphite-scratch', name: '✏️ Soft Jazz Cafe', category: 'Minimal Ambiance', ytId: '_eDXK2OSYog' },
  { id: 'ghost-hum', name: '👻 Dark Ambient', category: 'Minimal Ambiance', ytId: 'CYz-RUe4HH8' },
  { id: 'minimal-sepia', name: '🎞️ Vintage Jazz', category: 'Minimal Ambiance', ytId: 'Dx5qFachd3A' }
];