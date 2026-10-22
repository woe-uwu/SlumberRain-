import { RainTypeConfig, SoundPreset } from '../types';

export const RAIN_TYPES: RainTypeConfig[] = [
  {
    id: 'heavy-downpour',
    title: 'Heavy Downpour',
    description: 'Real acoustic field recording of a torrential downpour. Deep, comforting sheets of water that mask street noise and snoring.',
    frequencyProfile: 'Authentic downpour recording · Seamless loop',
    recommendedUse: 'Deep sleep, noisy city bedrooms, chronic insomnia',
  },
  {
    id: 'light-drizzle',
    title: 'Gentle Drizzle',
    description: 'Real acoustic recording of light garden rain. Soft, delicate droplets soaking soil and foliage with zero static harshness.',
    frequencyProfile: 'Authentic garden rain recording · Seamless loop',
    recommendedUse: 'Meditation, peaceful napping, quiet bedroom ambiance',
  },
  {
    id: 'city-rooftop',
    title: 'Tin Rooftop Patter',
    description: 'Real acoustic recording of rain drumming on a corrugated metal sheet roof. Tactile, rhythmic, comforting loft lullaby.',
    frequencyProfile: 'Authentic tin roof recording · Seamless loop',
    recommendedUse: 'Rhythmic sleep lullaby, cozy reading, deep focus',
  },
  {
    id: 'windowpane',
    title: 'Windowpane Stream',
    description: 'Real acoustic recording of rain streaming down bedroom window glass with muffled storm acoustics outside.',
    frequencyProfile: 'Authentic windowpane recording · Seamless loop',
    recommendedUse: 'Safe cocoon feeling, rainy Sunday nap, wind-down routine',
  },
];

export const DEFAULT_PRESETS: SoundPreset[] = [
  {
    id: 'midnight-downpour',
    name: 'Midnight Downpour',
    subtitle: 'Real heavy rain & frequent thunder',
    tagline: 'Deep, room-filling authentic rainstorm with rolling thunderclaps every 30s',
    rainType: 'heavy-downpour',
    suggestedTimerMinutes: 45,
    settings: {
      rainType: 'heavy-downpour',
      rainVolume: 0.85,
      thunderVolume: 0.65,
      thunderIntervalSeconds: 30,
      dropletPatterVolume: 0.50,
      subBassWarmth: 0.65,
      masterVolume: 0.80,
    },
  },
  {
    id: 'gentle-drizzle',
    name: 'Gentle Garden Drizzle',
    subtitle: 'Quiet rain without thunder',
    tagline: 'Authentic gentle outdoor rainfall without thunder for quiet rest',
    rainType: 'light-drizzle',
    suggestedTimerMinutes: 30,
    settings: {
      rainType: 'light-drizzle',
      rainVolume: 0.75,
      thunderVolume: 0.0,
      thunderIntervalSeconds: 0, // off
      dropletPatterVolume: 0.35,
      subBassWarmth: 0.30,
      masterVolume: 0.75,
    },
  },
  {
    id: 'city-rooftop-tin',
    name: 'Tin Roof Sanctuary',
    subtitle: 'Rain drumming on metal & rolling thunder',
    tagline: 'Authentic acoustic recording of water falling on tin roof with periodic thunder rolls',
    rainType: 'city-rooftop',
    suggestedTimerMinutes: 60,
    settings: {
      rainType: 'city-rooftop',
      rainVolume: 0.80,
      thunderVolume: 0.40,
      thunderIntervalSeconds: 60,
      dropletPatterVolume: 0.65,
      subBassWarmth: 0.45,
      masterVolume: 0.80,
    },
  },
  {
    id: 'windowpane-cocoon',
    name: 'Windowpane Cocoon',
    subtitle: 'Rain on glass & occasional rumbles',
    tagline: 'Warm bedroom seclusion listening to authentic weather against the glass',
    rainType: 'windowpane',
    suggestedTimerMinutes: 45,
    settings: {
      rainType: 'windowpane',
      rainVolume: 0.78,
      thunderVolume: 0.35,
      thunderIntervalSeconds: 120, // every 2 min
      dropletPatterVolume: 0.50,
      subBassWarmth: 0.60,
      masterVolume: 0.78,
    },
  },
  {
    id: 'deep-slumber-masking',
    name: 'Deep Sleep Torrent',
    subtitle: 'Torrential rain with rare distant rumbles',
    tagline: 'Real torrential downpour with rare distant rumbles and deep brown noise bed',
    rainType: 'heavy-downpour',
    suggestedTimerMinutes: 90,
    settings: {
      rainType: 'heavy-downpour',
      rainVolume: 0.90,
      thunderVolume: 0.30,
      thunderIntervalSeconds: 240, // every 4 min
      dropletPatterVolume: 0.40,
      subBassWarmth: 0.75,
      masterVolume: 0.82,
    },
  },
];
