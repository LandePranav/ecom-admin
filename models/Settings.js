const { Schema, default: mongoose, models, model } = require("mongoose");

const settingSchema = new Schema({
    featured: {type:mongoose.Types.ObjectId, ref:'Product',require:true},
    shipping: {type: Number}
});

export const Setting = models.Setting || model("Setting", settingSchema);