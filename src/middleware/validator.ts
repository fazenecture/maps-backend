import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// const decimalStr = Joi.number().pattern(/^[-+]?\d+(\.\d+)?$/);
const decimalStr = Joi.number();

export const insertPlaceValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().allow("").required(),
      lat: Joi.number().required(),
      long: Joi.number().required(),
    });

    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ message: "Validation error", errors: err });
  }
};

export const fetchNearbyValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = Joi.object({
      lat: Joi.string()
        .pattern(/^-?\d+(\.\d+)?$/)
        .required(),
      long: Joi.string()
        .pattern(/^-?\d+(\.\d+)?$/)
        .required(),
      radius: Joi.string().optional(),
    });

    const validated = await schema.validateAsync(req.query);
    req.body = validated;
    next();
  } catch (err) {
    res.status(400).json({ message: "Validation error", errors: err });
  }
};

export const fetchRouteValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const point = Joi.object({
      lat: decimalStr.required(),
      long: decimalStr.required(),
    });

    const schema = Joi.object({
      coords: Joi.array().items(point).min(2).required(),
    });

    req.body = await schema.validateAsync(req.body);

    next();
  } catch (err) {
    res.status(400).json({ message: "Validation error", errors: err });
  }
};
