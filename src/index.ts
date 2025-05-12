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
  FerryTerminal
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
  Photo,
  TransitType,
  FerryTerminal
}

import {
  createRouteStateMock,
  createConnectionsMock,
  createFerryStopsArrayMock,
  createRouteElementsMock
} from './test/mocks'

export {
  createRouteStateMock,
  createConnectionsMock,
  createFerryStopsArrayMock,
  createRouteElementsMock
}

import {
  checkNumberOfRouteStateElementsEqualRouteElementNumber,
  checkEveryConnectionConsistsOfTwoExistingRouteElements,
  checkEveryStateElementMatchesARouteElement,
  checkEveryStopHasAtLeastOneConnectionConnectingIt,
  checkHasValidFerryConnections,
  checkNumberOfConnectionsMatchesRouteElementsNumber,
  checkRouteStateHasNoHoles
} from './routeStateSanityCheck'

export {
  checkNumberOfRouteStateElementsEqualRouteElementNumber,
  checkEveryConnectionConsistsOfTwoExistingRouteElements,
  checkEveryStateElementMatchesARouteElement,
  checkEveryStopHasAtLeastOneConnectionConnectingIt,
  checkHasValidFerryConnections,
  checkNumberOfConnectionsMatchesRouteElementsNumber,
  checkRouteStateHasNoHoles
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
          const origin = stop
          const destination = array[index + 1]
          const prevStop = array
            .slice(0, index)
            .find((stop) => stop.itemType === ItemType.Stop)
          const nextStop = array
            .slice(index + 1)
            .find((stop) => stop.itemType === ItemType.Stop)
          let element: Connection = {
            id: `${origin.id}*${destination.id}`,
            origin: origin,
            destination: destination
          }

          if (
            prevStop &&
            nextStop &&
            origin.itemType === ItemType.FerryTerminalDeparture
          ) {
            element = {
              ...element,
              transitType: TransitType.Ferry
            }
          } else if (
            prevStop &&
            origin.itemType === ItemType.FerryTerminalArrival
          ) {
            if (
              nextStop &&
              destination.itemType === ItemType.FerryTerminalDeparture
            ) {
              element = {
                ...element,
                transitType: TransitType.FromAndToTerminal
              }
            } else {
              element = {
                ...element,
                transitType: TransitType.FromTerminal
              }
            }
          } else {
            if (
              nextStop &&
              destination.itemType === ItemType.FerryTerminalDeparture
            ) {
              element = {
                ...element,
                transitType: TransitType.ToTerminal
              }
            }
          }
          result.push(element)
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
