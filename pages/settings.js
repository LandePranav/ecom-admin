import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default async function Settings() {

    useEffect(()=>{
        // const products = axios.get('/api/products');
        // setProducts(() => [...products]);
        // const settings = axios.get('/api/setting');
        // setSettings({featured:settings.featured, delivery:settings.delivery});
    },[]);


    const [products, setProducts] = useState([]);
    const [featured, setFeatured] = useState();
    const [delivery, setDelivery] = useState(Number);
    const [settings, setSettings] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const data = await axios.post('/api/setting', {featured,delivery});
        console.log(data);
    }

    return(
        <Layout>
            <h1>SETTINGS</h1>
            <form onSubmit={handleSubmit}>
                <label>Featured Product</label>
                <select value={featured || ""} onChange={e => setFeatured(e.target.value)}>
                    {/* <option value={featured}>{featured}</option>
                    {products.map(product => (
                        <option key={product._id} value={product.title}>
                            {product.title}
                        </option>
                    ))} */}
                </select>
                <label>

                </label>
                <input type="number" placeholder="Delivery Charges" value={delivery} onChange={e=> setDelivery(e.target.value)} />

                <button type="submit">SAVE</button>
            </form>
        </Layout>
    )
}