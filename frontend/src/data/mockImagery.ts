import { SatelliteImageMeta } from '../types/imagery';

// High-fidelity SVG Data URIs for remote sensing scenes
export const OPTICAL_SCENE_1_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Land textures -->
    <pattern id="agri-fields" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
      <rect width="80" height="80" fill="#2d3d25"/>
      <rect x="0" y="0" width="38" height="38" fill="#384c2e"/>
      <rect x="42" y="0" width="38" height="38" fill="#445c37"/>
      <rect x="0" y="42" width="38" height="38" fill="#324529"/>
      <rect x="42" y="42" width="38" height="38" fill="#293922"/>
      <line x1="0" y1="40" x2="80" y2="40" stroke="#1d2817" stroke-width="2"/>
      <line x1="40" y1="0" x2="40" y2="80" stroke="#1d2817" stroke-width="2"/>
    </pattern>
    <pattern id="urban-dense" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="#4a5568"/>
      <rect x="4" y="4" width="14" height="14" fill="#718096" rx="1"/>
      <rect x="22" y="4" width="14" height="14" fill="#a0aec0" rx="1"/>
      <rect x="4" y="22" width="14" height="14" fill="#cbd5e0" rx="1"/>
      <rect x="22" y="22" width="14" height="14" fill="#4a5568" rx="1"/>
      <path d="M0 20 h40 M20 0 v40" stroke="#2d3748" stroke-width="2"/>
    </pattern>
    <linearGradient id="water-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f2b38"/>
      <stop offset="50%" stop-color="#143b4d"/>
      <stop offset="100%" stop-color="#0a1d26"/>
    </linearGradient>
  </defs>

  <!-- Base Landscape -->
  <rect width="1024" height="1024" fill="url(#agri-fields)" />

  <!-- Natural River / Estuary System -->
  <path d="M 0 320 C 180 340, 290 280, 480 380 C 670 480, 810 420, 1024 450 L 1024 530 C 810 500, 670 560, 480 460 C 290 360, 180 420, 0 400 Z" fill="url(#water-grad)" />

  <!-- Agricultural Irrigation Channels -->
  <path d="M 480 380 L 480 0 M 670 480 L 670 1024 M 200 400 L 200 1024" stroke="#143b4d" stroke-width="8" stroke-dasharray="16,4"/>

  <!-- Urban Settlement Cluster Northern Sector -->
  <g transform="translate(520, 80)">
    <rect width="440" height="240" fill="#3f4a56" rx="4"/>
    <rect width="440" height="240" fill="url(#urban-dense)" opacity="0.8"/>
    <!-- Individual large commercial buildings -->
    <rect x="30" y="30" width="110" height="60" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
    <rect x="160" y="30" width="90" height="80" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
    <rect x="270" y="40" width="130" height="70" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
    <rect x="50" y="120" width="160" height="80" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
    <rect x="230" y="130" width="170" height="70" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
  </g>

  <!-- Southern Industrial & Port Zone -->
  <g transform="translate(80, 620)">
    <rect width="520" height="340" fill="#334155" rx="6"/>
    <rect width="520" height="340" fill="url(#urban-dense)" opacity="0.6"/>
    <!-- Warehouses & Logistics -->
    <rect x="40" y="40" width="200" height="90" fill="#94a3b8" stroke="#1e293b" stroke-width="3"/>
    <rect x="270" y="40" width="200" height="90" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
    <rect x="40" y="160" width="200" height="120" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
    <rect x="270" y="160" width="200" height="120" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  </g>

  <!-- Arterial Highway / Transportation Corridor -->
  <path d="M 120 0 L 380 500 L 920 1024" stroke="#1e293b" stroke-width="36" fill="none" stroke-linecap="square"/>
  <path d="M 120 0 L 380 500 L 920 1024" stroke="#64748b" stroke-width="28" fill="none" stroke-linecap="square"/>
  <path d="M 120 0 L 380 500 L 920 1024" stroke="#fef08a" stroke-width="2" stroke-dasharray="14,14" fill="none"/>

  <!-- Bridge Crossing over Estuary -->
  <rect x="340" y="410" width="70" height="60" fill="#475569" stroke="#cbd5e1" stroke-width="2" transform="rotate(-30 375 440)"/>

  <!-- Coastal / Estuary Sandbar -->
  <path d="M 940 380 Q 980 430 1024 410 L 1024 490 Q 960 480 920 440 Z" fill="#786d52"/>

  <!-- Telemetry Watermark Overlay -->
  <text x="30" y="50" fill="#38bdf8" opacity="0.7" font-family="monospace" font-size="16" font-weight="600">ISRO CARTOSAT-2S // CHENNAI S01 // RGB 1.2M</text>
  <text x="30" y="75" fill="#94a3b8" opacity="0.6" font-family="monospace" font-size="13">LAT: 13.0827° N  LON: 80.2707° E // EPSG:4326</text>
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
