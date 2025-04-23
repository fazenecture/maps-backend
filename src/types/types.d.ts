export type IInsertPlaceServiceReqObj = {
  name: string;
  description: string;
  lat: number;
  long: number;
};

export type IFetchNearByPlacesReqObj = {
  lat: string;
  long: string;
  radius?: string;
};

export type IFetchRouteControllerReqObj = {
  coords: ILatLng[];
};

export type ILatLng = {
  lat: string | number;
  long: string | number;
};

export type ICalculateDistKmObj = {
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
};

export type IKdNode = {
  idx: number;
  axis: 0 | 1;
  left?: IKdNode;
  right?: IKdNode;
};

export type Coord = [number, number];
