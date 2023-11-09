import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { isAdminRequest } from "./auth/[...nextauth]";
import mongooseConnect from "@/lib/mongoose";

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    const {imageArray} = req.body;
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    for (const images of imageArray) {
        const filename = images.split('/').pop();
        console.log(filename);
        try {
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.bucketName,
                Key: filename,
            }   
            ));
            console.log(`Successfully deleted file ${filename}`);
        } catch (err) {
            console.error(`Failed to delete file ${filename}: ${err}`);
        }
    };
    res.json(true)
}


