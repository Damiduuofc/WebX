import type { StopPoint, LiveBus } from "../components/LiveRouteMap";

// =========================================================================
// REAL ROUTE & STOP DATA (MATCHING LANKAMETRO.LK/EN/SMARTMETRO + UNIVA )
// =========================================================================

export interface TransitRoute {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  origin: string;
  destination: string;
  distance: string;
  avgDuration: string;
  fareBase: number; // LKR
  farePerStop: number;
  activeCount: number;
  frequency: string;
  hours: string;
  tag: string;
  color: string;
  stops: StopPoint[];
}

export const CM01_STOPS: StopPoint[] = [
  { id: "cm01-1", name: "Makumbura (MMC) Terminal", landmark: "Multimodal Center Platform 1", x: 780, y: 670, seq: 1, isTransferHub: true, connections: ["Southern Expressway Shuttles", "Feeder Pods"], stepFreeAccessible: true },
  { id: "cm01-2", name: "Kottawa Interchange", landmark: "High Level Road Gate", x: 740, y: 640, seq: 2, stepFreeAccessible: true },
  { id: "cm01-3", name: "Pannipitiya Flyover", landmark: "Old Road Concourse", x: 690, y: 610, seq: 3, stepFreeAccessible: true },
  { id: "cm01-4", name: "Maharagama Central", landmark: "Clock Tower Transit Bay", x: 640, y: 580, seq: 4, isTransferHub: true, connections: ["Route 138 Feeder"], stepFreeAccessible: true },
  { id: "cm01-5", name: "Maharagama Apeksha Hospital", landmark: "Medical Center South Gate", x: 605, y: 560, seq: 5, stepFreeAccessible: true },
  { id: "cm01-6", name: "Navinna Junction", landmark: "Ayurveda Research Roundabout", x: 570, y: 540, seq: 6, stepFreeAccessible: true },
  { id: "cm01-7", name: "Wijerama University Junction", landmark: "USJ University Link", x: 540, y: 520, seq: 7, connections: ["Campus Shuttles"], stepFreeAccessible: true },
  { id: "cm01-8", name: "Delkanda Supermarket Junction", landmark: "High Level Commercial Concourse", x: 505, y: 495, seq: 8, stepFreeAccessible: true },
  { id: "cm01-9", name: "Nugegoda Supermarket Concourse", landmark: "Supermarket Concourse & Rail Station", x: 470, y: 460, seq: 9, isTransferHub: true, connections: ["Kelani Valley Rail", "Nugegoda Bus Depot"], stepFreeAccessible: true },
  { id: "cm01-10", name: "Kirulapone Market", landmark: "Kirulapone Canal Bridge", x: 430, y: 435, seq: 10, stepFreeAccessible: true },
  { id: "cm01-11", name: "Narahenpita Junction", landmark: "Elvitigala Mawatha Crossing", x: 410, y: 400, seq: 11, connections: ["Narahenpita Hospital Line"], stepFreeAccessible: true },
  { id: "cm01-12", name: "RMV / Military Hospital", landmark: "Denzil Kobbekaduwa Mawatha", x: 420, y: 365, seq: 12, stepFreeAccessible: true },
  { id: "cm01-13", name: "Borella YMBA Concourse", landmark: "Borella Crossroads Central Hub", x: 400, y: 330, seq: 13, isTransferHub: true, connections: ["SkyRail Line 02", "Central Hospital Shuttles"], stepFreeAccessible: true },
  { id: "cm01-14", name: "Campbell Park Station", landmark: "Baseline Road Pedestrian Overpass", x: 410, y: 295, seq: 14, stepFreeAccessible: true },
  { id: "cm01-15", name: "Dematagoda Railway Crossing", landmark: "Main Line Rail Overpass", x: 430, y: 260, seq: 15, connections: ["Coastal Commuter Line"], stepFreeAccessible: true },
  { id: "cm01-16", name: "Orion City Technology Park", landmark: "Orugodawatta Tech Concourse", x: 460, y: 230, seq: 16, stepFreeAccessible: true },
  { id: "cm01-17", name: "Thorana Junction", landmark: "Kelani River North Bridge Link", x: 500, y: 200, seq: 17, stepFreeAccessible: true },
  { id: "cm01-18", name: "Kelaniya University Hub", landmark: "Kandy Road University Concourse", x: 540, y: 170, seq: 18, connections: ["University Feeder Route"], stepFreeAccessible: true },
  { id: "cm01-19", name: "Kiribathgoda Town Center", landmark: "Kiribathgoda Commercial Roundabout", x: 580, y: 140, seq: 19, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm01-20", name: "Mahara Flyover Junction", landmark: "Kandy Road Expressway Portal", x: 620, y: 110, seq: 20, stepFreeAccessible: true },
  { id: "cm01-21", name: "Kadawatha Multimodal Hub", landmark: "Expressway Terminal 01", x: 660, y: 80, seq: 21, isTransferHub: true, connections: ["Central Expressway E04", "Intercity Express Buses"], stepFreeAccessible: true },
];

export const CM02_STOPS: StopPoint[] = [
  { id: "cm02-1", name: "Makumbura (MMC) Terminal", landmark: "Multimodal Center Platform 2", x: 780, y: 670, seq: 1, isTransferHub: true, connections: ["Southern Expressway Shuttles"], stepFreeAccessible: true },
  { id: "cm02-2", name: "Kottawa Expressway Gate", landmark: "E01 Southern Gateway", x: 740, y: 640, seq: 2, stepFreeAccessible: true },
  { id: "cm02-3", name: "High Level Expressway Link", landmark: "Maharagama Direct Flyover", x: 640, y: 580, seq: 3, stepFreeAccessible: true },
  { id: "cm02-4", name: "Nugegoda Station Concourse", landmark: "Supermarket Plaza Overpass", x: 470, y: 460, seq: 4, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm02-5", name: "Havelock City Commercial Mall", landmark: "Havelock Concourse", x: 380, y: 460, seq: 5, connections: ["Commercial Shuttles"], stepFreeAccessible: true },
  { id: "cm02-6", name: "Bambalapitiya Marine Drive", landmark: "Galle Road & Coastal Strip", x: 260, y: 470, seq: 6, connections: ["Coastal Rail Line"], stepFreeAccessible: true },
  { id: "cm02-7", name: "Kollupitiya Coastal Concourse", landmark: "Kollupitiya Station Road", x: 240, y: 410, seq: 7, stepFreeAccessible: true },
  { id: "cm02-8", name: "Galle Face Green Promenade", landmark: "Oceanfront Promenade", x: 220, y: 350, seq: 8, stepFreeAccessible: true },
  { id: "cm02-9", name: "WTC Financial Center", landmark: "Echelon Square West", x: 200, y: 300, seq: 9, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm02-10", name: "Colombo Fort Central Terminal", landmark: "Main Rail & SkyRail Station", x: 220, y: 260, seq: 10, isTransferHub: true, connections: ["SkyRail Line 01", "Intercity Main Line Rail"], stepFreeAccessible: true },
  { id: "cm02-11", name: "Pettah Central Bus Stand", landmark: "Bastian Mawatha Long-Distance Depot", x: 250, y: 240, seq: 11, isTransferHub: true, stepFreeAccessible: true },
  { id: "cm02-12", name: "Pettah Floating Market Hub", landmark: "Gold Center Concourse", x: 270, y: 220, seq: 12, isTransferHub: true, stepFreeAccessible: true },
];

export const UN01_STOPS: StopPoint[] = [
  { id: "un01-1", name: "KDU Ratmalana Main Campus", landmark: "Defence University Gate 1", x: 240, y: 720, seq: 1, isTransferHub: true, connections: ["Campus Feeder Route 255"], stepFreeAccessible: true },
  { id: "un01-2", name: "Ratmalana Airport SkyGuideway", landmark: "Aviation Terminal Overpass", x: 250, y: 660, seq: 2, stepFreeAccessible: true },
  { id: "un01-3", name: "Dehiwala Coastal Hub", landmark: "Zoo Road Crossing", x: 255, y: 590, seq: 3, stepFreeAccessible: true },
  { id: "un01-4", name: "Wellawatte Concourse", landmark: "Marine Drive Flyover", x: 250, y: 520, seq: 4, stepFreeAccessible: true },
  { id: "un01-5", name: "Colombo Fort Multimodal Hub", landmark: "Platform 3 SkyGuideway Link", x: 220, y: 260, seq: 5, isTransferHub: true, connections: ["SkyRail Line 02", "Intercity Main Line"], stepFreeAccessible: true },
  { id: "un01-6", name: "Peliyagoda Smart Interchange", landmark: "New Kelani Bridge Flyway", x: 340, y: 210, seq: 6, isTransferHub: true, stepFreeAccessible: true },
  { id: "un01-7", name: "Kelaniya SkyRail Station", landmark: "Elevated Magnetic Track 2", x: 420, y: 160, seq: 7, connections: ["SkyRail Line 01"], stepFreeAccessible: true },
  { id: "un01-8", name: "Ja-Ela Smart Expressway Port", landmark: "Colombo-Katunayake E03 Port", x: 380, y: 110, seq: 8, isTransferHub: true, stepFreeAccessible: true },
  { id: "un01-9", name: "Katunayake Cargo Gateway", landmark: "Airport Logistics Concourse", x: 350, y: 60, seq: 9, stepFreeAccessible: true },
  { id: "un01-10", name: "Bandaranaike International Airport", landmark: "Terminal 1 & 2 SkyRail Gate", x: 320, y: 25, seq: 10, isTransferHub: true, connections: ["International Flight Shuttles", "Aeropod Terminal"], stepFreeAccessible: true },
];

export const TRANSIT_ROUTES: Record<string, TransitRoute> = {
  CM01: {
    id: "CM01",
    code: "CM01",
    title: "Route CM01 • Makumbura ⇄ Kadawatha",
    subtitle: "High-Capacity Urban Expressway & Arterial Corridor",
    origin: "Makumbura Multimodal Center (MMC)",
    destination: "Kadawatha Multimodal Transport Hub",
    distance: "24.8 km",
    avgDuration: "42 min",
    fareBase: 80,
    farePerStop: 10,
    activeCount: 6,
    frequency: "Every 4 mins",
    hours: "05:00 AM – 11:30 PM",
    tag: "High Frequency",
    color: "#192841",
    stops: CM01_STOPS,
  },
  CM02: {
    id: "CM02",
    code: "CM02",
    title: "Route CM02 • Makumbura ⇄ Colombo Fort",
    subtitle: "Southern Expressway & Coastal Financial Corridor",
    origin: "Makumbura Multimodal Center (MMC)",
    destination: "Colombo Fort / Pettah Central",
    distance: "21.4 km",
    avgDuration: "34 min",
    fareBase: 80,
    farePerStop: 12,
    activeCount: 5,
    frequency: "Every 5 mins",
    hours: "05:15 AM – 11:45 PM",
    tag: "Express Link",
    color: "#0284C7",
    stops: CM02_STOPS,
  },
  UN01: {
    id: "UN01",
    code: "UN01",
    title: "Route UN01 • KDU Ratmalana ⇄ BIA Airport",
    subtitle: " SkyRail Autonomous Express Inter-City Arterial",
    origin: "KDU, Ratmalana",
    destination: "Bandaranaike International Airport",
    distance: "46.2 km",
    avgDuration: "38 min",
    fareBase: 120,
    farePerStop: 15,
    activeCount: 4,
    frequency: "Every 6 mins",
    hours: "24 Hours Service",
    tag: "SkyRail Arterial",
    color: "#059669",
    stops: UN01_STOPS,
  },
};

// Initial simulated bus fleets
export const INITIAL_BUSES: Record<string, LiveBus[]> = {
  CM01: [
    { id: "b1", plate: "ND-8921", routeId: "CM01", direction: "outbound", currentStopIndex: 8, progress: 0.35, speed: 44, nextStopName: "Nugegoda Supermarket Concourse", etaMinutes: 2, occupancyPercent: 42, seatsAvailable: 18, wheelchairBay: true, driver: "Capt. Silva", status: "In Transit", heading: 45 },
    { id: "b2", plate: "NB-4412", routeId: "CM01", direction: "outbound", currentStopIndex: 3, progress: 0.8, speed: 38, nextStopName: "Maharagama Central", etaMinutes: 1, occupancyPercent: 68, seatsAvailable: 8, wheelchairBay: true, driver: "Capt. Perera", status: "Approaching Stop", heading: 50 },
    { id: "b3", plate: "NC-6284", routeId: "CM01", direction: "outbound", currentStopIndex: 14, progress: 0.2, speed: 52, nextStopName: "Dematagoda Railway Crossing", etaMinutes: 3, occupancyPercent: 30, seatsAvailable: 22, wheelchairBay: true, driver: "Capt. Fernando", status: "In Transit", heading: 40 },
    { id: "b4", plate: "ND-1055", routeId: "CM01", direction: "inbound", currentStopIndex: 18, progress: 0.6, speed: 46, nextStopName: "Kelaniya University Hub", etaMinutes: 2, occupancyPercent: 55, seatsAvailable: 12, wheelchairBay: true, driver: "Capt. Wickramasinghe", status: "In Transit", heading: 225 },
    { id: "b5", plate: "NA-9801", routeId: "CM01", direction: "inbound", currentStopIndex: 11, progress: 0.1, speed: 0, nextStopName: "Narahenpita Junction", etaMinutes: 1, occupancyPercent: 75, seatsAvailable: 5, wheelchairBay: true, driver: "Capt. Jayawardena", status: "At Station", heading: 220 },
    { id: "b6", plate: "NB-7320", routeId: "CM01", direction: "inbound", currentStopIndex: 5, progress: 0.7, speed: 48, nextStopName: "Maharagama Apeksha Hospital", etaMinutes: 4, occupancyPercent: 25, seatsAvailable: 24, wheelchairBay: true, driver: "Capt. Bandara", status: "In Transit", heading: 215 },
  ],
  CM02: [
    { id: "b7", plate: "ND-3341", routeId: "CM02", direction: "outbound", currentStopIndex: 3, progress: 0.45, speed: 58, nextStopName: "Nugegoda Station Concourse", etaMinutes: 3, occupancyPercent: 50, seatsAvailable: 16, wheelchairBay: true, driver: "Capt. Dissanayake", status: "In Transit", heading: 60 },
    { id: "b8", plate: "NB-1192", routeId: "CM02", direction: "outbound", currentStopIndex: 7, progress: 0.85, speed: 32, nextStopName: "Galle Face Green Promenade", etaMinutes: 1, occupancyPercent: 62, seatsAvailable: 10, wheelchairBay: true, driver: "Capt. Weerasinghe", status: "Approaching Stop", heading: 45 },
    { id: "b9", plate: "NC-7704", routeId: "CM02", direction: "outbound", currentStopIndex: 9, progress: 0.15, speed: 0, nextStopName: "Colombo Fort Central Terminal", etaMinutes: 1, occupancyPercent: 80, seatsAvailable: 4, wheelchairBay: true, driver: "Capt. Fonseka", status: "At Station", heading: 30 },
    { id: "b10", plate: "ND-5520", routeId: "CM02", direction: "inbound", currentStopIndex: 6, progress: 0.5, speed: 45, nextStopName: "Bambalapitiya Marine Drive", etaMinutes: 2, occupancyPercent: 35, seatsAvailable: 20, wheelchairBay: true, driver: "Capt. Karunaratne", status: "In Transit", heading: 210 },
    { id: "b11", plate: "NA-2299", routeId: "CM02", direction: "inbound", currentStopIndex: 2, progress: 0.75, speed: 60, nextStopName: "Makumbura (MMC) Terminal", etaMinutes: 2, occupancyPercent: 20, seatsAvailable: 25, wheelchairBay: true, driver: "Capt. Gunasekara", status: "In Transit", heading: 200 },
  ],
  UN01: [
    { id: "b12", plate: "UN-245", routeId: "UN01", direction: "outbound", currentStopIndex: 4, progress: 0.3, speed: 82, nextStopName: "Peliyagoda Smart Interchange", etaMinutes: 2, occupancyPercent: 38, seatsAvailable: 32, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 30 },
    { id: "b13", plate: "UN-108", routeId: "UN01", direction: "outbound", currentStopIndex: 7, progress: 0.7, speed: 95, nextStopName: "Ja-Ela Smart Expressway Port", etaMinutes: 1, occupancyPercent: 44, seatsAvailable: 28, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 25 },
    { id: "b14", plate: "UN-330", routeId: "UN01", direction: "outbound", currentStopIndex: 1, progress: 0.6, speed: 48, nextStopName: "Ratmalana Airport SkyGuideway", etaMinutes: 1, occupancyPercent: 22, seatsAvailable: 40, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 40 },
    { id: "b15", plate: "UN-512", routeId: "UN01", direction: "inbound", currentStopIndex: 8, progress: 0.4, speed: 90, nextStopName: "Kelaniya SkyRail Station", etaMinutes: 2, occupancyPercent: 52, seatsAvailable: 24, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 205 },
    { id: "b16", plate: "UN-601", routeId: "UN01", direction: "inbound", currentStopIndex: 3, progress: 0.2, speed: 40, nextStopName: "Dehiwala Coastal Hub", etaMinutes: 2, occupancyPercent: 60, seatsAvailable: 18, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "In Transit", heading: 215 },
    { id: "b17", plate: "UN-720", routeId: "UN01", direction: "inbound", currentStopIndex: 0, progress: 0.9, speed: 0, nextStopName: "KDU Ratmalana Main Campus", etaMinutes: 1, occupancyPercent: 18, seatsAvailable: 42, wheelchairBay: true, driver: "Univa AI Autonomous Co-Pilot", status: "At Station", heading: 220 },
  ],
};

/**
 * The rider's journey along route UN01: which stops each vehicle covers. A leg
 * ends at a transfer hub (or the destination). Shared by the trip screen and
 * the route preview so both always describe the same trip.
 */
export const UN01_LEGS = [
  { name: "Autonomous Bus 245", short: "Bus 245", vehicleType: "Bus", fromIdx: 0, toIdx: 4, mins: 15 },
  { name: "SkyRail Line 02 Maglev", short: "SkyRail 02", vehicleType: "SkyRail", fromIdx: 4, toIdx: 7, mins: 10 },
  { name: "Smart Road Autonomous Pod", short: "Smart Pod", vehicleType: "Pod", fromIdx: 7, toIdx: 9, mins: 8 },
] as const;
