import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Category({swal}) {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState('');
    const [properties, setProperties] = useState([]);

    async function saveCategory(e){
        e.preventDefault();
        const data = {
            name,
            parentCategory,
            properties:properties.map(p => (
                {
                    name:p.name,
                    value:p.value.split(','),
                }
            ))
        }

        if(editedCategory){
            console.log(data);
            data._id = editedCategory._id;
            await axios.put('/api/category', {...data});
        }else{
            await axios.post('/api/category', data);
        }
        setName('');
        setParentCategory('');
        setEditedCategory(null);
        fetchCategories();
        setProperties([]);
    }

    function handleEdit(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || '');
        setProperties(category.properties.map(({name,value}) => ({
            name,
            value: value.join(',')
        })));
        console.log(properties);
    }

    function handleDelete(category){
        swal.fire({
            title: 'Delete Category',
            text: `Are you Sure to delete "${category.name}" category?`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
        }).then(async result => {
            if(result.isConfirmed){
                await axios.delete('/api/category?_id='+category._id);
                fetchCategories();
            }
        })
    }

    async function fetchCategories(){
        await axios.get('/api/category').then((res)=> {
            setCategories(res.data);
        });
    }

    useEffect(()=>{
        fetchCategories();
    },[]);

    function addProperties(){
        setProperties(prev => {
            return [...prev, {name:'', value:''}];
        })
    }

    function handlePropertyNameChange(index,p,newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }

    function handlePropertyValueChange(index,p,newValue){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].value = newValue;
            return properties;
        })
    }
    async function removeProperty(indexToRemove, p){
        console.log("entered ermove prop");
        setProperties((prev) => {
            const properties = [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            }) ;
            return properties;
        })
    }

    return(
        <Layout>
            <h1>Categories</h1>
            <form onSubmit={saveCategory}>
                <label>
                    {!!editedCategory ? "Edit Curr Category" : "New Category Name"}
                </label>
                <div className="flex gap-2 items-center">
                    <input
                        className="m-0 py-1"
                        type="text"
                        placeholder="Category name"
                        value={name || ''}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <select
                        className="m-0 py-1"
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)} 
                    >
                        <option value=''>No Parent Category</option>
                        {/* {categories.length && categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        } */}
                        {!!editedCategory ? (
                            categories.length && categories.filter(c => c._id !== editedCategory._id).map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        ) : (
                            categories.length && categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <label className="block">Properties</label>
                    <button type="button" onClick={addProperties} className="btn-default border-black mb-2">
                        Add Properties
                    </button>
                    {properties.length > 0 && properties.map((p,index) => (
                        <div key={index} className="flex gap-2">
                            <input type="text" placeholder="property name" value={p.name} onChange={e => handlePropertyNameChange(index,p,e.target.value)} className="mb-1"/>
                            <input type="text" placeholder="property value" value={p.value} onChange={e=> handlePropertyValueChange(index,p,e.target.value)} className="mb-1" />
                            <button className="btn-red" type='button' onClick={()=>removeProperty(index)}>
                                Remove
                            </button>
                        </div>
                    )
                    )}

                </div>
                <div className="text-center mt-3">
                    {!!editedCategory && (
                        <button 
                            type="button" 
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties('');
                                } 
                            } 
                            className="btn-default mr-2"
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="my-0 pri-btn">
                        {!!editedCategory ? "Update" : "Create"}
                    </button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-4 -ml-2 w-dvw">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td>Operations</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map((category) => (
                        <tr key={category._id}>
                            <td>
                                {category.name}
                            </td>
                            <td>
                                {category?.parent?.name}
                            </td>
                            <td className="flex gap-2 items-center justify-center">
                                <button className="pri-btn" onClick={()=>handleEdit(category)} type="button">
                                    Edit
                                </button>
                                <button className="pri-btn" onClick={()=> handleDelete(category)} type="button">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </Layout>
    );
}

export default withSwal(({swal},ref) => (
    <Category swal={swal} />
 ));