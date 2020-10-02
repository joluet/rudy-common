import { RouteState, RouteStop, Connection, ConnectionMetadata } from './types'

export const mergeRouteStates = (routeStates: RouteState[]): RouteState => {
  const mergedState = [...routeStates]
    .reverse()
    .reduce((mergedState: RouteState, currentState: RouteState) => {
      const deletedInCurrent = currentState.filter(item => item.position === -1)
      return mergedState
        .map(item => {
          if (deletedInCurrent.find(deleted => item.id === deleted.id)) {
            return { ...item, position: -1 }
          } else {
            return item
          }
        })
        .concat(
          currentState.filter(
            item => !mergedState.some(merged => merged.id === item.id)
          )
        )
    })
    .filter(item => item.position !== -1)
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
    .filter(stop => routeState.find(item => stop.id === item.id))
    .sort((a, b) => {
      const positionA = routeState.find(item => item.id === a.id)!.position
      const positionB = routeState.find(item => item.id === b.id)!.position
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
          result.push({
            id: `${origin.id}*${destination.id}`,
            origin: origin,
            destination: destination
          })
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
  return currentConnections
    .filter(
      connection =>
        !deletedConnections.find(deleted => deleted === connection.id)
    )
    .concat(addedConnections)
    .reduce(
      (sumDurationAndDistance, connection) => ({
        duration: sumDurationAndDistance.duration + connection.duration,
        distance: sumDurationAndDistance.distance + connection.distance,
        stopsCount: sumDurationAndDistance.stopsCount + 1
      }),
      { duration: 0, distance: 0, stopsCount: 1 }
    )
}
