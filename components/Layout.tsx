import { FC } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "./Layout.module.css";
import { Cart } from "../lib/localstorage";

type Props = {
  cart: Cart,
};

export const Layout: FC<Props> = ( props ) => {
  const cartInfo = props.cart || {products: []};

  return (
    <div>
      <Head>
        <title>Mini Mart</title>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <Link href="/">Mini Mart</Link>
        </h1>
        <div className={styles.cart}>
          {/* このリンク先はないので新規ページを作る */}
          <Link href="/cart">
            <a>
              <span>🛒</span>
              <span className={styles.cartCount}>( { cartInfo.products.length } )</span>
            </a>
          </Link>
        </div>
      </header>
      <main>{props.children}</main>
    </div>
  );
};
