import * as mongoose from "mongoose";

const behaviorSchema = new mongoose.Schema({
  formId: String,
  ipAddress: String,
  device: String,
  country: String,
  activeTime: Number,
  inactiveTime: Number,
  submissionDate: Date,
  fields: [{
    name: String,
    type: String,
    totalTime: Number,
  }],
  actions: [{
    name: String,
    type: String,
    date: Date,
  }],
});

export default mongoose.model("behavior", behaviorSchema);
