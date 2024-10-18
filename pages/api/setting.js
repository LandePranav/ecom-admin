import { Order } from "@/models/Order"

export default async function handler(req,res) {
    const {method} = req;

    if(method === "POST"){
        const {productId, price} = req?.body;
        const dataDoc = await Order.updateOne({productId, price}) ;
        res.status(200).json({dataDoc});
    }

    if(method === "GET"){
        const data = await Order.find({});
        res.json({data});
    }
}