// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MongooseConnect from "@/lib/mongoose";
import {Product} from "@/models/Product" ;

export default async function handler(req, res) {
    await MongooseConnect() ;
    const {method} = req ;
    if(method === 'POST'){
        const {title, description, price} = req.body;
        const productDoc = await Product.create({
            title,description,price
        }) ;
        res.json(productDoc);
    }

    if(method === 'GET'){
        res.json(await Product.find()) ;
    }

  }