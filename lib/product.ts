import { graphqlRequest } from "./graphqlClient";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

const listProductsQuery = `
  query listProducts {
    products {
      id
      name
      description
      price
      imageUrl
    }
  }
`;

export async function listProducts(): Promise<Product[]> {
  const data = await graphqlRequest({ query: listProductsQuery });
  return data.products;
}

const fetchProductQuery = `
  query getProduct($id: ID!) {
    product(id: $id) {
      name
      id
      description
      imageUrl
      price
    }
  }
`

export async function fetchProduct(id: string): Promise<Product> {
  const data = await graphqlRequest({
    query: fetchProductQuery,
    variables: {
      id
    }
  })
  return data.product;
}