import {
  RouteState,
  RouteStop,
  ItemType,
  Connection,
  ConnectionMetadata,
  RouteUserRole,
  RouteUser,
  AutosuggestResult,
  Place,
  Photo,
  TransitType,
} from './types'

export {
  RouteState,
  RouteStop,
  ItemType,
  Connection,
  ConnectionMetadata,
  RouteUserRole,
  RouteUser,
  AutosuggestResult,
  Place,
  Photo
}

export const mergeRouteStates = (routeStates: RouteState[]): RouteState => {
  const mergedState = [...routeStates]
    .reverse()
    .reduce((mergedState: RouteState, currentState: RouteState) => {
      const deletedInCurrent = currentState.filter(
        (item) => item.position === -1
      )
      return mergedState
        .map((item) => {
          if (deletedInCurrent.find((deleted) => item.id === deleted.id)) {
            return { ...item, position: -1 }
          } else {
            return item
          }
        })
        .concat(
          currentState.filter(
            (item) => !mergedState.some((merged) => merged.id === item.id)
          )
        )
    }, [])
    .filter((item) => item.position !== -1)
  const sortedMergedState = [...mergedState].sort(
    (a, b) => a.position - b.position
  )
  const result = sortedMergedState.map((item, index) => ({
    ...item,
    position: index
  }))
  return result
}

export const getToFerryTerminalConnectionId = ({
  prevStopId,
  nextStopId,
  departureTerminalName
}: {
  prevStopId: string,
  nextStopId: string,
  departureTerminalName: string
}) => {
  const trimmedName = departureTerminalName.replace(/ /g,'')
  return `${prevStopId}*${nextStopId}-${trimmedName}`
}

export const getFerryConnectionId = ({
  prevStopId,
  nextStopId,
  departureTerminalName,
  arrivalTerminalName
}: {
  prevStopId: string,
  nextStopId: string,
  departureTerminalName: string
  arrivalTerminalName: string
}) => {
  const trimmedDepartureName = departureTerminalName.replace(/ /g,'')
  const trimmedArrivalName = arrivalTerminalName.replace(/ /g,'')
  return `${prevStopId}*${nextStopId}-${trimmedDepartureName}-${trimmedArrivalName}`
}

export const getFromFerryTerminalConnectionId = ({
  prevStopId,
  nextStopId,
  arrivalTerminalName
}: {
  prevStopId: string,
  nextStopId: string,
  arrivalTerminalName: string
}) => {
  const trimmedName = arrivalTerminalName.replace(/ /g,'')
  return `${prevStopId}*${nextStopId}-${trimmedName}`
}

export const buildConnections = (
  routeStops: RouteStop[],
  routeState: RouteState
): Connection[] => {
  return routeStops
    .filter((stop) => stop.itemType !== ItemType.Section)
    .filter((stop) => routeState.find((item) => stop.id === item.id))
    .sort((a, b) => {
      const positionA = routeState.find((item) => item.id === a.id)!.position
      const positionB = routeState.find((item) => item.id === b.id)!.position
      return positionA - positionB
    })
    .reduce(
      (
        result: Connection[],
        stop: RouteStop,
        index: number,
        array: RouteStop[]
      ) => {
        if (index < array.length - 1) {
          const origin = stop
          const destination = array[index + 1]
          if (destination.itemType === ItemType.FerryTerminalDeparture) {
            if (origin.itemType === ItemType.FerryTerminalArrival) {
              result.push({
                id: destination.id,
                origin: origin,
                destination: destination,
                transitType: TransitType.FromAndToTerminal
              })
            } else {
              result.push({
                id: destination.id,
                origin: origin,
                destination: destination,
                transitType: TransitType.ToTerminal
              })
            }
          } else if (
            destination.itemType === ItemType.FerryTerminalArrival  ||
            destination.itemType === ItemType.FerryTerminalTransit
          ) {
            result.push({
              id: `${origin.id}*${destination.name.replace(/ /g,'')}`,
              origin: origin,
              destination: destination,
              transitType: TransitType.Ferry
            })
          } else if (
            origin.itemType === ItemType.FerryTerminalArrival
          ) {
            result.push({
              id: origin.id,
              origin: origin,
              destination: destination,
              transitType: TransitType.FromTerminal
            })
          } else {
            result.push({
              id: `${origin.id}*${destination.id}`,
              origin: origin,
              destination: destination,
            })
          }
        }
        return result
      },
      []
    )
}

export const calculateMetricsSums = (
  currentConnections: ConnectionMetadata[],
  deletedConnections: string[],
  addedConnections: ConnectionMetadata[]
): {
  duration: number
  distance: number
  stopsCount: number
} => {
  const resultingConnections = currentConnections
    .filter(
      (connection) =>
        !deletedConnections.find((deleted) => deleted === connection.id)
    )
    .concat(addedConnections)
  if (resultingConnections.length === 0) {
    return { duration: 0, distance: 0, stopsCount: 0 }
  } else {
    return resultingConnections.reduce(
      (sumDurationAndDistance, connection) => ({
        duration: sumDurationAndDistance.duration + connection.duration,
        distance: sumDurationAndDistance.distance + connection.distance,
        stopsCount: sumDurationAndDistance.stopsCount + 1
      }),
      { duration: 0, distance: 0, stopsCount: 1 }
    )
  }
}
