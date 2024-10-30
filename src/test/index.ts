import {
  RouteState,
  RouteStop,
  Connection,
  ConnectionMetadata,
  ItemType
} from '../types'
import {
  mergeRouteStates,
  buildConnections,
  calculateMetricsSums
} from '../index'
import { expect } from 'chai'
import 'mocha'

describe('mergeRouteStates function', () => {
  it('should work when route state is empty', () => {
    const testStates: RouteState[] = []

    const mergeResult = mergeRouteStates(testStates)
    expect(mergeResult).to.deep.equal([])
  })

  it('should overwrite positions', () => {
    const testStates: RouteState[] = [
      [
        { id: 'id-1', position: 0 },
        { id: 'id-2', position: 1 },
        { id: 'id-3', position: 2 },
        { id: 'id-4', position: 3 }
      ],
      [
        { id: 'id-1', position: 1 },
        { id: 'id-2', position: 2 },
        { id: 'id-3', position: 0 },
        { id: 'id-4', position: 3 }
      ]
    ]

    const expectedMergeResult = [
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 2 },
      { id: 'id-3', position: 0 },
      { id: 'id-4', position: 3 }
    ].sort((a, b) => a.position - b.position)
    const mergeResult = mergeRouteStates(testStates)
    expect(mergeResult).to.deep.equal(expectedMergeResult)
  })

  it('should ensure delete always wins', () => {
    const testStates: RouteState[] = [
      [
        { id: 'id-1', position: 0 },
        { id: 'id-2', position: 1 },
        { id: 'id-3', position: 2 },
        { id: 'id-4', position: 3 }
      ],
      [
        { id: 'id-1', position: 0 },
        { id: 'id-2', position: 1 },
        { id: 'id-3', position: -1 },
        { id: 'id-4', position: 2 }
      ],
      [
        { id: 'id-1', position: 2 },
        { id: 'id-2', position: 3 },
        { id: 'id-3', position: 0 },
        { id: 'id-4', position: 1 }
      ]
    ]

    const expectedMergeResult = [
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 2 },
      { id: 'id-4', position: 0 }
    ].sort((a, b) => a.position - b.position)
    const mergeResult = mergeRouteStates(testStates)
    expect(mergeResult).to.deep.equal(expectedMergeResult)
  })

  it('should ensure additions are included in merge', () => {
    const testStates: RouteState[] = [
      [
        { id: 'id-1', position: 0 },
        { id: 'id-2', position: 1 },
        { id: 'id-3', position: 2 },
        { id: 'id-4', position: 3 }
      ],
      [
        { id: 'id-1', position: 0 },
        { id: 'id-2', position: 1 },
        { id: 'id-3', position: 2 },
        { id: 'id-4', position: 3 },
        { id: 'id-5', position: 4 }
      ],
      [
        { id: 'id-1', position: 1 },
        { id: 'id-2', position: 2 },
        { id: 'id-3', position: 0 },
        { id: 'id-4', position: 3 }
      ]
    ]

    const expectedMergeResult = [
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 2 },
      { id: 'id-3', position: 0 },
      { id: 'id-4', position: 3 },
      { id: 'id-5', position: 4 }
    ].sort((a, b) => a.position - b.position)
    const mergeResult = mergeRouteStates(testStates)
    expect(mergeResult).to.deep.equal(expectedMergeResult)
  })
})

describe('buildConnections function', () => {
  it('should use order from route state', () => {
    const stops: RouteStop[] = [
      {
        id: 'id-1',
        placeId: 'place-1',
        name: 'name 1',
        lat: 1.0,
        lng: 1.1,
        itemType: ItemType.Stop
      },
      {
        id: 'id-2',
        placeId: 'place-2',
        name: 'name 2',
        lat: 2.0,
        lng: 2.2,
        itemType: ItemType.Stop
      },
      {
        id: 'id-3',
        placeId: 'place-3',
        name: 'name 3',
        lat: 3.0,
        lng: 3.3,
        itemType: ItemType.Stop
      },
      {
        id: 'id-4',
        placeId: 'place-4',
        name: 'name 4',
        lat: 4.0,
        lng: 4.4,
        itemType: ItemType.Stop
      }
    ]
    const routeState: RouteState = [
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 2 },
      { id: 'id-3', position: 0 },
      { id: 'id-4', position: 3 }
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-3*id-1',
        origin: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
      },
      {
        id: 'id-1*id-2',
        origin: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.Stop
        }
      },
      {
        id: 'id-2*id-4',
        origin: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.Stop
        }
      }
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })

  it('should ignore stops that are missing from route state', () => {
    const stops: RouteStop[] = [
      {
        id: 'id-1',
        placeId: 'place-1',
        name: 'name 1',
        lat: 1.0,
        lng: 1.1,
        itemType: ItemType.Stop
      },
      {
        id: 'id-2',
        placeId: 'place-2',
        name: 'name 2',
        lat: 2.0,
        lng: 2.2,
        itemType: ItemType.Stop
      },
      {
        id: 'id-3',
        placeId: 'place-3',
        name: 'name 3',
        lat: 3.0,
        lng: 3.3,
        itemType: ItemType.Stop
      },
      {
        id: 'id-4',
        placeId: 'place-4',
        name: 'name 4',
        lat: 4.0,
        lng: 4.4,
        itemType: ItemType.Stop
      }
    ]
    const routeState: RouteState = [
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 0 },
      { id: 'id-4', position: 2 }
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-2*id-1',
        origin: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        }
      },
      {
        id: 'id-1*id-4',
        origin: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.Stop
        }
      }
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })

  it('should ignore sections', () => {
    const stops: RouteStop[] = [
      {
        id: 'id-1',
        placeId: 'place-1',
        name: 'name 1',
        lat: 1.0,
        lng: 1.1,
        itemType: ItemType.Stop
      },
      {
        id: 'id-2',
        name: 'Section',
        itemType: ItemType.Section
      },
      {
        id: 'id-3',
        placeId: 'place-3',
        name: 'name 3',
        lat: 3.0,
        lng: 3.3,
        itemType: ItemType.Stop
      },
      {
        id: 'id-4',
        placeId: 'place-4',
        name: 'name 4',
        lat: 4.0,
        lng: 4.4,
        itemType: ItemType.Stop
      }
    ]
    const routeState: RouteState = [
      { id: 'id-1', position: 0 },
      { id: 'id-2', position: 1 },
      { id: 'id-3', position: 2 },
      { id: 'id-4', position: 3 }
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-1*id-3',
        origin: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.Stop
        }
      },
      {
        id: 'id-3*id-4',
        origin: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.Stop
        }
      }
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })

  it('should not ignore waypoints', () => {
    const stops: RouteStop[] = [
      {
        id: 'id-1',
        placeId: 'place-1',
        name: 'name 1',
        lat: 1.0,
        lng: 1.1,
        itemType: ItemType.Stop
      },
      {
        id: 'id-2',
        placeId: 'place-2',
        name: 'name 2',
        lat: 2.0,
        lng: 2.2,
        itemType: ItemType.Waypoint
      },
      {
        id: 'id-3',
        placeId: 'place-3',
        name: 'name 3',
        lat: 3.0,
        lng: 3.3,
        itemType: ItemType.Waypoint
      },
      {
        id: 'id-4',
        placeId: 'place-4',
        name: 'name 4',
        lat: 4.0,
        lng: 4.4,
        itemType: ItemType.Stop
      }
    ]
    const routeState: RouteState = [
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 2 },
      { id: 'id-3', position: 0 },
      { id: 'id-4', position: 3 }
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-3*id-1',
        origin: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.Waypoint
        },
        destination: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        }
      },
      {
        id: 'id-1*id-2',
        origin: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.Waypoint
        }
      },
      {
        id: 'id-2*id-4',
        origin: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.Waypoint
        },
        destination: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.Stop
        }
      }
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })

  it('should construct ferry connections', () => {
    const stops: RouteStop[] = [
      {
        id: 'id-1',
        placeId: 'place-1',
        name: 'name 1',
        lat: 1.0,
        lng: 1.1,
        itemType: ItemType.Stop
      },
      {
        id: 'id-2',
        placeId: 'place-2',
        name: 'name 2',
        lat: 2.0,
        lng: 2.2,
        itemType: ItemType.FerryTerminalDeparture,
      },
      {
        id: 'id-3',
        placeId: 'place-3',
        name: 'name 3',
        lat: 3.0,
        lng: 3.3,
        itemType: ItemType.FerryTerminalArrival
      },
      {
        id: 'id-4',
        placeId: 'place-4',
        name: 'name 4',
        lat: 4.0,
        lng: 4.4,
        itemType: ItemType.Stop
      }
    ]
    const routeState: RouteState = [
      { id: 'id-1', position: 0 },
      { id: 'id-2', position: 1 },
      { id: 'id-3', position: 2 },
      { id: 'id-4', position: 3 }
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-1*id-4-name2',
        origin: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.FerryTerminalDeparture
        },
        transitType: 'to-terminal'
      },
      {
        id: 'id-1*id-4-name2-name3',
        origin: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.FerryTerminalDeparture
        },
        destination: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.FerryTerminalArrival
        },
        transitType: 'ferry'
      },
      {
        id: 'id-1*id-4-name3',
        origin: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.FerryTerminalArrival
        },
        destination: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.Stop
        },
        transitType: 'from-terminal'
      }
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })

  it('should also work with more than one ferry', () => {
    const stops: RouteStop[] = [
      {
        id: 'id-1',
        placeId: 'place-1',
        name: 'name 1',
        lat: 1.0,
        lng: 1.1,
        itemType: ItemType.Stop
      },
      {
        id: 'id-2',
        placeId: 'place-2',
        name: 'name 2',
        lat: 2.0,
        lng: 2.2,
        itemType: ItemType.FerryTerminalDeparture,
      },
      {
        id: 'id-3',
        placeId: 'place-3',
        name: 'name 3',
        lat: 3.0,
        lng: 3.3,
        itemType: ItemType.FerryTerminalArrival
      },
      {
        id: 'id-4',
        placeId: 'place-4',
        name: 'name 4',
        lat: 4.0,
        lng: 4.4,
        itemType: ItemType.FerryTerminalDeparture,
      },
      {
        id: 'id-5',
        placeId: 'place-5',
        name: 'name 5',
        lat: 5.0,
        lng: 5.5,
        itemType: ItemType.FerryTerminalArrival
      },
      {
        id: 'id-6',
        placeId: 'place-6',
        name: 'name 6',
        lat: 6.0,
        lng: 6.6,
        itemType: ItemType.Stop
      }
    ]
    const routeState: RouteState = [
      { id: 'id-1', position: 0 },
      { id: 'id-2', position: 1 },
      { id: 'id-3', position: 2 },
      { id: 'id-4', position: 3 },
      { id: 'id-5', position: 4 },
      { id: 'id-6', position: 5 },
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-1*id-6-name2',
        origin: {
          id: 'id-1',
          placeId: 'place-1',
          name: 'name 1',
          lat: 1.0,
          lng: 1.1,
          itemType: ItemType.Stop
        },
        destination: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.FerryTerminalDeparture
        },
        transitType: 'to-terminal'
      },
      {
        id: 'id-1*id-6-name2-name3',
        origin: {
          id: 'id-2',
          placeId: 'place-2',
          name: 'name 2',
          lat: 2.0,
          lng: 2.2,
          itemType: ItemType.FerryTerminalDeparture
        },
        destination: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.FerryTerminalArrival
        },
        transitType: 'ferry'
      },
      {
        id: 'id-1*id-6-name4',
        origin: {
          id: 'id-3',
          placeId: 'place-3',
          name: 'name 3',
          lat: 3.0,
          lng: 3.3,
          itemType: ItemType.FerryTerminalArrival
        },
        destination: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.FerryTerminalDeparture
        },
        transitType: 'from-and-to-terminal'
      },
      {
        id: 'id-1*id-6-name4-name5',
        origin: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
          itemType: ItemType.FerryTerminalDeparture
        },
        destination: {
          id: 'id-5',
          placeId: 'place-5',
          name: 'name 5',
          lat: 5.0,
          lng: 5.5,
          itemType: ItemType.FerryTerminalArrival
        },
        transitType: 'ferry'
      },
      {
        id: 'id-1*id-6-name5',
        origin: {
          id: 'id-5',
          placeId: 'place-5',
          name: 'name 5',
          lat: 5.0,
          lng: 5.5,
          itemType: ItemType.FerryTerminalArrival
        },
        destination: {
          id: 'id-6',
          placeId: 'place-6',
          name: 'name 6',
          lat: 6.0,
          lng: 6.6,
          itemType: ItemType.Stop
        },
        transitType: 'from-terminal'
      }
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })
})

describe('calculateMetricsSums function', () => {
  it('should add up all metrics correctly', () => {
    const currentConnections: ConnectionMetadata[] = [
      {
        id: 'id-1*id-2',
        duration: 1,
        distance: 10,
        polyline: ''
      },
      {
        id: 'id-2*id-3',
        duration: 2,
        distance: 20,
        polyline: ''
      },
      {
        id: 'id-3*id-4',
        duration: 3,
        distance: 30,
        polyline: ''
      }
    ]
    const expextedMetricsSums = {
      duration: 6,
      distance: 60,
      stopsCount: 4
    }
    const metricsSums = calculateMetricsSums(currentConnections, [], [])
    expect(metricsSums).to.deep.equal(expextedMetricsSums)
  })

  it('should exclude deleted connections', () => {
    const currentConnections: ConnectionMetadata[] = [
      {
        id: 'id-1*id-2',
        duration: 1,
        distance: 10,
        polyline: ''
      },
      {
        id: 'id-2*id-3',
        duration: 2,
        distance: 20,
        polyline: ''
      },
      {
        id: 'id-3*id-4',
        duration: 3,
        distance: 30,
        polyline: ''
      }
    ]
    const deletedConnections = ['id-2*id-3']
    const expextedMetricsSums = {
      duration: 4,
      distance: 40,
      stopsCount: 3
    }
    const metricsSums = calculateMetricsSums(
      currentConnections,
      deletedConnections,
      []
    )
    expect(metricsSums).to.deep.equal(expextedMetricsSums)
  })

  it('should consider added and deleted connections', () => {
    const currentConnections: ConnectionMetadata[] = [
      {
        id: 'id-1*id-2',
        duration: 1,
        distance: 10,
        polyline: ''
      },
      {
        id: 'id-2*id-3',
        duration: 2,
        distance: 20,
        polyline: ''
      },
      {
        id: 'id-3*id-4',
        duration: 3,
        distance: 30,
        polyline: ''
      }
    ]
    const addedConnections = [
      {
        id: 'id-4*id-5',
        duration: 4,
        distance: 40,
        polyline: ''
      }
    ]
    const deletedConnections = ['id-2*id-3']
    const expextedMetricsSums = {
      duration: 8,
      distance: 80,
      stopsCount: 4
    }
    const metricsSums = calculateMetricsSums(
      currentConnections,
      deletedConnections,
      addedConnections
    )
    expect(metricsSums).to.deep.equal(expextedMetricsSums)
  })

  it('should return stopsCount=0 if route is empty', () => {
    const currentConnections: ConnectionMetadata[] = [
      {
        id: 'id-1*id-2',
        duration: 1,
        distance: 10,
        polyline: ''
      },
      {
        id: 'id-2*id-3',
        duration: 2,
        distance: 20,
        polyline: ''
      }
    ]
    const addedConnections: ConnectionMetadata[] = []
    const deletedConnections = ['id-1*id-2', 'id-2*id-3']
    const expextedMetricsSums = {
      duration: 0,
      distance: 0,
      stopsCount: 0
    }
    const metricsSums = calculateMetricsSums(
      currentConnections,
      deletedConnections,
      addedConnections
    )
    expect(metricsSums).to.deep.equal(expextedMetricsSums)
  })
})