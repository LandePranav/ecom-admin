const { Schema, models, model } = require("mongoose");

const orderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postal: String,
    addr: String,
    country: String,
    paid: {type:Boolean}
},{
    timestamps:true,
});

export const Order = models.Order || model('Order', orderSchema);