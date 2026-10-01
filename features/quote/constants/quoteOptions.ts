import {
  Home,
  Building,
  Layers,
  Trees,
  Building2,
  Gem,
  Plus,
  Minus,
  Grid,
  Flame,
  Zap,
  Droplets,
  Wrench,
  CircleSlash,
  Expand,
  LayoutGrid,
} from "lucide-react";

export const PROPERTY_TYPES = [
  { label: 'Detached', value: 'detached', icon: Home },
  { label: 'Terraced', value: 'terraced', icon: Building },
  { label: 'Flat', value: 'flat', icon: Layers },
  { label: 'Bungalow', value: 'bungalow', icon: Trees },
  { label: 'Semi-detached', value: 'semi-detached', icon: Building2 },
];

export const FLAT_TYPES = [
  { value: 'basement', label: 'Basement flat', icon: Minus },
  { value: 'ground', label: 'Ground floor flat', icon: Home },
  { value: 'first', label: 'First floor flat', icon: Building },
  { value: 'second-plus', label: 'Second floor or above', icon: Building2 },
];

export const WALL_TYPES = [
  { value: 'brick', label: 'Brick', icon: Layers },
  { value: 'stone', label: 'Stone', icon: Gem },
  { value: 'timber', label: 'Timber frame', icon: Trees },
  { value: 'concrete', label: 'Concrete', icon: Building },
  { value: 'other', label: 'Other / Not sure', icon: Plus },
];

export const ROOF_TYPES = [
  { value: 'pitched-tiles', label: 'Pitched – Tiles', icon: Layers },
  { value: 'pitched-slate', label: 'Pitched – Slate', icon: Grid },
  { value: 'flat', label: 'Flat roof', icon: Minus },
  { value: 'mixed', label: 'Mixed (part flat, part pitched)', icon: Layers },
  { value: 'other', label: 'Other / Not sure', icon: Plus },
];

export const FLAT_ROOF_PCT_OPTIONS = [
  { value: 'lt10', label: 'Up to 10%' },
  { value: 'lt20', label: 'Up to 20%' },
  { value: 'lt30', label: 'Up to 30%' },
  { value: 'lt50', label: 'Up to 50%' },
  { value: 'gt50', label: 'More than 50%' },
  { value: 'all', label: 'Entire roof is flat' },
];

export const HEATING_TYPES = [
  { value: 'gas-central', label: 'Gas Central Heating', icon: Flame },
  { value: 'gas-tank', label: 'Gas with Hot Water Tank', icon: Flame },
  { value: 'electric', label: 'Electric Heating', icon: Zap },
  { value: 'oil', label: 'Oil-Fired Heating', icon: Droplets },
  { value: 'heat-pump', label: 'Heat Pump', icon: Wrench },
  { value: 'solid-fuel', label: 'Solid Fuel / Multi-Fuel', icon: Trees },
  { value: 'none', label: 'No Central Heating', icon: CircleSlash },
];

export const EXTENSION_TYPES = [
  { value: 'rear', label: 'Rear extension', icon: Expand },
  { value: 'side', label: 'Side extension', icon: Expand },
  { value: 'loft', label: 'Loft conversion', icon: Building2 },
  { value: 'garage', label: 'Garage conversion', icon: Home },
  { value: 'conservatory', label: 'Conservatory', icon: LayoutGrid },
  { value: 'other', label: 'Other', icon: Plus },
];

export const HIGH_VALUE_CATEGORIES = [
  'Jewellery',
  'Watch',
  'Laptop',
  'Mobile phone',
  'Camera',
  'Bicycle',
  'Musical instrument',
  'Artwork',
  'Antiques',
  'Collectibles',
  'Sports equipment',
  'Other',
];

export const CLAIM_TYPES = [
  ['theft', 'Theft'],
  ['fire', 'Fire'],
  ['flood', 'Flood'],
  ['storm', 'Storm damage'],
  ['escape-water', 'Escape of water'],
  ['escape-water-frost', 'Escape of water — frost'],
  ['accidental', 'Accidental damage'],
  ['malicious', 'Malicious damage'],
  ['subsidence', 'Subsidence'],
  ['lightning', 'Lightning'],
  ['other', 'Other'],
];

export const TITLES = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Other'];
