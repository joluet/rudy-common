import { ConnectionMetadata, ItemType, RouteStop, TransitType } from '../types'

export const createFerryStopsArrayMock = (
  numberOfFerryConnections: number,
  startPosition: number
) =>
  Array.from({ length: numberOfFerryConnections * 2 }, (_, index) => {
    const itemType =
      index % 2 === 0
        ? ItemType.FerryTerminalDeparture
        : ItemType.FerryTerminalArrival
    const elementIndex = index + startPosition
    return {
      id: `ferry${elementIndex}`,
      itemType: itemType,
      lat: elementIndex,
      lng: elementIndex,
      name: elementIndex.toString(),
      position: elementIndex
    }
  })

export const createRouteElementsMock = ({
  numberOfStops,
  ferryDeparturePositions,
  sectionPositions,
  waypointPositions
}: {
  numberOfStops: number
  ferryDeparturePositions?: number[]
  sectionPositions?: number[]
  waypointPositions?: number[]
}) =>
  Array.from({ length: numberOfStops }, (_, index) => {
    let itemType = ItemType.Stop
    let id = `stop${index}`
    if (ferryDeparturePositions?.includes(index)) {
      itemType = ItemType.FerryTerminalDeparture
      id = `ferry${index}`
    } else if (ferryDeparturePositions?.map((_i) => _i + 1).includes(index)) {
      itemType = ItemType.FerryTerminalArrival
      id = `ferry${index}`
    } else if (sectionPositions?.includes(index)) {
      itemType = ItemType.Section
      id = `section${index}`
    } else if (waypointPositions?.includes(index)) {
      itemType = ItemType.Waypoint
      id = `waypoint${index}`
    }
    return {
      id,
      itemType,
      lat: index,
      lng: index,
      name: index.toString()
    }
  })

export const createRouteStateMock = (routeElemetsInCorrectOrder: RouteStop[]) =>
  routeElemetsInCorrectOrder.map(({ id }, position) => ({
    id,
    position
  }))

export const createConnectionsMock = (
  routeElemetsInCorrectOrder: RouteStop[]
) => {
  const mock: ConnectionMetadata[] = []
  routeElemetsInCorrectOrder
    .filter(({ itemType }) => itemType !== ItemType.Section)
    .forEach((element, index, self) => {
      let transitType: TransitType | undefined = undefined
      if (element.itemType === ItemType.FerryTerminalDeparture) {
        transitType = TransitType.Ferry
      } else if (element.itemType === ItemType.FerryTerminalArrival) {
        transitType = TransitType.FromTerminal
      }
      if (index !== 0) {
        mock[mock.length - 1].id = `${mock[mock.length - 1].id}*${element.id}`
        if (transitType === TransitType.Ferry) {
          mock[mock.length - 1].transitType = mock[mock.length - 1].transitType
            ? TransitType.FromAndToTerminal
            : TransitType.ToTerminal
        }
      }
      if (index !== self.length - 1) {
        mock.push({
          id: element.id,
          duration: 1,
          distance: 1,
          polyline: '',
          transitType
        })
      }
    })
  return mock
}
