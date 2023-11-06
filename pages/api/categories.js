import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const method = req.method;
    await mongooseConnect()

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Category.findOne({_id:req.query.id}).populate('parent'));
        } else {
            res.json(await Category.find().populate('parent'));
        }
    }

    if (method === 'POST') {
        const {name, parentCategory} = req.body;
        const CategoryDoc = await Category.create({name, parent:parentCategory})
        res.json(CategoryDoc)
    }

    if (method === 'PUT') {
        const {name, parentCategory, _id} = req.body;
        const CategoryDoc = await Category.updateOne({_id}, {name, parent:parentCategory})
        res.json(CategoryDoc)
    }

    if (method === 'DELETE') {
        if (req.query?._id) {
            await Category.deleteOne({_id:req.query?._id})
            res.json(true);
        }        
    }
}