import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo,setProductInfo] = useState();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/Products');
  }
  async function deleteProduct() {
    await axios.delete('/api/products?id='+id);
    goBack();
  }
    return (
        <Layout>
            <h3 className="text-center">
                Are you sure you want to delete <b>{productInfo?.title}</b>?
            </h3>
            <div className="flex justify-center mt-4 mb-8">
                <div className="prodbox">
                <p><b>Product Name:</b> {productInfo?.title}</p>
                <p><b>Description:</b> {productInfo?.description}</p>
                <p><b>Price:</b> {productInfo?.price}</p>
                </div>
            </div>
            <div className="flex gap-2 justify-center">
                <button onClick={deleteProduct} className="btn-red py-1 px-4">
                    YES
                </button>
                <button onClick={goBack} className="btn-gray py-1 px-4">
                    NO
                </button>
            </div>
        </Layout>
    )
}
