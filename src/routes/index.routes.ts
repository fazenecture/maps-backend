import { Router } from "express";
import MapsController from "../controller/controller";
import {
  fetchNearbyValidation,
  fetchRouteValidation,
  insertPlaceValidation,
} from "../middleware/validator";

const {
  insertPlaceController,
  fetchNearByPlacesController,
  fetchRouteController,
} = new MapsController();

const router = Router();

/**
 * @route   POST /places
 * @desc    Insert a new place into the database with name, description, and coordinates.
 * @body    {
 *   name: string,
 *   description?: string,
 *   lat: number,
 *   long: number
 * }
 * @returns 201 Created or error if validation fails or DB insertion fails.
 */
router.post("/places", insertPlaceValidation, insertPlaceController);

/**
 * @route   GET /places/nearby
 * @desc    Fetch nearby places within a given radius based on the provided coordinates.
 * @query   {
 *   lat: string,
 *   long: string,
 *   radius?: string // (optional, defaults to 5000m)
 * }
 * @returns GeoJSON FeatureCollection of nearby places with metadata.
 */
router.get(
  "/places/nearby",
  fetchNearbyValidation,
  fetchNearByPlacesController
);

/**
 * @route   GET /route
 * @desc    Calculate an optimized route between a list of coordinates using a TSP heuristic.
 * @query   {
 *   coords: Array<{ lat: string | number, long: string | number }>
 * }
 * @returns GeoJSON LineString with the ordered path and total distance in km.
 */
router.get("/route", fetchRouteValidation, fetchRouteController);

export default router;
