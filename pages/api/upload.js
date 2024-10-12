import multiparty from 'multiparty' ;
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

export default async function handle(req,res){
    const form = new multiparty.Form();
    const {fields, files} = await new Promise((resolve, reject) =>{
        form.parse(req, (err, fields, files)=> {
            if(err) reject(err);
            resolve({fields, files});
        });
    });

    const client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    });

    const links = [];
    for(const file of files.file){
        const ext = file.originalFilename.split('.').pop(); //pops last element and returns it
        const newFilename = Date.now() + "." + ext;
        await client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: newFilename,
                Body: fs.readFileSync(file.path),
                ACL: 'public-read',
                ContentType: mime.lookup(file.path)
        }));
        const link = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${newFilename}` ;
        links.push(link);
    }
    //console.log("Generated Links: ", links);
    return res.json({links}) ;
}

//so data isnt autoparsed to json as we need multipart formdata here
export const config = {
    api: {bodyParser: false},
}