import { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import { Product } from "../lib/product";
import { Layout } from "../components/Layout";
import { deleteCart, fetchCart, updateProduct, useCartItemCount } from "../lib/localstorage";
import { useRouter } from "next/router";

interface productInCartInfoInterface {
  productTypes: Product;
  amount: number;
}


const CartPage: FC = () => {
  const [products,setProducts] = useState<{[name: string]: productInCartInfoInterface}>({});
  const [totalSpend,setTotalSpend] = useState<number>(0);

  const addAmount = (name: string):boolean => {
    console.log(products[name].amount);
    if(!products[name]) {
      return false;
    }
    const prod = {...products};
    prod[name].amount++;
    setTotalSpend(totalSpend + prod[name].productTypes.price)
    setProducts(prod);
    return true;
  }

  const saveToLocalStorage = () => {
    deleteCart();
    const productArray = [];
    for (let [_,value] of Object.entries(products)) {
      for (let i = 0; i < value.amount; i++) {
        productArray.push(value.productTypes);
      }
    }
    updateProduct(productArray);
    updateCartItemCount();
  }

  const delAmount = (name: string): boolean => {
    if(!products[name] || products[name].amount == 0) {
      return false;
    }
    const prod = {...products};
    prod[name].amount--;
    setTotalSpend(totalSpend - prod[name].productTypes.price)
    setProducts(prod);
    return true;
  }

  useEffect(() => {
    const cart = fetchCart();

    if (!cart) {
      return;
    }

    const counter: {[name: string]: number} = {};
    const info: {[name: string]: Product} = {};

    // ローカルストレージは商品を重複して持つのでカートページでカウンティング
    // fixme: ローカルストレージの持ち方を変えたい
    cart.products.forEach((p) => {
      // キーが存在するならカウントを増やして次へ
      if(info[p.name]) {
        counter[p.name]++;
      } else {
        counter[p.name] = 1;
        info[p.name] = p;
      }
    })

    let calculatedCart: productInCartInfoInterface[] = [];

    // 合計金額
    let tmpSum = 0;

    // 合計金額を生成しつつ欲しいデータにまとめる
    for (let [key,value] of Object.entries(info)) {
      const count = counter[key];
      calculatedCart.push({
        amount: count,
        productTypes: value,
      })
      tmpSum += count * value.price;
    }

    const pdts:{[name: string]: productInCartInfoInterface} = {};
    calculatedCart.map((product) => {
      pdts[product.productTypes.name] = product;
    })
    setProducts(pdts);
    setTotalSpend(tmpSum);
  },[])

  const { cartItemCount, updateCartItemCount } = useCartItemCount();
  const router = useRouter();

  return (
    <Layout cartItemCount={ cartItemCount }>
      <ul className={styles.list}>
        {products && Object.keys(products).map((key) => (
          <li key={products[key].productTypes.id} >
              <img  src={products[key].productTypes.imageUrl} alt={`${products[key].productTypes.imageUrl}の写真`} />
              <div>{products[key].productTypes.price}円</div>
              <div>{products[key].productTypes.name}</div>
              <div> {products[key].amount} 個</div>
              <button onClick={() => {
                delAmount(products[key].productTypes.name);
                saveToLocalStorage();
              }}> - </button>
            <button onClick={() => {
              addAmount(products[key].productTypes.name);
              saveToLocalStorage();
            }}> + </button>
          </li>
        ))}
      </ul>
      <p>合計金額は {totalSpend}円</p>
      <button onClick={() => {
        deleteCart();
        window.alert("注文しました")
        router.push("/");
      }} > 注文を決定する。 </button>
    </Layout>
  );
};

export default CartPage;
