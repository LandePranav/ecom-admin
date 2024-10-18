import { Setting } from "@/models/Settings";

export default async function handler(req,res) {
    const {method} = req;

//     if(method === "POST"){
//         const {productId, price} = req?.body;
//         const dataDoc = await Order.updateOne({productId, price}) ;
//         res.status(200).json({dataDoc});
//     }

    if(method === "GET"){
        const data = await Setting.find({});
        res.json({data});
    }

    if(method ==="POST"){
        const {featured, delivery} = req.body;
        await Setting.findOneAndUpdate({}, {featured,delivery});
        res.json("Updated Successfully!")
    }
}