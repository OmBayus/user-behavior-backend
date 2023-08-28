import * as mongoose from "mongoose";

const behaviorSchema = new mongoose.Schema({
  test: String,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("behavior", behaviorSchema);
