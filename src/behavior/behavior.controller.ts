import express from "express";
import parseUserAgent from "../utils/parseUserAgent";
import geoip from 'geoip-lite';

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
    const device = parseUserAgent(req.headers['user-agent']).device;
    
    let ipAddress = (req.headers["x-forwarded-for"] as string)|| (req.socket.remoteAddress as string );
    let country = 'N/A'
    if(ipAddress) {
      const geo = geoip.lookup(ipAddress as string);
      if(geo) {
        country = geo.country;
      }
    }
    return res.status(200).json({
      behavior: await behaviorRepository.create({
        formId: req.body.id,
        ipAddress: ipAddress || 'N/A',
        device,
        country,
        activeTime: req.body.activeTime,
        inactiveTime: req.body.inactiveTime,
        submissionDate: req.body.submissionDate,
        fields: req.body.fields,
        actions: req.body.actions,
      }),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};