import Layout from "@/components/Layout";
import MongooseConnect from "@/lib/mongoose";
import { Setting } from "@/models/Settings";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Settings({featured:existingFeatured, delivery:existingDelivery}) {

    const [productList, setProductList] = useState([]);
    const [delivery, setDelivery] = useState(existingDelivery || '');
    const [featured, setFeatured] = useState(existingFeatured || '');

    useEffect(()=>{
        axios.get('/api/products').then(res => {
            setProductList(res.data);
        });
    },[])

    async function handleSubmit(e){
        e.preventDefault();
        const res = await axios.post('/api/setting', {featured, delivery});
        console.log(res);
        window.alert("Updated Successfully")
    }

    return(
        <div>
            <Layout>
                <h1>Settings</h1>
                <div className="py-2"></div>
                <form onSubmit={handleSubmit}>
                    <label>Featured Product</label>
                    <select value={featured} onChange={e=>{setFeatured(e.target.value)}}>
                        <option value=""> select product</option>
                        {productList?.map(product => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <label>Deivery Charge</label>
                    <input type="number" placeholder="$ price" value={delivery || ''} onChange={e=>setDelivery(e.target.value)} />
                    <button type="submit" className="border border-black rounded-lg px-4 py-1 uppercase bg-blue-500 font-semibold">Save</button>
                </form>
            </Layout>
        </div>
    );
}

export async function getServerSideProps(){
        await MongooseConnect();
        const data = await Setting.find({});
        console.log("Data in gssp: ", data);
        return {
            props: {
                featured: JSON.parse(JSON.stringify(data[0].featured)),
                delivery: JSON.parse(JSON.stringify(data[0].delivery))
            }
        }
}