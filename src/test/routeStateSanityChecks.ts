import {
  createConnectionsMock,
  createRouteStateMock,
  createRouteElementsMock
} from './mocks'
import {
  checkEveryConnectionConsistsOfTwoExistingRouteElements,
  checkEveryStateElementMatchesARouteElement,
  checkEveryStopHasAtLeastOneConnectionConnectingIt,
  checkHasValidFerryConnections,
  checkNumberOfConnectionsMatchesRouteElementsNumber,
  checkNumberOfRouteStateElementsEqualRouteElementNumber,
  checkRouteStateHasNoHoles
} from '../routeStateSanityCheck'
import { expect } from 'chai'
import { TransitType } from '../types'

describe('checkNumberOfRouteStateElementsEqualRouteElementNumber', () => {
  it('should return true if length of elements is the same as length of route state elements', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })

    const routeState = createRouteStateMock(routeElements)

    const numberOfRouteStateElementsEqualRouteElementNumber = checkNumberOfRouteStateElementsEqualRouteElementNumber(
      {
        routeElements,
        routeState
      }
    )

    expect(numberOfRouteStateElementsEqualRouteElementNumber).to.equal(true)
  })

  it('should return false if length of elements is not the same as length of route state elements', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })

    const routeState = createRouteStateMock(routeElements).filter(
      (_, index) => index !== 5
    )

    const numberOfRouteStateElementsEqualRouteElementNumber = checkNumberOfRouteStateElementsEqualRouteElementNumber(
      {
        routeElements,
        routeState
      }
    )

    expect(numberOfRouteStateElementsEqualRouteElementNumber).to.equal(false)
  })
})

describe('checkNumberOfConnectionsMatchesRouteElementsNumber', () => {
  it('should return true if number of connections is lower by one regarding route elements without sections', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements)
    const numberOfConnectionsMatchesRouteElementsNumber = checkNumberOfConnectionsMatchesRouteElementsNumber(
      { routeElements, connections }
    )

    expect(numberOfConnectionsMatchesRouteElementsNumber).to.equal(true)
  })

  it('should return false if number of connections is not lower by one regarding route elements without sections', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements).filter(
      (_, index) => index !== 5
    )
    const numberOfConnectionsMatchesRouteElementsNumber = checkNumberOfConnectionsMatchesRouteElementsNumber(
      { routeElements, connections }
    )

    expect(numberOfConnectionsMatchesRouteElementsNumber).to.equal(false)
  })
})

describe('checkRouteStateHasNoHoles', () => {
  it('should return true if the route state has consecutive positions starting with 0', () => {
    const routeState = createRouteStateMock(
      createRouteElementsMock({
        numberOfStops: 10,
        ferryDeparturePositions: [2],
        sectionPositions: [5],
        waypointPositions: [8]
      })
    )
    const routeStateHasNoHoles = checkRouteStateHasNoHoles({ routeState })

    expect(routeStateHasNoHoles).to.equal(true)
  })

  it('should return false if the route state has no consecutive positions', () => {
    const routeState = createRouteStateMock(
      createRouteElementsMock({
        numberOfStops: 10,
        ferryDeparturePositions: [2],
        sectionPositions: [5],
        waypointPositions: [8]
      })
    ).filter((_, index) => index !== 5)
    const routeStateHasNoHoles = checkRouteStateHasNoHoles({ routeState })

    expect(routeStateHasNoHoles).to.equal(false)
  })

  it('should return false if the route states first element position is not 0', () => {
    const routeState = createRouteStateMock(
      createRouteElementsMock({
        numberOfStops: 10,
        ferryDeparturePositions: [2],
        sectionPositions: [5],
        waypointPositions: [8]
      })
    ).filter((_, index) => index !== 0)
    const routeStateHasNoHoles = checkRouteStateHasNoHoles({ routeState })

    expect(routeStateHasNoHoles).to.equal(false)
  })
})

describe('checkEveryStateElementMatchesARouteElement', () => {
  it('should return true if for every route state element exists a route element', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const routeState = createRouteStateMock(routeElements)
    const everyStateElementMatchesARouteElement = checkEveryStateElementMatchesARouteElement(
      { routeElements, routeState }
    )

    expect(everyStateElementMatchesARouteElement).to.equal(true)
  })

  it('should return false if an element only exists in the route state', () => {
    const _routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const routeState = createRouteStateMock(_routeElements)
    const routeElements = _routeElements.filter((_, index) => index !== 5)
    const everyStateElementMatchesARouteElement = checkEveryStateElementMatchesARouteElement(
      { routeElements, routeState }
    )

    expect(everyStateElementMatchesARouteElement).to.equal(false)
  })
})

describe('checkEveryConnectionConsistsOfTwoExistingRouteElements', () => {
  it('should return true if for every connection exist two route element', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements)
    const everyConnectionConsistsOfTwoExistingRouteElements = checkEveryConnectionConsistsOfTwoExistingRouteElements(
      { routeElements, connections }
    )

    expect(everyConnectionConsistsOfTwoExistingRouteElements).to.equal(true)
  })

  it('should return false if a connection only has one stop in route elements', () => {
    const _routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(_routeElements)
    const routeElements = _routeElements.filter((_, index) => index !== 6)
    const everyConnectionConsistsOfTwoExistingRouteElements = checkEveryConnectionConsistsOfTwoExistingRouteElements(
      { routeElements, connections }
    )

    expect(everyConnectionConsistsOfTwoExistingRouteElements).to.equal(false)
  })

  it('should return false if a connection has no stops in route elements', () => {
    const _routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(_routeElements)
    const routeElements = _routeElements.filter(
      (_, index) => index !== 6 && index !== 7
    )
    const everyConnectionConsistsOfTwoExistingRouteElements = checkEveryConnectionConsistsOfTwoExistingRouteElements(
      { routeElements, connections }
    )

    expect(everyConnectionConsistsOfTwoExistingRouteElements).to.equal(false)
  })
})

describe('checkEveryStopHasAtLeastOneConnectionConnectingIt', () => {
  it('should return true if every route element is connected by at least on connection', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements)
    const everyStopHasAtLeastOneConnectionConnectingIt = checkEveryStopHasAtLeastOneConnectionConnectingIt(
      { routeElements, connections }
    )

    expect(everyStopHasAtLeastOneConnectionConnectingIt).to.equal(true)
  })

  it('should return false if a route element has no connection connecting it', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements).map(
      (connection) => {
        if (connection.id.includes(routeElements[6].id)) {
          return {
            ...connection,
            id: connection.id.replace(routeElements[6].id, 'random')
          }
        } else {
          return connection
        }
      }
    )
    const everyConnectionConsistsOfTwoExistingRouteElements = checkEveryConnectionConsistsOfTwoExistingRouteElements(
      { routeElements, connections }
    )

    expect(everyConnectionConsistsOfTwoExistingRouteElements).to.equal(false)
  })

  it('should return false if a route element is only connected by one connection but is not first or last', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements).map(
      (connection) => {
        if (connection.id.startsWith(routeElements[6].id)) {
          return {
            ...connection,
            id: connection.id.replace(routeElements[6].id, 'random')
          }
        } else {
          return connection
        }
      }
    )

    const everyConnectionConsistsOfTwoExistingRouteElements = checkEveryConnectionConsistsOfTwoExistingRouteElements(
      { routeElements, connections }
    )

    expect(everyConnectionConsistsOfTwoExistingRouteElements).to.equal(false)
  })

  it('should return false if a route element is connected by more than one connection', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements)
    connections.push({
      id: `stop10*${routeElements[6]}`,
      duration: 1,
      distance: 1,
      polyline: [{ latitude: 1, longitude: 1 }]
    })
    connections.push({
      id: `${routeElements[6]}*stop12`,
      duration: 1,
      distance: 1,
      polyline: [{ latitude: 1, longitude: 1 }]
    })

    const everyConnectionConsistsOfTwoExistingRouteElements = checkEveryConnectionConsistsOfTwoExistingRouteElements(
      { routeElements, connections }
    )

    expect(everyConnectionConsistsOfTwoExistingRouteElements).to.equal(false)
  })
})

describe('checkHasValidFerryConnections', () => {
  it('should return true if the route has one simple valid ferry connection', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements)
    const hasValidFerryConnections = checkHasValidFerryConnections({
      routeElements,
      connections
    })

    expect(hasValidFerryConnections).to.equal(true)
  })

  it('should return true if the route element has one complex valid ferry connection', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2, 4],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements)
    const hasValidFerryConnections = checkHasValidFerryConnections({
      routeElements,
      connections
    })

    expect(hasValidFerryConnections).to.equal(true)
  })

  it('should return true if the route element has two valid ferry connection', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2, 7]
    })
    const connections = createConnectionsMock(routeElements)
    const hasValidFerryConnections = checkHasValidFerryConnections({
      routeElements,
      connections
    })

    expect(hasValidFerryConnections).to.equal(true)
  })

  it('should return false if a connection as a missing transit type', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2],
      sectionPositions: [5],
      waypointPositions: [8]
    })
    const connections = createConnectionsMock(routeElements).map(
      (connection) => {
        if (connection.transitType === TransitType.Ferry) {
          return {
            ...connection,
            transitType: undefined
          }
        } else {
          return connection
        }
      }
    )
    const hasValidFerryConnections = checkHasValidFerryConnections({
      routeElements,
      connections
    })

    expect(hasValidFerryConnections).to.equal(false)
  })

  it('should return false if complex ferry connections have missing transit type', () => {
    const routeElements = createRouteElementsMock({
      numberOfStops: 10,
      ferryDeparturePositions: [2, 4]
    })
    const connections = createConnectionsMock(routeElements).map(
      (connection) => {
        if (connection.transitType) {
          return {
            ...connection,
            transitType: undefined
          }
        } else {
          return connection
        }
      }
    )

    const hasValidFerryConnections = checkHasValidFerryConnections({
      routeElements,
      connections
    })

    expect(hasValidFerryConnections).to.equal(false)
  })
})
