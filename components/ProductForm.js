import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Image from "next/image";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
        _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images: existingImages,
        category: existingCategory,
        properties: existingProperties,
    }) => {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [category, setCategory] = useState(existingCategory || '')                                                                                                                             
    const [images, setImages] = useState(existingImages || []);
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(response => {
            setCategories(response.data);
        })
    }, [])
    async function saveProduct (e) {
        e.preventDefault();

        const data = {title, description, price, images, properties:productProperties};
        if (category.trim() !== '') {
            data.category = category
        }
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

    const propertiesToFill = [];
    function fillProperties(propCategory) {
        let refID = categories.find(({_id}) => _id === propCategory);
        if(propCategory && !!refID?.parent) {
            fillProperties(refID?.parent?._id);
        }
        if(!!propCategory?.length && propCategory) {
            let selCatInfo = categories.find(({_id}) => _id === propCategory);
            propertiesToFill.push(...(selCatInfo?.properties || []))
        }
        return
    }
    fillProperties(category);

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    return (
            <form onSubmit={saveProduct}>
                <label>Product Name</label>
                <input 
                    type="text" 
                    placeholder="Product Name"
                    value={title}
                    onChange={e =>  setTitle(e.target.value)} />
                <label>Category</label>
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}>
                    <option value="">Uncategorized</option>
                    {!!categories?.length && categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                <div>
                    <label>Properties</label>
                </div>
                <div className="grid grid-cols-4 gap-4">
                {!!propertiesToFill?.length && propertiesToFill.map(p => (
                    <div key={p.name} className="flex gap-1 items-center">
                        <div className="flex mb-2 text-center">
                            {p.name}
                        </div>
                        <select value={productProperties[p.name]} onChange={e => setProductProp(p.name, e.target.value)}>
                            <option value="">Select One</option>
                            {p.value.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                )
                )}
                </div>
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
                        <div className="h-24 w-24 p-1 bg-gray-100 flex items-center justify-center rounded-lg">
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
                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-1 btn1">Save</button>
                    <button type="button" className="btn-red py-1 px-4" onClick={() => router.push('/Products')}>Cancel</button>
                </div>
            </form>
    )
}

export default ProductForm