import MongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req,res) {
    await MongooseConnect();
    const method = req?.method;
    //await isAdminRequest(req,res);

    if(method === 'POST'){
        const {name, parentCategory, properties} = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties
        });
        res.json(categoryDoc);
    }

    if(method === 'GET'){
        res.json(await Category.find({}).populate('parent')) ;
    }

    if(method === 'PUT'){
        const {_id, name, parentCategory, properties} = req.body ;
        console.log(req.body)
        if(parentCategory.length > 0){
            await Category.updateOne({_id:_id}, {name:name,parent:parentCategory,properties});
        }else{
            await Category.updateOne({_id:_id}, {$set:{name:name,properties}, $unset:{parent:''}});
        }
        res.json("Update Success");
    }

    if(method === 'DELETE'){
        const {_id} = req?.query ;
        await Category.deleteOne({_id:_id});
        res.json("Deletion Success");
    }
}