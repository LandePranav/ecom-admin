import Layout from "@/components/Layout";
import { useState } from "react" ;
import axios from "axios";
import { useRouter } from "next/router";

export default function NewProduct() {
    const [title, setTitle] = useState("") ;
    const [description, setDescription] = useState("") ;
    const [price, setPrice] = useState("") ;
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function createProduct(e){
        e.preventDefault() ;
        const data = {title, description, price} ;
        await axios.post("/api/products", data) ;
        setGoToProducts(true);
    }

    if(goToProducts){
        router.push('/products');
    }

    return(
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
                <label>Product Name</label>
                <input type="text" placeholder="Product Name" value={title || ""} onChange={e => setTitle(e.target.value)}></input>
                <label>Description</label>
                <textarea type="text" placeholder="Description..." value={description || ""} onChange={e => setDescription(e.target.value)}></textarea>
                <label>Price</label>
                <input type="number" placeholder="Price" value={price || ""} onChange={e => setPrice(e.target.value)}></input>
                <button type="submit" className="pri-btn">
                    Save
                </button>
            </form>
        </Layout>
    );
}