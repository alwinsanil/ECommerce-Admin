import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from 'mime-types';
import { isAdminRequest } from "./auth/[...nextauth]";
import mongooseConnect from "@/lib/mongoose";
const bucketName = process.env.bucketName

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    const form = new multiparty.Form();
    const {fields, files} = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            resolve({fields, files});
        })
    })
    console.log('Length: ', files.file.length)
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    const links = []
    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + "." + ext;
        console.log(newFilename)
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: "public-read",
            ContentType: mime.lookup(file.path)
        }))
        const link = `https://${bucketName}.S3.amazonaws.com/${newFilename}`
        links.push(link);
    }
    return res.json({links});
}

export const config = {
    api: {bodyParser: false}
};