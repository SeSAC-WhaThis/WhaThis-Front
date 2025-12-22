import React, { useEffect, useState } from "react";
import ProductList from "../../components/products/ProductList";
import { Product } from "../../store/productSlice";
import axios from "axios";

const PreorderPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: 실제 백엔드 API 엔드포인트로 교체해주세요. (예: /api/products?type=preorder)
        const response = await axios.get("/api/products/preorder");
        const data = response.data;
        setProducts(data);
      } catch (error) {
        console.error("Error fetching preorder products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">프리오더</h1>
      {isLoading ? <div>Loading...</div> : <ProductList products={products} />}
    </div>
  );
};

export default PreorderPage;
