import {
  RouteState,
  RouteStop,
  ItemType,
  Connection,
  ConnectionMetadata,
  RouteUserRole,
  RouteUser,
  AutosuggestResult,
  Place
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
  Place
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
          if (stop.itemType === ItemType.Stop) {
            const origin = stop
            const destination = array.slice(index + 1).find((stop) => stop.itemType === ItemType.Stop)
            if (destination) {
              result.push({
                id: `${origin.id}*${destination.id}`,
                origin: origin,
                destination: destination
              })
            }
          } else if (stop.itemType === ItemType.Waypoint && stop.lat && stop.lng) {
            if (result[result.length -1].waypoints) {
              result[result.length -1].waypoints!.push({ latitude: stop.lat, longitude: stop.lng})
            } else {
              result[result.length -1] = {
                ...result[result.length -1],
                waypoints: [{ latitude: stop.lat, longitude: stop.lng}]
              }
            }
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
