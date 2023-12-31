import Layout from "@/components/Layout"
import axios from "axios";
import { useEffect, useState } from "react"
import { withSwal } from "react-sweetalert2"

function Categories({swal}) {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, [])
    function fetchCategories() {
        axios.get('/api/categories').then(response => {
            setCategories(response.data);
        })
    }
    async function saveCategory(e) {
        e.preventDefault();
        const data = {
            name, 
            properties:properties.map(p => ({
                name:p.name, value:p.value.split(',')
            }))
        };
        if (parentCategory !== '') {
        data.parentCategory = parentCategory;
        }
        if (editMode) {
            data._id = editMode._id;
            await axios.put('/api/categories', data);
            setEditMode(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category) {
        setEditMode(category);
        setName(category.name);
        {category.parent?._id ? setParentCategory(category.parent?._id) : setParentCategory("")};
        {category?.properties
            ? setProperties(
                category.properties.map(({name, value}) => ({
                    name, value:value.join(',')
                }))
            )
            : setProperties('')};
    }
    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            icon: 'warning',
            //cancelButtonColor: '',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#bf0000',
            //width: '25rem',
        }).then(async result => {
            // when confirmed and promise resolved...
            if(result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id)
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties(prev => {
            return  [...prev, {name:'', value:''}]
        })
    }
    function handlePropNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function handlePropValueChange(index, property, newValue) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].value = newValue;
            return properties;
        })
    }
    function removeProp(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !==  indexToRemove;
        });
    });
}

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editMode ? 'Edit Category' : 'Create New Category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                        type="text" 
                        placeholder={'Category Name'}
                        value={name}
                        onChange={e => setName(e.target.value)} />
                    <select 
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)} >
                        <option value="">No Parent Category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label>Properties</label>
                    <button 
                        type="button" 
                        className="btn2 mb-2"
                        onClick={() => addProperty()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                        Add New Property
                    </button>
                    {!!properties?.length && properties.map((property, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <div key={index} className="flex gap-1">
                            <input 
                                type="text" 
                                placeholder="Property Name"
                                value={property.name}
                                onChange={e => handlePropNameChange(index, property, e.target.value)} />
                            <input 
                                type="text" 
                                placeholder="Values (Comma Separated)"
                                value={property.value || ''}
                                onChange={e => handlePropValueChange(index, property, e.target.value)} />
                            <button type="button" onClick={() => removeProp(index)} className="btn-red mb-2 px-2">Delete</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="btn1 px-4 py-1">Save</button>
                    {!!editMode && (
                        <button 
                            type="button" 
                            onClick={() => {
                                setEditMode(null);
                                setName('');
                                setParentCategory('')
                                setProperties([]);
                            }} 
                            className="btn-red px-4 py-1">
                            Cancel
                        </button>
                     )}
                </div>
            </form>
            {!editMode && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className="flex flex-row gap-2">
                                <button 
                                    className="btn1 items-center gap-1 flex flex-row py-1 px-2" 
                                    onClick={() => editCategory(category)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Edit
                                </button>
                                <button 
                                    className="btn1 items-center gap-1 flex flex-row py-1 px-2"
                                    onClick={() => deleteCategory(category)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => {
    return <Categories swal={swal}/>
});