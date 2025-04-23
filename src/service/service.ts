/*****************************************************************
 * Service layer — now Mongo‑only
 *****************************************************************/
import MapsHelper from "../helper/helper";
import {
  IFetchNearByPlacesReqObj,
  IFetchRouteControllerReqObj,
  IInsertPlaceServiceReqObj,
} from "../types/types";
import * as turf from "@turf/turf";
import ErrorHandler from "../utils/error.handler";

export default class MapsService extends MapsHelper {
  /* ---------- create place ------------------------------------- */
  protected insertPlaceService = async (reqObj: IInsertPlaceServiceReqObj) =>
    this.insertPlaceDbQuery(reqObj);

  /* ---------- nearby places via $geoNear ------------------------ */
  protected fetchNearByPlacesService = async (
    reqObj: IFetchNearByPlacesReqObj
  ) => {
    const lat = parseFloat(reqObj.lat);
    const lng = parseFloat(reqObj.long);
    const radius = parseFloat(reqObj.radius ?? "5000");

    const nearByDocs = await this.nearbyGeoNear({
      center: [lng, lat],
      radiusMeters: radius,
    });

    /* Convert each Mongo doc into a Turf point */
    const features = nearByDocs.map((doc: any) =>
      turf.point(doc.location.coordinates, {
        id: doc._id,
        name: doc.name,
        description: doc.description,
        distance_m: doc.dist_m,
        created_at: doc.createdAt,
        updated_at: doc.updatedAt,
      })
    );

    return turf.featureCollection(features);
  };

  /* ---------- route (supports 2+ coords) ------------------------ */
  protected fetchRouteService = async (reqObj: IFetchRouteControllerReqObj) => {
    const { coords } = reqObj;

    if (!coords || coords.length < 2)
      throw new ErrorHandler({
        message: "coords array must contain at least 2 points",
        status_code: 400,
      });

    /* Transform to [lng, lat] tuples */
    const points: [number, number][] = coords.map(({ lat, long }) => [
      parseFloat(String(long)),
      parseFloat(String(lat)),
    ]);

    const { orderedCoords, totalKm } = this.salesmanRoute(points);

    return {
      route: {
        type: "LineString",
        coordinates: orderedCoords,
      },
      distance_km: totalKm,
      estimated_time_min: null,
    };
  };

  /* ---------- (optional) straight‑line helper ------------------- */
  protected generateIntermediateLine = (
    from: [number, number],
    to: [number, number],
    steps = 20
  ) => {
    const coords: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      coords.push([
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
      ]);
    }
    return turf.lineString(coords);
  };
}
