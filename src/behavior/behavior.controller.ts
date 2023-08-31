import express from "express";

import behaviorRepository from "./behavior.repository";

export const getFromBehavior = async (req: express.Request, res: express.Response) => {
  try {
    const behavior = await behaviorRepository.getFromBehavior(req.params.id);
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