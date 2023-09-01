import express from "express";
import parseUserAgent from "../utils/parseUserAgent";
import geoip from "geoip-lite";

import behaviorRepository from "./behavior.repository";

// totalFormDuration: {
//   shortest: 0,
//   average: 0,
//   longest: 0
// },
// formFocusedDuration: {
//   shortest: 0,
//   average: 0,
//   longest: 0
// },
// inputFocusedDuration: {
//   shortest: 0,
//   average: 0,
//   longest: 0
// },
// submissionTime: {
//   shortest: 0,
//   average: 0,
//   longest: 0
// },
// country: {
//   most: '',
//   least: ''
// },
// device: {
//   most: '',
//   least: ''
// },
// submissions: []

export const getBehaviorByFormId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const submissions = await behaviorRepository.getBehaviorByFormId(
      req.params.formId
    );

    // totalFormDuration
    const shortestTotalFormDuration = submissions.reduce((a, b) =>
      a.activeTime + a.inactiveTime < b.activeTime + b.inactiveTime ? a : b
    );
    const averageTotalFormDuration = Math.trunc(
      submissions.reduce((a, b) => a + b.activeTime + b.inactiveTime, 0) /
        submissions.length
    );
    const longestTotalFormDuration = submissions.reduce((a, b) =>
      a.activeTime + a.inactiveTime > b.activeTime + b.inactiveTime ? a : b
    );
    const totalFormDuration = {
      shortest:
        shortestTotalFormDuration.activeTime +
        shortestTotalFormDuration.inactiveTime,
      average: averageTotalFormDuration,
      longest:
        longestTotalFormDuration.activeTime +
        longestTotalFormDuration.inactiveTime,
    };

    // formFocusedDuration
    const formFocusedDuration = {
      shortest: submissions.reduce((a, b) =>
        a.activeTime < b.activeTime ? a : b
      ).activeTime,
      average: Math.trunc(
        submissions.reduce((a, b) => a + b.activeTime, 0) / submissions.length
      ),
      longest: submissions.reduce((a, b) =>
        a.activeTime > b.activeTime ? a : b
      ).activeTime,
    };

    const inputFocusedDurations = submissions.map((submission: any) => {
      // return submission.fields.reduce((a, b) => ab.totalTime ? a : b).totalTime
      return Math.trunc(
        submission.fields.reduce((a: any, b: any) => a + b.totalTime, 0)
      );
    });

    // inputFocusedDuration
    const inputFocusedDuration = {
      shortest: inputFocusedDurations.reduce((a: any, b: any) =>
        a < b ? a : b
      ),
      average: Math.trunc(
        inputFocusedDurations.reduce((a: any, b: any) => a + b, 0) /
          submissions.length
      ),
      longest: inputFocusedDurations.reduce((a: any, b: any) =>
        a > b ? a : b
      ),
    };

    // submissionTime
    const submissionTimes = submissions.map((submission: any) => {
      const hour = submission.submissionDate.getHours();
      let minute = submission.submissionDate.getMinutes();
      minute += hour * 60;
      return minute;
    });

    const shortestSubmissionTime = submissionTimes.reduce((a: any, b: any) =>
      a < b ? a : b
    );
    const averageSubmissionTime = Math.trunc(
      submissionTimes.reduce((a: any, b: any) => a + b, 0) / submissions.length
    );
    const longestSubmissionTime = submissionTimes.reduce((a: any, b: any) =>
      a > b ? a : b
    );
    const submissionTime = {
      shortest: `${Math.trunc(shortestSubmissionTime / 60)}:${shortestSubmissionTime % 60}`,
      average: `${Math.trunc(averageSubmissionTime / 60)}:${averageSubmissionTime % 60}`,
      longest: `${Math.trunc(longestSubmissionTime / 60)}:${longestSubmissionTime % 60}`,
    };

    // country
    let countriesMap:any = {}
    submissions.forEach((submission: any) => {
      if (countriesMap[submission.country]) {
        countriesMap[submission.country] += 1
      } else {
        countriesMap[submission.country] = 1
      }
    })

    const country = {
      most: Object.keys(countriesMap).reduce((a, b) => countriesMap[a] > countriesMap[b] ? a : b),
      least: Object.keys(countriesMap).reduce((a, b) => countriesMap[a] < countriesMap[b] ? a : b),
    }

    // device
    let devicesMap:any = {}
    submissions.forEach((submission: any) => {
      if (devicesMap[submission.device]) {
        devicesMap[submission.device] += 1
      } else {
        devicesMap[submission.device] = 1
      }
    })

    const device = {
      most: Object.keys(devicesMap).reduce((a, b) => devicesMap[a] > devicesMap[b] ? a : b),
      least: Object.keys(devicesMap).reduce((a, b) => devicesMap[a] < devicesMap[b] ? a : b),
    }

    return res.status(200).json({
      totalFormDuration,
      formFocusedDuration,
      inputFocusedDuration,
      submissionTime,
      country,
      device,
      submissions,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const create = async (req: express.Request, res: express.Response) => {
  try {
    const device = parseUserAgent(req.headers["user-agent"]).device;

    let ipAddress =
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);
    let country = "N/A";
    if (ipAddress) {
      const geo = geoip.lookup(ipAddress as string);
      if (geo) {
        country = geo.country;
      }
    }
    return res.status(200).json({
      behavior: await behaviorRepository.create({
        formId: req.body.formId,
        ipAddress: ipAddress || "N/A",
        device,
        country,
        activeTime: req.body.activeTime,
        inactiveTime: req.body.inactiveTime,
        submissionDate: new Date(),
        fields: req.body.fields,
        actions: req.body.actions,
      }),
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ error });
  }
};
