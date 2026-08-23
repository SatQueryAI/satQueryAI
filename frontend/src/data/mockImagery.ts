import { SatelliteImageMeta } from '../types/imagery';

// High-fidelity Realistic Remote Sensing Scenes
export const OPTICAL_SCENE_1_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <!-- Realistic Earth/Foliage Noise Filter -->
    <filter id="terrain-noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="5" result="noise" />
      <feColorMatrix type="matrix" values="0.18 0.28 0.12 0 0.05  0.15 0.32 0.10 0 0.07  0.10 0.20 0.08 0 0.03  0 0 0 1 0" in="noise" result="coloredNoise"/>
      <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
    </filter>

    <filter id="water-ripple" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.02 0.04" numOctaves="3" result="turb"/>
      <feDisplacementMap in2="turb" in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>

    <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d5a5b" />
      <stop offset="30%" stop-color="#4a6b6c" />
      <stop offset="70%" stop-color="#324c4e" />
      <stop offset="100%" stop-color="#24383a" />
    </linearGradient>

    <!-- Urban dense building grid pattern -->
    <pattern id="dense-settlement" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="#2d372e" />
      <circle cx="10" cy="15" r="7" fill="#1b281b" opacity="0.8"/>
      <circle cx="45" cy="45" r="8" fill="#1f301e" opacity="0.7"/>
      <rect x="2" y="2" width="12" height="10" fill="#8c7a6b" rx="1" />
      <rect x="18" y="4" width="14" height="12" fill="#7a6e65" rx="1" />
      <rect x="36" y="2" width="20" height="14" fill="#a39689" rx="1" />
      <rect x="4" y="20" width="16" height="14" fill="#9e9184" rx="1" />
      <rect x="24" y="22" width="18" height="16" fill="#696056" rx="1" />
      <rect x="46" y="20" width="12" height="18" fill="#b0a599" rx="1" />
      <rect x="6" y="40" width="18" height="16" fill="#7d7268" rx="1" />
      <rect x="28" y="42" width="14" height="14" fill="#918579" rx="1" />
      <rect x="46" y="42" width="12" height="14" fill="#5c544d" rx="1" />
      <!-- Subtle road lines -->
      <line x1="0" y1="18" x2="60" y2="18" stroke="#3e3933" stroke-width="1.5"/>
      <line x1="0" y1="38" x2="60" y2="38" stroke="#3e3933" stroke-width="1.5"/>
      <line x1="20" y1="0" x2="20" y2="60" stroke="#3e3933" stroke-width="1.5"/>
      <line x1="42" y1="0" x2="42" y2="60" stroke="#3e3933" stroke-width="1.5"/>
    </pattern>

    <pattern id="dense-settlement-dark" width="50" height="50" patternUnits="userSpaceOnUse">
      <rect width="50" height="50" fill="#263124"/>
      <rect x="3" y="3" width="10" height="8" fill="#6e6259" rx="1"/>
      <rect x="16" y="4" width="12" height="10" fill="#8a7c72" rx="1"/>
      <rect x="32" y="3" width="14" height="9" fill="#584e46" rx="1"/>
      <rect x="5" y="18" width="14" height="12" fill="#7d7168" rx="1"/>
      <rect x="22" y="19" width="12" height="11" fill="#998d82" rx="1"/>
      <rect x="38" y="18" width="10" height="13" fill="#61574f" rx="1"/>
      <rect x="4" y="34" width="15" height="12" fill="#85786e" rx="1"/>
      <rect x="24" y="35" width="11" height="11" fill="#70655c" rx="1"/>
      <rect x="39" y="34" width="9" height="12" fill="#a1958b" rx="1"/>
    </pattern>
  </defs>

  <!-- Base Terrain with Natural Foliage & Earth Tones -->
  <rect width="1200" height="800" fill="#2b3826" />
  <rect width="1200" height="800" fill="url(#dense-settlement)" opacity="0.85" />
  <rect width="1200" height="800" fill="url(#dense-settlement-dark)" opacity="0.45" />

  <!-- Dense Forest / Tree Patches along Riverbanks -->
  <g fill="#1b2a1a" opacity="0.9">
    <ellipse cx="200" cy="180" rx="140" ry="100" />
    <ellipse cx="380" cy="240" rx="110" ry="80" />
    <ellipse cx="120" cy="400" rx="90" ry="120" />
    <ellipse cx="280" cy="650" rx="160" ry="120" />
    <ellipse cx="700" cy="150" rx="150" ry="90" />
    <ellipse cx="950" cy="680" rx="180" ry="100" />
    <ellipse cx="580" cy="720" rx="130" ry="70" />
  </g>
  <g fill="#2d4229" opacity="0.85">
    <circle cx="180" cy="160" r="45" />
    <circle cx="230" cy="200" r="55" />
    <circle cx="340" cy="230" r="50" />
    <circle cx="300" cy="630" r="70" />
    <circle cx="240" cy="680" r="60" />
    <circle cx="680" cy="140" r="65" />
    <circle cx="740" cy="170" r="55" />
  </g>

  <!-- River Basin / Waterbody flowing diagonally -->
  <!-- River Sandbar / Beach edges -->
  <path d="M 0 280 Q 250 320, 520 440 T 950 630 L 950 720 Q 600 580, 420 480 T 0 380 Z" fill="#6d7a65" opacity="0.6"/>
  
  <!-- Main River Flow -->
  <path d="M -20 290 Q 240 330, 510 445 Q 720 535, 960 645 L 960 710 Q 700 575, 450 475 Q 220 380, -20 355 Z" fill="url(#river-grad)" />
  <path d="M 200 340 Q 450 430, 750 560 L 740 575 Q 440 445, 190 355 Z" fill="#4d6f70" opacity="0.7"/>
  <path d="M 500 460 Q 700 545, 880 620 L 875 632 Q 695 555, 495 470 Z" fill="#608688" opacity="0.5"/>

  <!-- Secondary Stream / Canal -->
  <path d="M 510 445 Q 550 560, 560 800" stroke="#3d5a5b" stroke-width="12" fill="none" opacity="0.85"/>
  <path d="M 280 0 Q 320 180, 360 350" stroke="#3d5a5b" stroke-width="8" fill="none" opacity="0.7"/>

  <!-- Arterial Highway / Express Transport Corridor -->
  <!-- Road shadow & base -->
  <path d="M 480 -20 L 520 350 L 530 490 L 545 820" stroke="#181e24" stroke-width="26" fill="none"/>
  <!-- Pavement -->
  <path d="M 480 -20 L 520 350 L 530 490 L 545 820" stroke="#48535e" stroke-width="20" fill="none"/>
  <!-- Center divider lines -->
  <path d="M 480 -20 L 520 350 L 530 490 L 545 820" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="8,6" fill="none"/>

  <!-- Bridge Crossing spanning the river -->
  <g>
    <!-- Bridge Piers shadow in water -->
    <rect x="508" y="380" width="34" height="95" fill="#0d1819" opacity="0.7" transform="rotate(3 525 425)"/>
    <!-- Bridge Deck -->
    <rect x="510" y="370" width="28" height="110" fill="#64748b" stroke="#cbd5e1" stroke-width="1.5" transform="rotate(3 524 425)"/>
    <!-- Bridge median -->
    <line x1="524" y1="370" x2="530" y2="480" stroke="#e2e8f0" stroke-width="1.5"/>
    <line x1="517" y1="372" x2="523" y2="478" stroke="#334155" stroke-width="1"/>
    <line x1="531" y1="372" x2="537" y2="478" stroke="#334155" stroke-width="1"/>
  </g>

  <!-- Commercial & Industrial Planned Clusters (Bottom Left) -->
  <g transform="translate(330, 480)">
    <!-- Industrial Campus Perimeter -->
    <rect width="130" height="115" fill="#384337" opacity="0.8" rx="2"/>
    <!-- Internal Access Roads -->
    <path d="M 15 10 L 115 10 L 115 105 L 15 105 Z" stroke="#525f6c" stroke-width="4" fill="none"/>
    <line x1="65" y1="10" x2="65" y2="105" stroke="#525f6c" stroke-width="4"/>
    <!-- Warehouse & Facility Buildings -->
    <rect x="25" y="20" width="32" height="28" fill="#d1d5db" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="72" y="20" width="35" height="28" fill="#e5e7eb" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="25" y="58" width="32" height="34" fill="#9ca3af" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="72" y="58" width="35" height="34" fill="#f3f4f6" stroke="#1f2937" stroke-width="1.5" rx="1"/>
  </g>

  <!-- Built-up Urban Block (Top Right) -->
  <g transform="translate(630, 160)">
    <rect width="125" height="95" fill="#3f483d" opacity="0.85" rx="2"/>
    <!-- Complex Buildings with Shadows -->
    <rect x="15" y="15" width="40" height="28" fill="#9ca3af" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="65" y="15" width="45" height="30" fill="#e5e7eb" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="20" y="52" width="35" height="28" fill="#d1d5db" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="65" y="52" width="45" height="30" fill="#f3f4f6" stroke="#1f2937" stroke-width="1.5" rx="1"/>
  </g>

  <!-- Secondary Built-up Commercial Block (Mid Right) -->
  <g transform="translate(690, 260)">
    <rect width="95" height="90" fill="#3d463b" opacity="0.8" rx="2"/>
    <rect x="10" y="10" width="32" height="32" fill="#cbd5e1" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="50" y="10" width="32" height="32" fill="#e2e8f0" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="10" y="48" width="32" height="32" fill="#94a3b8" stroke="#1f2937" stroke-width="1.5" rx="1"/>
    <rect x="50" y="48" width="32" height="32" fill="#f8fafc" stroke="#1f2937" stroke-width="1.5" rx="1"/>
  </g>

  <!-- Local Network of Streets -->
  <path d="M 520 350 L 850 320 M 530 490 L 880 500 M 510 220 L 200 240 M 530 620 L 280 640 M 630 160 L 630 380 M 760 160 L 760 380" stroke="#4b5563" stroke-width="4" fill="none" opacity="0.75"/>
</svg>
`)}`;

export const SAR_SCENE_1_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Speckle Noise Filter simulating Synthetic Aperture Radar -->
    <filter id="sar-speckle" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" in="noise" result="monoNoise"/>
      <feBlend mode="overlay" in="SourceGraphic" in2="monoNoise"/>
    </filter>
  </defs>

  <!-- Background Rough Terrain Backscatter -->
  <rect width="1024" height="1024" fill="#2b2e36" filter="url(#sar-speckle)" />

  <!-- Water Body (Specular Low Backscatter - Black in SAR) -->
  <path d="M 0 320 C 180 340, 290 280, 480 380 C 670 480, 810 420, 1024 450 L 1024 530 C 810 500, 670 560, 480 460 C 290 360, 180 420, 0 400 Z" fill="#030508" />

  <!-- Double-Bounce Corner Reflectors (Bright White/Cyan Spikes from Built structures) -->
  <g fill="#ffffff" stroke="#38bdf8" stroke-width="2">
    <rect x="550" y="110" width="110" height="60" filter="drop-shadow(0 0 6px #38bdf8)"/>
    <rect x="680" y="110" width="90" height="80" filter="drop-shadow(0 0 6px #38bdf8)"/>
    <rect x="790" y="120" width="130" height="70" filter="drop-shadow(0 0 6px #38bdf8)"/>
    <rect x="570" y="200" width="160" height="80" filter="drop-shadow(0 0 6px #38bdf8)"/>
    <rect x="750" y="210" width="170" height="70" filter="drop-shadow(0 0 6px #38bdf8)"/>

    <!-- Port Warehouses Metal Cladding -->
    <rect x="120" y="660" width="200" height="90" filter="drop-shadow(0 0 8px #ffffff)"/>
    <rect x="350" y="660" width="200" height="90" filter="drop-shadow(0 0 8px #ffffff)"/>
    <rect x="120" y="780" width="200" height="120" filter="drop-shadow(0 0 8px #ffffff)"/>
    <rect x="350" y="780" width="200" height="120" filter="drop-shadow(0 0 8px #ffffff)"/>
  </g>

  <!-- Highway Metal Guardrails & Bridge Structure -->
  <path d="M 120 0 L 380 500 L 920 1024" stroke="#4a5568" stroke-width="24" fill="none"/>
  <path d="M 115 0 L 375 500 L 915 1024" stroke="#ffffff" stroke-width="3" fill="none"/>
  <path d="M 125 0 L 385 500 L 925 1024" stroke="#ffffff" stroke-width="3" fill="none"/>

  <!-- Bridge Strong Echo -->
  <rect x="340" y="410" width="70" height="60" fill="#ffffff" stroke="#38bdf8" stroke-width="4" transform="rotate(-30 375 440)" filter="drop-shadow(0 0 10px #38bdf8)"/>

  <!-- Telemetry -->
  <text x="30" y="50" fill="#38bdf8" opacity="0.8" font-family="monospace" font-size="16" font-weight="600">RISAT-1A // C-BAND SAR // DUAL POL VV/VH</text>
  <text x="30" y="75" fill="#94a3b8" opacity="0.6" font-family="monospace" font-size="13">BACKSCATTER INTENSITY (SIGMA-0 dB) // INC: 36.4°</text>
</svg>
`)}`;

export const TEMPORAL_2024_BEFORE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- 2024 Before: Mostly Agriculture & Rural Road -->
  <rect width="1024" height="1024" fill="#33442a"/>
  
  <!-- Fields -->
  <g stroke="#24331e" stroke-width="3">
    <rect x="40" y="40" width="280" height="320" fill="#445c37"/>
    <rect x="360" y="40" width="300" height="320" fill="#3d5432"/>
    <rect x="700" y="40" width="280" height="320" fill="#4f6b40"/>
    
    <rect x="40" y="400" width="420" height="260" fill="#384c2e"/>
    <rect x="500" y="400" width="480" height="260" fill="#48633c"/>
    
    <rect x="40" y="700" width="300" height="280" fill="#304227"/>
    <rect x="380" y="700" width="280" height="280" fill="#445c37"/>
    <rect x="700" y="700" width="280" height="280" fill="#3d5432"/>
  </g>

  <!-- Old Narrow 2-lane Rural Road -->
  <path d="M 0 520 L 1024 520" stroke="#718096" stroke-width="14" fill="none"/>
  
  <!-- Single Small Farmhouse Cluster -->
  <rect x="180" y="440" width="45" height="35" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
  <rect x="240" y="445" width="35" height="30" fill="#94a3b8" stroke="#334155" stroke-width="2"/>

  <!-- Water retention pond -->
  <ellipse cx="820" cy="800" rx="90" ry="60" fill="#143b4d" stroke="#234e62" stroke-width="4"/>

  <!-- Telemetry Stamp -->
  <rect x="20" y="20" width="360" height="60" fill="#0b131f" opacity="0.85" rx="4" stroke="#1e293b"/>
  <text x="35" y="44" fill="#10b981" font-family="monospace" font-size="14" font-weight="700">● ACQUIRED: 18 JUN 2024 (T1)</text>
  <text x="35" y="65" fill="#94a3b8" font-family="monospace" font-size="12">BASELINE PRE-CONSTRUCTION</text>
</svg>
`)}`;

export const TEMPORAL_2026_AFTER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- 2026 After: New Expressway & Industrial Logistics Park -->
  <rect width="1024" height="1024" fill="#33442a"/>
  
  <!-- Remaining Fields -->
  <g stroke="#24331e" stroke-width="3">
    <rect x="40" y="40" width="280" height="320" fill="#445c37"/>
    <rect x="360" y="40" width="300" height="320" fill="#3d5432"/>
    <rect x="700" y="40" width="280" height="320" fill="#4f6b40"/>
    
    <rect x="40" y="700" width="300" height="280" fill="#304227"/>
    <rect x="380" y="700" width="280" height="280" fill="#445c37"/>
    <rect x="700" y="700" width="280" height="280" fill="#3d5432"/>
  </g>

  <!-- Expanded 6-Lane Expressway with Interchange -->
  <path d="M 0 520 L 1024 520" stroke="#1e293b" stroke-width="56" fill="none"/>
  <path d="M 0 520 L 1024 520" stroke="#475569" stroke-width="44" fill="none"/>
  <path d="M 0 508 L 1024 508" stroke="#f8fafc" stroke-width="2" stroke-dasharray="12,12" fill="none"/>
  <path d="M 0 532 L 1024 532" stroke="#f8fafc" stroke-width="2" stroke-dasharray="12,12" fill="none"/>
  <line x1="0" y1="520" x2="1024" y2="520" stroke="#facc15" stroke-width="2"/>

  <!-- NEW Massive Logistics Distribution Center (Constructed in Central Sector) -->
  <g transform="translate(40, 390)">
    <!-- Cleared Land Base -->
    <rect width="944" height="260" fill="#475569" stroke="#334155" stroke-width="2" rx="4"/>
    
    <!-- Mega Warehouses with Solar Panels -->
    <rect x="30" y="25" width="260" height="100" fill="#f1f5f9" stroke="#0f172a" stroke-width="3" rx="2"/>
    <rect x="320" y="25" width="280" height="100" fill="#e2e8f0" stroke="#0f172a" stroke-width="3" rx="2"/>
    <rect x="630" y="25" width="270" height="100" fill="#cbd5e1" stroke="#0f172a" stroke-width="3" rx="2"/>
    
    <!-- Secondary Commercial Buildings -->
    <rect x="30" y="145" width="180" height="85" fill="#94a3b8" stroke="#0f172a" stroke-width="2" rx="2"/>
    <rect x="230" y="145" width="220" height="85" fill="#f8fafc" stroke="#0f172a" stroke-width="2" rx="2"/>
    <rect x="470" y="145" width="240" height="85" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" rx="2"/>
    <rect x="730" y="145" width="170" height="85" fill="#cbd5e1" stroke="#0f172a" stroke-width="2" rx="2"/>

    <!-- Parking Lots & HGV bays -->
    <g fill="#0284c7" opacity="0.6">
      <rect x="460" y="35" width="120" height="80" rx="2"/>
    </g>
  </g>

  <!-- Water retention pond expanded & engineered -->
  <ellipse cx="820" cy="800" rx="90" ry="60" fill="#0f2b38" stroke="#38bdf8" stroke-width="4"/>

  <!-- Telemetry Stamp -->
  <rect x="20" y="20" width="360" height="60" fill="#0b131f" opacity="0.85" rx="4" stroke="#1e293b"/>
  <text x="35" y="44" fill="#06b6d4" font-family="monospace" font-size="14" font-weight="700">● ACQUIRED: 22 AUG 2026 (T2)</text>
  <text x="35" y="65" fill="#94a3b8" font-family="monospace" font-size="12">POST-DEVELOPMENT INDUSTRIAL CORRIDOR</text>
</svg>
`)}`;

export const TEMPORAL_CHANGE_MASK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- Bi-temporal Change Detection Binary Mask / Heatmap -->
  <rect width="1024" height="1024" fill="#000000" opacity="0.4" />

  <!-- Road widening change (Cyan) -->
  <rect x="0" y="492" width="1024" height="56" fill="#06b6d4" opacity="0.6" stroke="#22d3ee" stroke-width="2"/>

  <!-- New Built-up Industrial Zone (Magenta/Cyan New Construction Mask) -->
  <rect x="40" y="390" width="944" height="260" fill="#f43f5e" opacity="0.5" stroke="#fb7185" stroke-width="3"/>
  <rect x="70" y="415" width="260" height="100" fill="#06b6d4" opacity="0.8" stroke="#ffffff" stroke-width="2"/>
  <rect x="360" y="415" width="280" height="100" fill="#06b6d4" opacity="0.8" stroke="#ffffff" stroke-width="2"/>
  <rect x="670" y="415" width="270" height="100" fill="#06b6d4" opacity="0.8" stroke="#ffffff" stroke-width="2"/>

  <text x="512" y="375" text-anchor="middle" fill="#22d3ee" font-family="monospace" font-size="18" font-weight="700">CHANGE DETECTED: +0.24 km² NEW IMPERVIOUS SURFACE</text>
</svg>
`)}`;

// Master Catalog of Preloaded Remote Sensing Datasets
export const MOCK_SATELLITE_IMAGES: SatelliteImageMeta[] = [
  {
    id: 'img-cartosat-01',
    name: 'CARTOSAT_2S_CHENNAI_URBAN.TIF',
    filename: 'CARTOSAT_2S_CHENNAI_URBAN.TIF',
    sensor: 'Cartosat-2S PAN/MX',
    platform: 'ISRO PSLV-C40',
    modality: 'OPTICAL',
    acquisitionDate: '2026-08-17',
    acquisitionTime: '05:42:19 UTC',
    resolution: '1.2 m GSD',
    dimensions: { width: 2048, height: 2048 },
    bandsCount: 4,
    bandsList: [
      { name: 'Band 1 (Blue)', wavelength: '0.45 - 0.52 µm', description: 'Atmospheric penetration / coastal' },
      { name: 'Band 2 (Green)', wavelength: '0.52 - 0.59 µm', description: 'Vegetation vigor & vigor peak' },
      { name: 'Band 3 (Red)', wavelength: '0.62 - 0.68 µm', description: 'Chlorophyll absorption & built-up' },
      { name: 'Band 4 (NIR)', wavelength: '0.77 - 0.86 µm', description: 'Biomass & water boundary distinction' },
    ],
    crs: 'EPSG:4326 (WGS 84)',
    coordinates: {
      lat: 13.0827,
      lon: 80.2707,
      bbox: [80.2450, 13.0610, 80.2980, 13.1040],
      locationName: 'Chennai Port & Ennore Estuary, Tamil Nadu',
    },
    cloudCoverPercentage: 1.4,
    solarAzimuth: 138.4,
    solarElevation: 64.2,
    thumbnailUrl: OPTICAL_SCENE_1_SVG,
    fullImageUrl: OPTICAL_SCENE_1_SVG,
    fileSizeBytes: '32.4 MB (GeoTIFF Float32)',
  },
  {
    id: 'img-risat-01',
    name: 'RISAT_1A_SAR_C_BAND_COASTAL.TIF',
    filename: 'RISAT_1A_SAR_C_BAND_COASTAL.TIF',
    sensor: 'C-band SAR (5.35 GHz)',
    platform: 'EOS-04 / RISAT-1A',
    modality: 'SAR',
    acquisitionDate: '2026-08-19',
    acquisitionTime: '18:14:02 UTC (Ascending)',
    resolution: '2.0 m Slant Range',
    dimensions: { width: 2048, height: 2048 },
    bandsCount: 2,
    bandsList: [
      { name: 'Channel 1 (VV)', description: 'Vertical Transmit / Vertical Receive' },
      { name: 'Channel 2 (VH)', description: 'Vertical Transmit / Horizontal Receive (Cross-pol)' },
    ],
    polarization: 'VV / VH Dual Polarization',
    incidenceAngle: 36.4,
    crs: 'EPSG:4326 (WGS 84)',
    coordinates: {
      lat: 13.0827,
      lon: 80.2707,
      bbox: [80.2450, 13.0610, 80.2980, 13.1040],
      locationName: 'Chennai Coastal Radar Corridor',
    },
    thumbnailUrl: SAR_SCENE_1_SVG,
    fullImageUrl: SAR_SCENE_1_SVG,
    fileSizeBytes: '48.1 MB (Complex SAR)',
  },
  {
    id: 'img-temporal-chennai-pair',
    name: 'ORAGADAM_CORRIDOR_TEMPORAL_PAIR.TIF',
    filename: 'ORAGADAM_CORRIDOR_TEMPORAL_PAIR.TIF',
    sensor: 'Sentinel-2A / Landsat-9 Harmonized',
    platform: 'Multi-Mission Temporal Coregistered',
    modality: 'TEMPORAL_PAIR',
    acquisitionDate: '2024-06-18 vs 2026-08-22',
    resolution: '2.5 m GSD',
    dimensions: { width: 2048, height: 2048 },
    bandsCount: 8,
    bandsList: [
      { name: 'T1_Red / T1_Green / T1_Blue / T1_NIR', description: 'Pre-construction baseline (2024)' },
      { name: 'T2_Red / T2_Green / T2_Blue / T2_NIR', description: 'Post-construction state (2026)' },
    ],
    crs: 'EPSG:32644 (UTM Zone 44N)',
    coordinates: {
      lat: 12.8342,
      lon: 79.9482,
      bbox: [79.9200, 12.8100, 79.9750, 12.8550],
      locationName: 'Oragadam Industrial Corridor, Sriperumbudur',
    },
    cloudCoverPercentage: 0.8,
    isPair: true,
    pairMetadata: {
      beforeDate: '18 Jun 2024',
      afterDate: '22 Aug 2026',
      beforeLabel: 'Baseline State (Jun 2024)',
      afterLabel: 'Current State (Aug 2026)',
    },
    thumbnailUrl: TEMPORAL_2026_AFTER_SVG,
    fullImageUrl: TEMPORAL_2026_AFTER_SVG,
    secondaryImageUrl: TEMPORAL_2024_BEFORE_SVG,
    changeMaskUrl: TEMPORAL_CHANGE_MASK_SVG,
    fileSizeBytes: '64.8 MB (Bi-temporal Stack)',
  }
];
