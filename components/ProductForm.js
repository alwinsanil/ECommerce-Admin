import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import Image from "next/image";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
        _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images: existingImages,
    }) => {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter();
    async function saveProduct (e) {
        e.preventDefault();

        const data = {title, description, price, images};
        if(_id) {
            //update
            await axios.put('/api/products', {...data, _id})
        } else {
            //create
            await axios.post('/api/products', data);
        }

        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/Products');
    }

    async function uploadImages(e) {
        const files = e.target?.files;
        if (files?.length >0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data)
            console.log(res.data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            })
            setIsUploading(false);
        }
        e.target.value = null;
    }

    function updateImagesOrder(images) {
    setImages(images);
    }

    return (
            <form onSubmit={saveProduct}>
                <label>Product Name</label>
                <input 
                    type="text" 
                    placeholder="Product Name"
                    value={title}
                    onChange={e =>  setTitle(e.target.value)} />
                <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-2">
                    <ReactSortable 
                        list={images} 
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-2" >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24">
                            <img src={link} alt="" className="rounded-lg" />
                            {/* <Image className="rounded-lg"
                                src={link}
                                width={500}
                                height={500}
                                alt="" /> */}
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 w-24 p-1 bg-gray-100 flex items-center rounded-lg">
                            <Spinner />
                        </div>
                    )}
                    <label className="imgupload">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                        <input type="file" onChange={uploadImages} multiple className="hidden" /> 
                    </label>
                    {!images?.length && (
                        <div>No Photos in this product</div>
                    )}
                </div>
                <label>Description</label>
                <textarea 
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)} />
                <label>Price (In US$)</label>
                <input 
                    type="number" 
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)} />
                <button type="submit" className="px-4 py-1 btn1">Save</button>
            </form>
    )
}

export default ProductForm