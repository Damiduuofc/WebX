// =========================================================================
// UNIVA 2100 TRANSPORTATION SYSTEM - JOURNEY DATA & PRESETS
// =========================================================================

export type TransportModeType = "walk" | "bus" | "skyrail" | "air" | "pod";
export type JourneyPreference = "fastest" | "eco" | "accessible" | "cheap" | "less_walking";

export interface JourneySegment {
  id: string;
  mode: TransportModeType;
  title: string;
  vehicleCode: string;
  departureTime: string;
  arrivalTime: string;
  durationMins: number;
  fromStop: string;
  toStop: string;
  platform?: string;
  occupancyPercent: number;
  speedKmH: number;
  stepFree: boolean;
  distance: string;
  notes?: string;
}

export interface TransferPoint {
  id: string;
  hubName: string;
  fromMode: string;
  toMode: string;
  walkingMins: number;
  walkingDistanceM: number;
  elevatorAccess: boolean;
  instructions: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  nextDepartureMins: number;
}

export interface JourneyOption {
  id: string;
  title: string;
  vehicleName: string;
  vehicleIcon: string;
  badge: string;
  tag: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  totalDurationMins: number;
  fareLkr: number;
  farePoints: number;
  transfersCount: number;
  walkingMins: number;
  walkingDistanceM: number;
  distanceKm: number;
  carbonSavedKg: number;
  ecoPointsReward: number;
  status: "on-time" | "slight-delay" | "express";
  statusMessage: string;
  delayMins: number;
  liveHeadway: string;
  boardingLocation: string;
  primaryModes: TransportModeType[];
  segments: JourneySegment[];
  transfers: TransferPoint[];
  accessibilityScore: "100% Step-Free" | "Elevator Assisted" | "Audio Guided";
  accessibilityFeatures: string[];
}

export interface PresetDestination {
  id: string;
  name: string;
  icon: string;
  category: "University" | "Home" | "Work" | "Airport" | "Hospital" | "Tech";
  address: string;
  badge: string;
  defaultPlan: JourneyOption;
}

// -------------------------------------------------------------------------
// 4 AVAILABLE VEHICLE ROUTE OPTIONS (WITH TIMES & PRICING)
// -------------------------------------------------------------------------

export const DEFAULT_JOURNEY_KDU_TO_AIRPORT: JourneyOption = {
  id: "journey-kdu-bia",
  title: "Multi-Modal Autonomous Express",
  vehicleName: "Autonomous Bus U-204 + SkyRail 02 + Aeropod",
  vehicleIcon: "🚍",
  badge: "Recommended • 2100 Synchronized",
  tag: "Fastest & Step-Free",
  from: "KDU, Ratmalana",
  to: "Bandaranaike International Airport (BIA)",
  departureTime: "10:04 AM",
  arrivalTime: "10:42 AM",
  totalDurationMins: 38,
  fareLkr: 180,
  farePoints: 180,
  transfersCount: 2,
  walkingMins: 6,
  walkingDistanceM: 450,
  distanceKm: 18.4,
  carbonSavedKg: 3.2,
  ecoPointsReward: 35,
  status: "on-time",
  statusMessage: "On Time • Zero Network Congestion",
  delayMins: 0,
  liveHeadway: "Bus U-204 arriving in 2 mins",
  boardingLocation: "Bay 4 • KDU Campus Gate",
  primaryModes: ["bus", "skyrail", "air"],
  accessibilityScore: "100% Step-Free",
  accessibilityFeatures: [
    "Step-free ramps on all vehicles",
    "High-speed concourse elevators at transfer hubs",
    "Audio navigation beacons for visually impaired",
    "Dedicated wheelchair bays & power docks",
    "Level boarding platforms",
  ],
  transfers: [
    {
      id: "tr-1",
      hubName: "Central Station Multimodal Interchange",
      fromMode: "Autonomous Bus U-204",
      toMode: "SkyRail Line 02",
      walkingMins: 2,
      walkingDistanceM: 140,
      elevatorAccess: true,
      instructions: "Alight at Bay 4 → Take Concourse Elevator C to SkyRail Platform 2",
      scheduledArrival: "10:19 AM",
      scheduledDeparture: "10:21 AM",
      nextDepartureMins: 2,
    },
    {
      id: "tr-2",
      hubName: "SkyPort Interchange & Aviation Gateway",
      fromMode: "SkyRail Line 02",
      toMode: "Aeropod Air Transport Shuttle",
      walkingMins: 1,
      walkingDistanceM: 90,
      elevatorAccess: true,
      instructions: "SkyRail Platform 2 → Direct Air Concourse Linkway Gate A1",
      scheduledArrival: "10:31 AM",
      scheduledDeparture: "10:32 AM",
      nextDepartureMins: 1,
    },
  ],
  segments: [
    {
      id: "seg-0",
      mode: "walk",
      title: "Walk to Campus Transit Bay",
      vehicleCode: "Pedestrian Link",
      departureTime: "10:01 AM",
      arrivalTime: "10:04 AM",
      durationMins: 3,
      fromStop: "KDU Main Campus Entrance",
      toStop: "Ratmalana Smart Transit Bay 4",
      distance: "180 m",
      occupancyPercent: 0,
      speedKmH: 4.5,
      stepFree: true,
      notes: "Tactile paving path with audio beacon guidance",
    },
    {
      id: "seg-1",
      mode: "bus",
      title: "Autonomous Bus U-204",
      vehicleCode: "Bus U-204 • Univa AI Co-Pilot",
      departureTime: "10:04 AM",
      arrivalTime: "10:19 AM",
      durationMins: 15,
      fromStop: "Ratmalana Transit Bay 4",
      toStop: "Central Station Multimodal Hub",
      platform: "Bay 4",
      distance: "7.2 km",
      occupancyPercent: 38,
      speedKmH: 54,
      stepFree: true,
      notes: "Precision curb docking with automated accessibility ramp",
    },
    {
      id: "seg-2",
      mode: "skyrail",
      title: "SkyRail Line 02 Maglev",
      vehicleCode: "SkyRail 02 • Elevated Guideway",
      departureTime: "10:21 AM",
      arrivalTime: "10:31 AM",
      durationMins: 10,
      fromStop: "Central Station Platform 2",
      toStop: "SkyPort Interchange Gateway",
      platform: "Platform 2 (Northbound)",
      distance: "8.4 km",
      occupancyPercent: 44,
      speedKmH: 180,
      stepFree: true,
      notes: "Frictionless magnetic levitation, climate-sealed cabin",
    },
    {
      id: "seg-3",
      mode: "air",
      title: "Air Transport / Aeropod Shuttle",
      vehicleCode: "Aeropod AP-12 • Aerial Guideway",
      departureTime: "10:32 AM",
      arrivalTime: "10:40 AM",
      durationMins: 8,
      fromStop: "SkyPort Gateway Gate A1",
      toStop: "Bandaranaike Airport Terminal 1",
      platform: "Gate A1",
      distance: "2.8 km",
      occupancyPercent: 28,
      speedKmH: 110,
      stepFree: true,
      notes: "Dedicated terminal direct link with automated luggage sync",
    },
    {
      id: "seg-4",
      mode: "walk",
      title: "Walk to Airport Terminal Concourse",
      vehicleCode: "Arrival Skybridge",
      departureTime: "10:40 AM",
      arrivalTime: "10:42 AM",
      durationMins: 2,
      fromStop: "Aeropod Gate A1",
      toStop: "BIA Terminal 1 Concourse",
      distance: "120 m",
      occupancyPercent: 0,
      speedKmH: 4.5,
      stepFree: true,
      notes: "Direct moving walkway into departure gates",
    },
  ],
};

// Alternative 2: Direct SkyRail Express
export const ALTERNATIVE_SKYRAIL_EXPRESS: JourneyOption = {
  id: "journey-skyrail-express",
  title: "Direct SkyRail Maglev Express",
  vehicleName: "SkyRail Line 01 Maglev Express",
  vehicleIcon: "🚆",
  badge: "Ultra Fast • 180 km/h Maglev",
  tag: "180 km/h Maglev",
  from: "KDU, Ratmalana",
  to: "Bandaranaike International Airport (BIA)",
  departureTime: "10:06 AM",
  arrivalTime: "10:32 AM",
  totalDurationMins: 26,
  fareLkr: 320,
  farePoints: 320,
  transfersCount: 1,
  walkingMins: 4,
  walkingDistanceM: 280,
  distanceKm: 19.2,
  carbonSavedKg: 3.8,
  ecoPointsReward: 50,
  status: "on-time",
  statusMessage: "Express Non-Stop • Priority Maglev Track",
  delayMins: 0,
  liveHeadway: "Maglev Express boarding in 4 mins",
  boardingLocation: "Platform 1 • Ratmalana SkyPort",
  primaryModes: ["pod", "skyrail"],
  accessibilityScore: "100% Step-Free",
  accessibilityFeatures: ["Wide power doors", "Wheelchair secure bays", "Direct elevator link"],
  transfers: [
    {
      id: "tr-alt1",
      hubName: "Ratmalana SkyPort Elevated Station",
      fromMode: "Campus Pod EV",
      toMode: "SkyRail Line 01 Express",
      walkingMins: 2,
      walkingDistanceM: 120,
      elevatorAccess: true,
      instructions: "Pod drop-off → Elevator directly to SkyRail Express Platform 1",
      scheduledArrival: "10:10 AM",
      scheduledDeparture: "10:12 AM",
      nextDepartureMins: 2,
    },
  ],
  segments: [
    {
      id: "seg-alt-1",
      mode: "pod",
      title: "Smart Road Pod EV",
      vehicleCode: "Pod EV-804",
      departureTime: "10:06 AM",
      arrivalTime: "10:10 AM",
      durationMins: 4,
      fromStop: "KDU Main Gate",
      toStop: "Ratmalana SkyPort",
      platform: "Pod Bay 1",
      distance: "1.6 km",
      occupancyPercent: 20,
      speedKmH: 60,
      stepFree: true,
    },
    {
      id: "seg-alt-2",
      mode: "skyrail",
      title: "SkyRail Line 01 Express",
      vehicleCode: "Maglev 01 Direct",
      departureTime: "10:12 AM",
      arrivalTime: "10:30 AM",
      durationMins: 18,
      fromStop: "Ratmalana SkyPort",
      toStop: "Airport Central SkyRail Hub",
      platform: "Platform 1 Direct",
      distance: "17.6 km",
      occupancyPercent: 55,
      speedKmH: 195,
      stepFree: true,
    },
    {
      id: "seg-alt-3",
      mode: "walk",
      title: "Walk to Check-in Hall",
      vehicleCode: "Skybridge",
      departureTime: "10:30 AM",
      arrivalTime: "10:32 AM",
      durationMins: 2,
      fromStop: "Airport Central Hub",
      toStop: "Terminal 1",
      distance: "160 m",
      occupancyPercent: 0,
      speedKmH: 4.5,
      stepFree: true,
    },
  ],
};

// Alternative 3: Eco Autonomous Road Pod
export const ALTERNATIVE_ECO_POD: JourneyOption = {
  id: "journey-eco-pod",
  title: "Eco Autonomous Road Pod",
  vehicleName: "Smart Road Autonomous Pod EV",
  vehicleIcon: "🚗",
  badge: "Zero Emission • Door-to-Door",
  tag: "Door-to-Door",
  from: "KDU, Ratmalana",
  to: "Bandaranaike International Airport (BIA)",
  departureTime: "10:02 AM",
  arrivalTime: "10:46 AM",
  totalDurationMins: 44,
  fareLkr: 120,
  farePoints: 120,
  transfersCount: 0,
  walkingMins: 1,
  walkingDistanceM: 50,
  distanceKm: 21.0,
  carbonSavedKg: 4.5,
  ecoPointsReward: 60,
  status: "on-time",
  statusMessage: "Smooth Cruise • Coastal Highway Smart Grid",
  delayMins: 0,
  liveHeadway: "Arriving at curb in 3 mins",
  boardingLocation: "Doorstep Pickup • KDU Gate",
  primaryModes: ["pod"],
  accessibilityScore: "100% Step-Free",
  accessibilityFeatures: ["Ramp entry", "Spacious private cabin", "Zero transfers"],
  transfers: [],
  segments: [
    {
      id: "seg-eco-1",
      mode: "pod",
      title: "Autonomous Smart Road Pod Fleet",
      vehicleCode: "EcoPod EV-110",
      departureTime: "10:02 AM",
      arrivalTime: "10:45 AM",
      durationMins: 43,
      fromStop: "KDU Campus Doorway",
      toStop: "BIA Terminal Departures Curb",
      platform: "Doorstep Pickup",
      distance: "21.0 km",
      occupancyPercent: 25,
      speedKmH: 68,
      stepFree: true,
    },
    {
      id: "seg-eco-2",
      mode: "walk",
      title: "Step into Departures",
      vehicleCode: "Curb Walk",
      departureTime: "10:45 AM",
      arrivalTime: "10:46 AM",
      durationMins: 1,
      fromStop: "Terminal Curb",
      toStop: "Terminal 1 Gate",
      distance: "50 m",
      occupancyPercent: 0,
      speedKmH: 4.5,
      stepFree: true,
    },
  ],
};

// Alternative 4: Autonomous Bus Highway Link
export const ALTERNATIVE_BUS_HIGHWAY: JourneyOption = {
  id: "journey-bus-highway",
  title: "Autonomous Bus Highway Shuttle",
  vehicleName: "Autonomous Highway Bus 245-Express",
  vehicleIcon: "🚍",
  badge: "Lowest Cost • Direct Busway",
  tag: "Lowest Cost",
  from: "KDU, Ratmalana",
  to: "Bandaranaike International Airport (BIA)",
  departureTime: "10:10 AM",
  arrivalTime: "10:52 AM",
  totalDurationMins: 42,
  fareLkr: 90,
  farePoints: 90,
  transfersCount: 0,
  walkingMins: 3,
  walkingDistanceM: 180,
  distanceKm: 22.4,
  carbonSavedKg: 2.8,
  ecoPointsReward: 30,
  status: "on-time",
  statusMessage: "Dedicated Highway Transit Lane",
  delayMins: 0,
  liveHeadway: "Bus 245-Express departs in 8 mins",
  boardingLocation: "Bay 2 • Ratmalana Terminal",
  primaryModes: ["bus"],
  accessibilityScore: "100% Step-Free",
  accessibilityFeatures: ["Automated curb ramp", "Audio announcements"],
  transfers: [],
  segments: [
    {
      id: "seg-bus-1",
      mode: "bus",
      title: "Autonomous Highway Bus 245-Express",
      vehicleCode: "Bus 245-EX",
      departureTime: "10:10 AM",
      arrivalTime: "10:50 AM",
      durationMins: 40,
      fromStop: "Ratmalana Smart Terminal Bay 2",
      toStop: "BIA Airport Terminal Concourse",
      platform: "Bay 2",
      distance: "22.4 km",
      occupancyPercent: 40,
      speedKmH: 65,
      stepFree: true,
    },
    {
      id: "seg-bus-2",
      mode: "walk",
      title: "Walk into Departures",
      vehicleCode: "Direct Curb",
      departureTime: "10:50 AM",
      arrivalTime: "10:52 AM",
      durationMins: 2,
      fromStop: "Airport Bus Bay",
      toStop: "Terminal 1 Gate",
      distance: "100 m",
      occupancyPercent: 0,
      speedKmH: 4.5,
      stepFree: true,
    },
  ],
};

export const AVAILABLE_VEHICLE_OPTIONS: JourneyOption[] = [
  DEFAULT_JOURNEY_KDU_TO_AIRPORT,
  ALTERNATIVE_SKYRAIL_EXPRESS,
  ALTERNATIVE_ECO_POD,
  ALTERNATIVE_BUS_HIGHWAY,
];

// -------------------------------------------------------------------------
// RECENT DESTINATIONS PRESETS
// -------------------------------------------------------------------------

export const RECENT_DESTINATIONS: PresetDestination[] = [
  {
    id: "dest-airport",
    name: "Airport",
    icon: "✈️",
    category: "Airport",
    address: "Bandaranaike International Airport (BIA)",
    badge: "Direct SkyRail + AirLink",
    defaultPlan: DEFAULT_JOURNEY_KDU_TO_AIRPORT,
  },
  {
    id: "dest-university",
    name: "University",
    icon: "🏫",
    category: "University",
    address: "General Sir John Kotelawala Defence University (KDU)",
    badge: "Campus Feeder 255",
    defaultPlan: {
      ...DEFAULT_JOURNEY_KDU_TO_AIRPORT,
      title: "KDU Campus Smart Link",
      vehicleName: "Campus Autonomous Feeder 255",
      vehicleIcon: "🚍",
      from: "Colombo Fort Central Terminal",
      to: "KDU Ratmalana Main Campus",
      totalDurationMins: 27,
      fareLkr: 120,
      farePoints: 120,
      transfersCount: 1,
      walkingMins: 4,
      arrivalTime: "08:42 AM",
      departureTime: "08:15 AM",
    },
  },
  {
    id: "dest-home",
    name: "Home",
    icon: "🏠",
    category: "Home",
    address: "Marine Drive Promenade, Kollupitiya",
    badge: "Coastal Pod Fleet",
    defaultPlan: {
      ...DEFAULT_JOURNEY_KDU_TO_AIRPORT,
      title: "Coastal Rapid Concourse",
      vehicleName: "Coastal Smart Road Pod EV",
      vehicleIcon: "🚗",
      from: "KDU, Ratmalana",
      to: "Marine Drive Promenade, Kollupitiya",
      totalDurationMins: 14,
      fareLkr: 80,
      farePoints: 80,
      transfersCount: 0,
      walkingMins: 3,
      arrivalTime: "08:34 AM",
      departureTime: "08:20 AM",
    },
  },
  {
    id: "dest-work",
    name: "Work",
    icon: "💼",
    category: "Work",
    address: "World Trade Center, Echelon Square",
    badge: "Downtown Financial Link",
    defaultPlan: {
      ...DEFAULT_JOURNEY_KDU_TO_AIRPORT,
      title: "Financial Center SkyExpress",
      vehicleName: "SkyRail Line 02 Downtown",
      vehicleIcon: "🚆",
      from: "KDU, Ratmalana",
      to: "World Trade Center, Echelon Square",
      totalDurationMins: 18,
      fareLkr: 95,
      farePoints: 95,
      transfersCount: 1,
      walkingMins: 3,
      arrivalTime: "08:38 AM",
      departureTime: "08:20 AM",
    },
  },
  {
    id: "dest-hospital",
    name: "Hospital",
    icon: "🏥",
    category: "Hospital",
    address: "Apeksha Medical & Research Center, Maharagama",
    badge: "Priority Medical Route",
    defaultPlan: {
      ...DEFAULT_JOURNEY_KDU_TO_AIRPORT,
      title: "Healthcare Direct Shuttle",
      vehicleName: "Medical Priority Autonomous Bus",
      vehicleIcon: "🚍",
      from: "KDU, Ratmalana",
      to: "Maharagama Apeksha Medical Center",
      totalDurationMins: 16,
      fareLkr: 90,
      farePoints: 90,
      transfersCount: 1,
      walkingMins: 2,
      arrivalTime: "09:16 AM",
      departureTime: "09:00 AM",
    },
  },
  {
    id: "dest-tech",
    name: "Tech Park",
    icon: "🏢",
    category: "Tech",
    address: "Orion City Technology Park, Dematagoda",
    badge: "Innovation Hub Link",
    defaultPlan: {
      ...DEFAULT_JOURNEY_KDU_TO_AIRPORT,
      title: "Orion City SkyShuttle",
      vehicleName: "SkyRail Line 01 Tech Link",
      vehicleIcon: "🚆",
      from: "KDU, Ratmalana",
      to: "Orion City Technology Concourse",
      totalDurationMins: 22,
      fareLkr: 110,
      farePoints: 110,
      transfersCount: 1,
      walkingMins: 4,
      arrivalTime: "09:22 AM",
      departureTime: "09:00 AM",
    },
  },
];

// -------------------------------------------------------------------------
// VOICE COMMANDS & INTELLIGENT RESPONSES
// -------------------------------------------------------------------------

export interface VoiceCommandPreset {
  prompt: string;
  recognizedText: string;
  responseSpeech: string;
  targetDestination: string;
}

export const VOICE_COMMANDS: VoiceCommandPreset[] = [
  {
    prompt: "Take me to the airport",
    recognizedText: '"Take me to the airport as fast as possible"',
    responseSpeech: "Calculating fastest synchronized route to Bandaranaike Airport. Autonomous Bus U-204 departs in 2 minutes.",
    targetDestination: "Bandaranaike International Airport (BIA)",
  },
  {
    prompt: "Find an accessible route to KDU",
    recognizedText: '"Find a step-free accessible route to KDU Campus"',
    responseSpeech: "Step-free route selected. Level boarding on Bus U-204 with elevator sync at Central Station.",
    targetDestination: "General Sir John Kotelawala Defence University (KDU)",
  },
  {
    prompt: "How long to World Trade Center?",
    recognizedText: '"How long will it take to get to World Trade Center?"',
    responseSpeech: "Journey time is 18 minutes via SkyRail Line 02 with zero delays reported.",
    targetDestination: "World Trade Center, Echelon Square",
  },
  {
    prompt: "Take me home to Marine Drive",
    recognizedText: '"Take me home to Marine Drive Promenade"',
    responseSpeech: "Setting route for Home. Direct Eco Pod arriving at your curb in 3 minutes.",
    targetDestination: "Marine Drive Promenade, Kollupitiya",
  },
];

// -------------------------------------------------------------------------
// USER WALLET & POINTS STATE HELPERS
// -------------------------------------------------------------------------

export interface UserTransitWallet {
  pointsBalance: number;
  nfcCardNumber: string;
  tier: string;
  concessionApplied: boolean;
  recentTransactions: {
    id: string;
    description: string;
    amount: number;
    type: "debit" | "credit";
    date: string;
  }[];
}

export const INITIAL_WALLET: UserTransitWallet = {
  pointsBalance: 850,
  nfcCardNumber: "UNIVA-2100-8842-7719",
  tier: "Gold Commuter",
  concessionApplied: false,
  recentTransactions: [
    { id: "tx-1", description: "Eco Commute Bonus", amount: 35, type: "credit", date: "Today, 09:15 AM" },
    { id: "tx-2", description: "SkyRail Line 02 Pass", amount: 120, type: "debit", date: "Yesterday, 06:40 PM" },
    { id: "tx-3", description: "Instant Points Top-up", amount: 500, type: "credit", date: "Yesterday, 08:00 AM" },
  ],
};
