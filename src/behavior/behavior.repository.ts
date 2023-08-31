import BehaviorModel from "./models/behavior.model";

import CreateBehaviorDto from "./dtos/behavior.dto";

export default {
  getFromBehavior: (id: string) => {
    return BehaviorModel.findById(id, { isDeleted: false });
  },

  create: (data: CreateBehaviorDto) => {
    const behavior = new BehaviorModel(data);
    return behavior.save();
  }
};
