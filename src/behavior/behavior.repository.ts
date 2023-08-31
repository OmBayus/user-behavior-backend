import BehaviorModel from "./models/behavior.model";

export default {
  getBehaviorByFormId: (id: string) => {
    return BehaviorModel.find({ formId: id });
  },

  create: (data: any) => {
    const behavior = new BehaviorModel(data);
    return behavior.save();
  }
};
