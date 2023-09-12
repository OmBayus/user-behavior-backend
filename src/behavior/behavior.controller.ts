import express from "express";
import parseUserAgent from "../utils/parseUserAgent";
import geoip from "geoip-lite";

import behaviorRepository from "./behavior.repository";
import {
  convertTimeStampToHourAndMinute,
  convertMinuteToHourAndMinute,
  convertMicrosecondsToMinuteAndSeconds,
} from "../utils/date.converter";

export const getBehaviorByFormId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let result = {
      success: false,
      message: "",
      totalFormDuration: {
        shortest: "00:00",
        average: "00:00",
        longest: "00:00",
      },
      formFocusedDuration: {
        shortest: "00:00",
        average: "00:00",
        longest: "00:00",
      },
      inputFocusedDuration: {
        shortest: {
          name: "",
          type: "",
          duration: "00:00",
        },
        average: {
          duration: "00:00",
        },
        longest: {
          name: "",
          type: "",
          duration: "00:00",
        },
      },
      submissionTime: {
        earliest: {
          country: "",
          time: 0,
        },
        average: {
          time: 0,
        },
        latest: {
          country: "",
          time: 0,
        },
      },
      country: {
        most: {
          name: "",
          count: 0,
        },
        least: {
          name: "",
          count: 0,
        },
      },
      device: {
        most: {
          name: "",
          count: 0,
        },
        least: {
          name: "",
          count: 0,
        },
      },
    };

    const submissions = await behaviorRepository.getBehaviorByFormId(
      req.params.formId
    );

    // if no submissions found
    if (submissions === undefined || submissions.length === 0) {
      result.message = "No submissions found";
      return res.status(200).json({...result,submissions:[]});
    }

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

    result.totalFormDuration = {
      shortest: convertTimeStampToHourAndMinute(
        shortestTotalFormDuration.activeTime +
          shortestTotalFormDuration.inactiveTime
      ),
      average: convertTimeStampToHourAndMinute(averageTotalFormDuration),
      longest: convertTimeStampToHourAndMinute(
        longestTotalFormDuration.activeTime +
          longestTotalFormDuration.inactiveTime
      ),
    };

    // formFocusedDuration
    result.formFocusedDuration = {
      shortest: convertTimeStampToHourAndMinute(
        submissions.reduce((a, b) => (a.activeTime < b.activeTime ? a : b))
          .activeTime
      ),
      average: convertTimeStampToHourAndMinute(
        Math.trunc(
          submissions.reduce((a, b) => a + b.activeTime, 0) / submissions.length
        )
      ),
      longest: convertTimeStampToHourAndMinute(
        submissions.reduce((a, b) => (a.activeTime > b.activeTime ? a : b))
          .activeTime
      ),
    };

    // inputFocusedDuration
    let shortestInputFocusedDuration = {
      name: "",
      type: "",
      duration: Number.MAX_SAFE_INTEGER,
    };
    let averageInputFocusedDuration = { duration: 0 };
    let longestInputFocusedDuration = {
      name: "",
      type: "",
      duration: Number.MIN_SAFE_INTEGER,
    };

    submissions.forEach((submission: any) => {
      submission.fields.forEach((field: any) => {
        if (field.totalTime < shortestInputFocusedDuration.duration) {
          shortestInputFocusedDuration.name = field.name;
          shortestInputFocusedDuration.type = field.type;
          shortestInputFocusedDuration.duration = field.totalTime;
        }
        if (field.totalTime > longestInputFocusedDuration.duration) {
          longestInputFocusedDuration.name = field.name;
          longestInputFocusedDuration.type = field.type;
          longestInputFocusedDuration.duration = field.totalTime;
        }
        averageInputFocusedDuration.duration += field.totalTime;
      });
    });

    averageInputFocusedDuration.duration = Math.trunc(
      averageInputFocusedDuration.duration /
        (submissions.length * submissions[0].fields.length)
    );

    result.inputFocusedDuration = {
      shortest: {
        ...shortestInputFocusedDuration,
        duration: convertTimeStampToHourAndMinute(
          shortestInputFocusedDuration.duration
        ),
      },
      average: {
        duration: convertTimeStampToHourAndMinute(
          averageInputFocusedDuration.duration
        ),
      },
      longest: {
        ...longestInputFocusedDuration,
        duration: convertTimeStampToHourAndMinute(
          longestInputFocusedDuration.duration
        ),
      },
    };

    // submissionTime
    const submissionTimes = submissions.map((submission: any) => {
      const hour = submission.submissionDate.getHours();
      let minute = submission.submissionDate.getMinutes();
      minute += hour * 60;
      return { country: submission.country, minute };
    });

    const shortestSubmissionTime = submissionTimes.reduce((a: any, b: any) =>
      a.minute < b.minute ? a : b
    );
    const averageSubmissionTime = Math.trunc(
      submissionTimes.reduce((a: any, b: any) => a + b.minute, 0) /
        submissions.length
    );
    const longestSubmissionTime = submissionTimes.reduce((a: any, b: any) =>
      a.minute > b.minute ? a : b
    );

    result.submissionTime = {
      earliest: {
        country: shortestSubmissionTime.country,
        time: shortestSubmissionTime.minute,
      },
      average: { time: averageSubmissionTime },
      latest: {
        country: longestSubmissionTime.country,
        time: longestSubmissionTime.minute,
      },
    };

    // country
    let countriesMap: any = {};
    submissions.forEach((submission: any) => {
      if (countriesMap[submission.country]) {
        countriesMap[submission.country] += 1;
      } else {
        countriesMap[submission.country] = 1;
      }
    });

    const mostCountry = Object.keys(countriesMap).reduce((a, b) =>
      countriesMap[a] > countriesMap[b] ? a : b
    );

    const leastCountry = Object.keys(countriesMap).reduce((a, b) =>
      countriesMap[a] < countriesMap[b] ? a : b
    );

    result.country = {
      most: {
        name: mostCountry,
        count: countriesMap[mostCountry],
      },
      least: {
        name: leastCountry,
        count: countriesMap[leastCountry],
      },
    };

    // device
    let devicesMap: any = {};
    submissions.forEach((submission: any) => {
      if (devicesMap[submission.device]) {
        devicesMap[submission.device] += 1;
      } else {
        devicesMap[submission.device] = 1;
      }
    });

    const mostDevice = Object.keys(devicesMap).reduce((a, b) =>
      devicesMap[a] > devicesMap[b] ? a : b
    );

    const leastDevice = Object.keys(devicesMap).reduce((a, b) =>
      devicesMap[a] < devicesMap[b] ? a : b
    );

    result.device = {
      most: {
        name: mostDevice,
        count: devicesMap[mostDevice],
      },
      least: {
        name: leastDevice,
        count: devicesMap[leastDevice],
      },
    };

    return res.status(200).json({
      ...result,
      success: true,
      message: "Success",
      submissions: submissions.map(submission=>({
        name: submission.fullname || submission.ipAddress,
        date: (new Date(submission.submissionDate)).toISOString().split('T')[0],
        totalFormDuration: convertMicrosecondsToMinuteAndSeconds(
          submission.activeTime + submission.inactiveTime
        ),
        formFocusedDuration: convertMicrosecondsToMinuteAndSeconds(submission.activeTime),
        inputFocusedDuration: convertMicrosecondsToMinuteAndSeconds(submission.fields.reduce(
          (a: any, b: any) => a + b.totalTime,
          0
        )),
        submissionTime: submission.submissionDate.getHours()*60 + submission.submissionDate.getMinutes(),
        country: submission.country,
        device: submission.device,
        fields: submission.fields.map((field: any) => ({
          name: field.name,
          type: field.type,
          totalTime: convertMicrosecondsToMinuteAndSeconds(field.totalTime),
        })),
      })
      )
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const create = async (req: any, res: express.Response) => {
  try {
    const device =
      parseUserAgent(req.headers["user-agent"]).device ||
      req.device.type.toUpperCase();

    let ipAddress =
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);
    let country = "N/A";
    if (ipAddress) {
      const geo = geoip.lookup(ipAddress as string);
      if (geo) {
        console.log({ ...geo, ipAddress, device });
        country = geo.country;
        if (country) {
          var countries = require("country-data").countries;
          country = countries[country].name;
        }
      }
    }
    return res.status(200).json({
      behavior: await behaviorRepository.create({
        fullname: req.body.fullname,
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
