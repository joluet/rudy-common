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
  let stopPrevieousFerryId: null | string = null
  let nextStopAfterFerryId: null | string = null
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
          if (stop.itemType === 'FerryTerminalDeparture') {
            if (!stopPrevieousFerryId ) {
              stopPrevieousFerryId = array[index -1].id
              result[index -1].transitType = 'to-terminal'
            } else {
              result[index -1].transitType = 'from-and-to-terminal'
            }
            if (!nextStopAfterFerryId) {
              nextStopAfterFerryId = array.slice(index).find((stop) => stop.itemType === ItemType.Stop)!.id
            }
            result.push({
              id: getFerryConnectionId({
                prevStopId: stopPrevieousFerryId,
                nextStopId: nextStopAfterFerryId,
                departureTerminalName: origin.name,
                arrivalTerminalName: destination.name
              }),
              origin: origin,
              destination: destination,
              transitType: 'ferry'
            })
            result[index -1].id = getToFerryTerminalConnectionId({
              prevStopId: stopPrevieousFerryId,
              nextStopId: nextStopAfterFerryId,
              departureTerminalName: origin.name
            })
          } else if (stop.itemType === 'FerryTerminalArrival' && nextStopAfterFerryId && stopPrevieousFerryId) {
            result.push({
              id: getFromFerryTerminalConnectionId({
                prevStopId: stopPrevieousFerryId,
                nextStopId: nextStopAfterFerryId,
                arrivalTerminalName: origin.name
              }),
              origin: origin,
              destination: destination,
              transitType: 'from-terminal'
            })
          } else {
            result.push({
              id: `${origin.id}*${destination.id}`,
              origin: origin,
              destination: destination,
            })
            stopPrevieousFerryId = null
            nextStopAfterFerryId = null
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
