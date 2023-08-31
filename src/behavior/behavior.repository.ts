import BehaviorModel from "./models/behavior.model";

export default {
  getFromBehavior: (id: string) => {
    return BehaviorModel.findById(id, { isDeleted: false });
  },

  create: (data: any) => {
    const behavior = new BehaviorModel(data);
    return behavior.save();
  }
};
