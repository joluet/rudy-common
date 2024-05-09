import {
  RouteState,
  RouteStop,
  Connection,
  ItemType
} from '../types'
import {
  mergeRouteStates,
  buildConnections,
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

  it('should add waypoints in the correct order', () => {
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
        },
        waypoints: [{ latitude:2.0, longitude: 2.2 }]
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

  it('should add more than one waypoint between stops', () => {
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
      { id: 'id-1', position: 3 },
      { id: 'id-2', position: 2 },
      { id: 'id-3', position: 1 },
      { id: 'id-4', position: 0 }
    ]
    const expectedConnections: Connection[] = [
      {
        id: 'id-4*id-1',
        origin: {
          id: 'id-4',
          placeId: 'place-4',
          name: 'name 4',
          lat: 4.0,
          lng: 4.4,
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
        waypoints: [{ latitude:3.0, longitude: 3.3 }, { latitude:2.0, longitude: 2.2 }]
      },
    ]
    const connections = buildConnections(stops, routeState)
    expect(connections).to.deep.equal(expectedConnections)
  })
})