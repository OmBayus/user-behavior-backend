import BehaviorModel from "./models/behavior.model";

import CreateBehaviorDto from "./dtos/behavior.dto";

export default {
  findAll: () => {
    return BehaviorModel.find({ isDeleted: false });
  },
  findOne: (id: string) => {
    return BehaviorModel.findById(id, { isDeleted: false });
  },

  create: (data: CreateBehaviorDto) => {
    const behavior = new BehaviorModel(data);
    return behavior.save();
  }
};
