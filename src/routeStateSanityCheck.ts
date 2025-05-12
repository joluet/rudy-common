import { ConnectionMetadata, ItemType, RouteState, RouteStop } from './types'

export const checkNumberOfRouteStateElementsEqualRouteElementNumber = ({
  routeState,
  routeElements
}: {
  routeState: RouteState
  routeElements: RouteStop[]
}): boolean => routeState.length === routeElements.length

export const checkNumberOfConnectionsMatchesRouteElementsNumber = ({
  routeElements,
  connections
}: {
  routeElements: RouteStop[]
  connections: ConnectionMetadata[]
}): boolean => {
  const routeElementsWithoutSections = routeElements.filter(
    ({ itemType }) => itemType !== ItemType.Section
  )
  return connections.length === routeElementsWithoutSections.length - 1
}

export const checkRouteStateHasNoHoles = ({
  routeState
}: {
  routeState: RouteState
}): boolean =>
  routeState
    .sort((a, b) => (a.position > b.position ? 1 : -1))
    .reduce(
      (result: boolean, { position }, index) => result && index === position,
      true
    )

export const checkEveryStateElementMatchesARouteElement = ({
  routeState,
  routeElements
}: {
  routeState: RouteState
  routeElements: RouteStop[]
}): boolean =>
  routeState.reduce(
    (result: boolean, stateElement) =>
      result && routeElements.some((element) => element.id === stateElement.id),
    true
  )

export const checkEveryConnectionConsistsOfTwoExistingRouteElements = ({
  routeElements,
  connections
}: {
  routeElements: RouteStop[]
  connections: ConnectionMetadata[]
}): boolean => {
  const routeElementsWithoutSections = routeElements.filter(
    ({ itemType }) => itemType !== ItemType.Section
  )
  return connections.every((connection) => {
    const [originId, destinationId] = connection.id.split('*')
    const origin = routeElementsWithoutSections.find(
      ({ id }) => id === originId
    )
    const destination = routeElementsWithoutSections.find(
      ({ id }) => id === destinationId
    )
    return !!origin && !!destination
  })
}

export const checkEveryStopHasAtLeastOneConnectionConnectingIt = ({
  routeElements,
  connections
}: {
  routeElements: RouteStop[]
  connections: ConnectionMetadata[]
}): boolean => {
  const routeElementsWithoutSections = routeElements.filter(
    ({ itemType }) => itemType !== ItemType.Section
  )
  const stopsWithOneConnection = routeElements.filter(
    (element) =>
      connections.filter((connection) => connection.id.includes(element.id))
        .length === 1
  )

  const stopsWithTwoConnections = routeElements.filter(
    (element) =>
      connections.filter((connection) => connection.id.includes(element.id))
        .length === 2
  )

  return (
    stopsWithOneConnection.length === 2 &&
    stopsWithTwoConnections.length === routeElementsWithoutSections.length - 2
  )
}

const isTerminalOfValidFerryConnection = ({
  terminal,
  connections
}: {
  terminal: RouteStop
  connections: ConnectionMetadata[]
}): boolean => {
  const terminalConnections = connections.filter(({ id }) =>
    id.includes(terminal.id)
  )
  if (terminalConnections.length < 2) {
    return false
  }
  if (
    terminalConnections.some(({ transitType }) => transitType === undefined)
  ) {
    return false
  }
  return true
}

export const checkHasValidFerryConnections = ({
  routeElements,
  connections
}: {
  routeElements: RouteStop[]
  connections: ConnectionMetadata[]
}): boolean =>
  routeElements
    .filter(
      ({ itemType }) =>
        itemType === ItemType.FerryTerminalDeparture ||
        itemType === ItemType.FerryTerminalArrival
    )
    .reduce(
      (result: boolean, terminal) =>
        result && isTerminalOfValidFerryConnection({ terminal, connections }),
      true
    )
