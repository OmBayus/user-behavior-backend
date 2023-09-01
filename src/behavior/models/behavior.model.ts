import * as mongoose from "mongoose";

const behaviorSchema = new mongoose.Schema({
  formId: String,
  ipAddress: String,
  device: String,
  country: String,
  activeTime: Number,
  inactiveTime: Number,
  submissionDate: Date,
  fields: Array,
  actions: Array,
  // fields: [{
  //   id: String,
  //   name: String,
  //   type: String,
  //   totalTime: Number,
  // }],
  // actions: [{
  //   fieldId: String,
  //   name: String,
  //   type: String,
  //   date: Number,
  // }],
});

export default mongoose.model("behavior", behaviorSchema);
