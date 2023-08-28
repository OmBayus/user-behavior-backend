import express from "express";

import behaviorRepository from "./behavior.repository";

export const findAll = async (req: express.Request, res: express.Response) => {
  try {
    const behaviors = await behaviorRepository.findAll();
    return res.status(200).json({
      behaviors,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const findOne = async (req: express.Request, res: express.Response) => {
  try {
    const behavior = await behaviorRepository.findOne(req.params.id);
    return res.status(200).json({
      behavior,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const create = async (req: express.Request, res: express.Response) => {
  try {
    return res.status(200).json({
      behavior: await behaviorRepository.create(req.body),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};