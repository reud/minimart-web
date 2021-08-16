import { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import { Product } from "../lib/product";
import { Layout } from "../components/Layout";
import { deleteCart, fetchCart } from "../lib/localstorage";
import { useRouter } from "next/router";

interface cartInfo {
  product: Product;
  count: number;
}

const CartPage: FC = () => {
  const [cart, setCart] = useState<cartInfo[] | null>(null);
  const [sum,setSum] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const cart = fetchCart();
    if (!cart) {
      return;
    }

    const counter: {[name: string]: number} = {};
    const info: {[name: string]: Product} = {};
    cart.products.forEach((p) => {
      // キーが存在するならカウントを増やして次へ
      if(info[p.name]) {
        counter[p.name]++;
      } else {
        counter[p.name] = 1;
        info[p.name] = p;
      }
    })
    let calculatedCart: cartInfo[] = [];
    let tmpSum = 0;
    for (let [key,value] of Object.entries(info)) {
      const count = counter[key];
      calculatedCart.push({
        count,
        product: value,
      })
      tmpSum += count * value.price;
    }
    setSum(tmpSum);
    setCart(calculatedCart);
  }, []);

  return (
    <Layout>
      <p>合計金額は {sum}円</p>
      <ul className={styles.list}>
        {cart && cart.map((ci) => (
          <li key={ci.product.id} >
              <img  src={ci.product.imageUrl} alt={`${ci.product.imageUrl}の写真`} />
              <div>{ci.product.price}円</div>
              <div>{ci.product.name}</div>
              <div> {ci.count} 個</div>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        deleteCart();
        router.push("/");
      }} > 注文を決定する。 </button>
    </Layout>
  );
};

export default CartPage;
