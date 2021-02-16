export type RouteState = { id: string; position: number }[]

export type ConnectionMetadata = {
  id: string
  duration: number
  distance: number
  polyline: string
  errorCode?: string | null
}

export type Connection = {
  id: string
  origin: RouteStop
  destination: RouteStop
}

export type RouteStop = {
  id: string
  placeId?: string
  itemType: ItemType
  name: string
  address?: string
  category?: string
  type?: string
  lat?: number
  lng?: number
}

export enum ItemType {
  Stop = 'Stop',
  Section = 'Section'
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
  category: string | undefined
  type: string | undefined
  lat: number
  lng: number
}

export type AutosuggestResult = Place & {
  distance: number | undefined
}
