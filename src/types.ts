export type RouteState = { id: string; position: number }[]

export type ConnectionMetadata = {
  id: string
  duration: number
  distance: number
  polyline: string
}

export type Connection = {
  id: string
  origin: RouteStop
  destination: RouteStop
}

export type RouteStop = {
  id: string
  placeId: string
  name: string
  lat: number
  lng: number
}

export enum RouteUserRole {
  Owner,
  Invited
}

export type RouteUser = {
  id: string
  role: RouteUserRole
}

export type Place = {
  id: string
  name: string
  address: string | undefined
  lat: number
  lng: number
  category: string | undefined
}

export type AutosuggestResult = Place & {
  distance: number | undefined
}
