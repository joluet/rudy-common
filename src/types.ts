export type RouteState = { id: string; position: number }[]

export type TransitType = 'ferry' | 'to-terminal' | 'from-terminal'

export type FerryTerminal = {
  location: { lat: number, lng: number},
  name: string,
}

export type ConnectionMetadata = {
  id: string
  duration: number
  distance: number
  polyline: string
  errorCode?: string | null
  transitType?: TransitType
  arrival?: FerryTerminal
  departure?: FerryTerminal
}

export type Connection = {
  id: string
  origin: RouteStop
  destination: RouteStop
  transitType?: TransitType
}

export type Photo = {
  uri: string
  path: string
  fileName: string
}

export type RouteStop = {
  id: string
  placeId?: string
  itemType: ItemType
  name: string
  nameOverride?: string
  address?: string
  category?: string
  type?: string
  lat?: number
  lng?: number
  description?: string
  vagueAddress?: string
  radius?: string
  photos?: Photo[]
  date?: string
}

export enum ItemType {
  Stop = 'Stop',
  Section = 'Section',
  Waypoint = 'Waypoint',
  FerryTerminalArrival = 'FerryTerminalArrival',
  FerryTerminalDeparture = 'FerryTerminalDeparture'
}

export enum RouteUserRole {
  Owner,
  Invited
}

export type RouteUser = {
  id: string
  role: RouteUserRole
  name?: string
  avatarUrl?: string
}

export type Place = {
  id: string
  name: string
  nameOverride?: string
  address: string | undefined
  category: string | undefined
  type: string | undefined
  lat: number
  lng: number
  vagueAddress: string | undefined
}

export type AutosuggestResult = Place & {
  distance: number | undefined
  rating: number | undefined
}

export type LatLng = {
  latitude: number
  longitude: number
}
