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
