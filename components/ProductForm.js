import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({_id,title:existingTitle, description:existingDescription, price:existingPrice, images:existingImages, category:selectedCategory, properties: assignedProperties}) {
    const [title, setTitle] = useState(existingTitle || "") ;
    const [description, setDescription] = useState(existingDescription || "") ;
    const [price, setPrice] = useState(existingPrice || "") ;
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false) ;
    const [category, setCategory] = useState(selectedCategory || null);
    const [categories, setCategories] = useState([]);
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const router = useRouter();

    useEffect(()=>{
        axios.get('/api/category').then(res => {
            setCategories(res.data);
        })
    },[]);

    async function saveProduct(e){
        e.preventDefault() ;
        const data = {title, description, price, images, category, properties:productProperties} ;
        if(_id){
            //update
            await axios.put("/api/products", {...data, _id});
            setGoToProducts(true);
        }else{
            //create
            await axios.post("/api/products", data) ;
            setGoToProducts(true);
        }
    }

    async function uploadImages(e){
        setIsUploading(true);
        const files = e.target?.files;
        if(files?.length > 0){
            const data = new FormData();
            for(const file of files){
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            //console.log("Uploaded Res: ",res.data.links);
            setImages(oldImages => {
               return [...oldImages, ...res.data.links];
            });
        }
        setIsUploading(false);
    }

    if(goToProducts){
        router.push('/products');
    }

    async function updateImagesOrder(newimages){
        const updatedImages = await newimages.map(img => {
            if(typeof img === 'object' && img instanceof String){
                return img.toString();
            }
            return img;
        })
        setImages(updatedImages);
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category){
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        console.log(propertiesToFill);
        while(catInfo?.parent?._id){
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id )
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(p,newValue){
        setProductProperties(prev => {
            const properties = {...prev};
            properties[p.name] = newValue;
            return properties
        })
    }

    return(
            <form onSubmit={saveProduct}>
                <label>Product Name</label>
                <input type="text" placeholder="Product Name" value={title || ""} onChange={e => setTitle(e.target.value)}></input>
                <label>
                    Category
                </label>
                <select value={category || ''} onChange={e=>setCategory(e.target.value)}>
                    <option value=''>Select Category</option>
                    {categories.length > 0 && categories.map(c => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {propertiesToFill.length > 0 &&  propertiesToFill.map(p => (
                    <div key={p._id} className="flex gap-2 items-center uppercase">
                        <div>{p.name}</div>
                        <select className="mb-0" value={productProperties[p.name] || ''} onChange={(e)=>setProductProp(p,e.target.value)}>
                            <option value=''>Select Value</option>
                            {p.value.map(v => (
                                <option key={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                ))
                }
                <label>
                    Photos
                </label>
                <div className="mb-2 w-full flex gap-10 items-center">
                    <label className="w-[15vw] px-[1rem] py-[0.5rem] text-sm font-semibold cursor-pointer border text-gray-600 border-black bg-gray-200 rounded-lg flex flex-col items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                       Upload
                       <input type="file" multiple onChange={uploadImages} className="hidden" />
                    </label>
                    <div className="flex flex-grow justify-start items-center gap-5 flex-wrap overflow-y-hidden">
                        {!images?.length && (
                            <div>
                                {!isUploading && ("No Photos of Product Yet.")}
                            </div>
                        ) }
                        <ReactSortable
                            list={images}
                            className="flex flex-wrap gap-2"
                            setList={updateImagesOrder}
                        >
                            {!!images?.length && (
                                    images.map((img)=> (
                                        <div key={img} className="relative w-[100px] h-[65px] flex-shrink-0">
                                            <Image src={img} className="rounded-lg border border-black object-cover" fill  alt="product img" />
                                            </div>
                                    ))
                                )
                            }
                        </ReactSortable>

                        {isUploading && (
                            <div className="w-[100px] h-[65px] flex items-center justify-center">
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
                <label>Description</label>
                <textarea type="text" placeholder="Description..." value={description || ""} onChange={e => setDescription(e.target.value)}></textarea>
                <label>Price</label>
                <input type="number" placeholder="Price" value={price || ""} onChange={e => setPrice(e.target.value)}></input>
                <button type="submit" className="pri-btn">
                    Save
                </button>
            </form>
    );
}