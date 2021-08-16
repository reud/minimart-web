import { FC, useEffect, useState } from "react";
import { fetchProduct, Product } from "../../lib/product";
import { Layout } from "../../components/Layout";
import { useRouter } from "next/router";
import { pushProduct, useCartItemCount } from "../../lib/localstorage";

const ProductPage: FC = () => {
  const router = useRouter();
  const id= router.query.id as string;
  const { cartItemCount, updateCartItemCount } = useCartItemCount();

  const [product, setProduct] = useState<Product | null>(null);

  const addCart = () => {
    if (!product) {
      return;
    }
    pushProduct(product)
    // 画面を更新するための処理
    updateCartItemCount();
  }


  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      console.log(id);
      const prod = await fetchProduct(id);
      setProduct(prod);
    })();
  },[id])

  return (
    <Layout cartItemCount={cartItemCount}>
      <div>
        {
          product ? (
            <div>
              <img src={product.imageUrl} />
              <h1> { product.name }</h1>
              <p> { product.price } 円</p>
              <p> { product.description }</p>
              <button onClick={addCart} > カートに追加 </button>
            </div>
          ) : (
           <p> Loading</p>
          )
        }
      </div>
    </Layout>
  );
};

export default ProductPage;
