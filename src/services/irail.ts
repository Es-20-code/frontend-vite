export interface VehicleInfo {
  name: string;
  shortname: string;
  number: string;
  type: string;
  locationX: string;
  locationY: string;
  '@id': string;
}

export interface StopInfo {
    id: string;
    station: string;
    stationinfo: {
    name: string;
    standardname?: string;
    };
    time: string;
    platform: string;
    platforminfo?: {
    name: string;
    normal: string;
    };
    scheduledDepartureTime?: string;
    scheduledArrivalTime?: string;
    delay?: string;
    canceled?: string;
    departureDelay?: string;
    arrivalDelay?: string;
}

export interface VehicleResponse {
    version: string;
    timestamp: string;
    vehicle: string;
    vehicleinfo: VehicleInfo;
    stops: {
    stop: StopInfo[];
    };
}

export interface LiveboardDeparture {
  vehicle?: string;
  vehicleinfo?: {
    shortname?: string;
    type?: string;
    number?: string;
    name?: string;
  };
  time?: string;
  platform?: string;
  station?: string;
}

export interface LiveboardResponse {
  departures?: {
    departure?: LiveboardDeparture[];
  };
}

export async function fetchStationDepartures(station: string): Promise<LiveboardDeparture[]> {
  const response = await fetch(
    `https://api.irail.be/v1/liveboard/?station=${encodeURIComponent(station)}&format=json&lang=en&alerts=false`,
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener la lista de trenes de la estación.');
  }

  const data = (await response.json()) as LiveboardResponse;
  return data.departures?.departure ?? [];
}

export async function fetchVehicleData(vehicleId: string) {
    const response = await fetch(
      `https://api.irail.be/v1/vehicle/?id=${encodeURIComponent(vehicleId)}&format=json&lang=en&alerts=false`,
    );

    if (!response.ok) {
      throw new Error('No se pudieron cargar los datos del tren.');
    }

    const data = (await response.json()) as VehicleResponse;
    return data;
}
