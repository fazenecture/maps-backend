import Place from "../model/place.model";
import { encodeHash } from "../helper/geohash.helper";
import {
  IInsertPlaceServiceReqObj,
  IFetchNearByPlacesReqObj,
  Coord,
} from "../types/types";

export default class MapsDB {
  protected insertPlaceDbQuery = async (obj: IInsertPlaceServiceReqObj) => {
    const { name, description, lat, long } = obj;

    return Place.create({
      name,
      description,
      geohash: encodeHash(lat, long),
      location: { type: "Point", coordinates: [long, lat] },
    });
  };

  protected nearbyGeoNear = async ({
    center,
    radiusMeters,
    limit = 50,
  }: {
    center: Coord;
    radiusMeters: number;
    limit?: number;
  }) =>
    Place.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: center },
          distanceField: "dist_m",
          maxDistance: radiusMeters,
          spherical: true,
        },
      },
      { $limit: limit },
    ]).exec();

  protected nearestN = async ({
    center,
    n = 10,
  }: {
    center: Coord;
    n?: number;
  }) =>
    Place.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: center },
          distanceField: "dist_m",
          spherical: true,
        },
      },
      { $limit: n },
    ]).exec();

  protected withinBBox = async ({
    lowerLeft,
    upperRight,
  }: {
    lowerLeft: Coord;
    upperRight: Coord;
  }) =>
    Place.aggregate([
      {
        $match: {
          location: { $geoWithin: { $box: [lowerLeft, upperRight] } },
        },
      },
    ]).exec();
}
