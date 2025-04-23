import { Request, Response } from "express";
import MapsService from "../service/service";
import customErrorHandler from "../utils/custom.error.handler";

export default class MapsController extends MapsService {
  public insertPlaceController = async (req: Request, res: Response) => {
    try {
      const { name, description, lat, long } = req.body;
      await this.insertPlaceService({
        name,
        description,
        lat,
        long,
      });

      res.status(200).send({
        success: true,
        message: "Created place",
      });
    } catch (err) {
      customErrorHandler(res, err);
    }
  };

  public fetchNearByPlacesController = async (req: Request, res: Response) => {
    try {
      const { lat, long, radius } = req.query as {
        lat: string;
        long: string;
        radius?: string;
      };

      const data = await this.fetchNearByPlacesService({
        radius,
        lat,
        long,
      });

      res.status(200).send({
        success: true,
        data,
      });
    } catch (err) {
      customErrorHandler(res, err);
    }
  };

  public fetchRouteController = async (req: Request, res: Response) => {
    try {
      const { coords } = req.body;
      const data = await this.fetchRouteService({
        coords,
      });

      res.status(200).send({
        success: true,
        data,
      });
    } catch (err) {
      customErrorHandler(res, err);
    }
  };
}
