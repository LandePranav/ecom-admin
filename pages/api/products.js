// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MongooseConnect from "@/lib/mongoose";
import {Product} from "@/models/Product" ;
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await MongooseConnect() ;
    const {method} = req ;
    await isAdminRequest(req,res);

    if(method === 'POST'){
        const {title, description, price, images, category, properties} = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties
        }) ;
        res.json(productDoc);
    }

    if(method === 'GET'){
        if(req.query?.id){
            res.json(await Product.findOne({_id:req.query.id}))
        }else{
            res.json(await Product.find()) ;
        }
    }

    if(method === 'PUT'){
        const {title, description, price, images, _id, category, properties} = req.body;
        await Product.updateOne({_id}, {title, description, price, images, category, properties}) ;
        res.json(true);
    }

    if(method === 'DELETE'){
        const id = req.query?.id;
        if(id) await Product.deleteOne({_id:id});
        res.json("Product Deleted");
    }

  }