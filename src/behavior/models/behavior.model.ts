import * as mongoose from "mongoose";

const behaviorSchema = new mongoose.Schema({
  formId: String,
  activeTime: Number,
  inactiveTime: Number,
  location: String,
  device: String,
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
