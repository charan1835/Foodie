import { gql, request } from "graphql-request";

// Use .env variable or fallback manually
const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Get all categories
const getCategory = async () => {
  const query = gql`
    query Category {
      categories {
        id
        name
        slug
        icon {
          url
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// Get all restaurants under a category
const getBusinessList = async (categorySlug) => {
  const query = gql`
    query GetRestaurants($slug: String!) {
      restaurants(where: { category_some: { slug: $slug } }) {
        id
        name
        slug
        workinghours
        types
        aboutUs
        address
        banner {
          url
        }
      }
    }
  `;
  const variables = { slug: categorySlug };
  const result = await request(MASTER_URL, query, variables);
  return result;
};

// Get full detail of a restaurant by slug
const GetBusinessdetail = async (businessSlug) => {
  const query = gql`
    query GetRestaurant($slug: String!) {
      restaurant(where: { slug: $slug }) {
        id
        name
        aboutUs
        address
        types
        workinghours
        slug
        banner {
          url
        }
        menu {
          ... on Menu {
            id
            catagory
            menuitems {
              ... on Menuitem {
                id
                name
                description
                price
                productimage {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { slug: businessSlug };
  const result = await request(MASTER_URL, query, variables);
  return result;
};

// ✅ Add to Cart with restaurant slug (NO restaurant name)
const addToCart = async ({
  email,
  productName,
  productDescription,
  productimg,
  price,
  phoneNumber,
}) => {
  const mutation = gql`
    mutation AddToCart(
      $email: String!
      $productName: String!
      $productDescription: String!
      $productimg: String!
      $price: Float!
      $phoneNumber: Int!
    ) {
      createUserCart(
        data: {
          email: $email
          productName: $productName
          productDescription: $productDescription
          productimg: $productimg
          price: $price
          phoneNumber: $phoneNumber
        }
      ) {
        id
      }
      publishManyUserCarts(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    email,
    productName,
    productDescription,
    productimg,
    price,
    phoneNumber: parseInt(phoneNumber?.replace(/\D/g, ""), 10) || 0,
  };

  return request(MASTER_URL, mutation, variables);
};

// ✅ Get User Cart by Email
const GetUserCart = async (email) => {
  const query = gql`
    query GetUserCart($email: String!) {
      userCarts(where: { email: $email }) {
        id
        price
        productDescription
        productimg
        productName
      }
    }
  `;
  const variables = { email };
  return request(MASTER_URL, query, variables);
};

// 🔥 DELETE CART ITEM - This was missing!
const deleteCartItem = async (id) => {
  const mutation = gql`
    mutation DeleteCartItem($id: ID!) {
      deleteUserCart(where: { id: $id }) {
        id
      }
      publishManyUserCarts(to: PUBLISHED) {
        count
      }
    }
  `;
  const variables = { id };
  return request(MASTER_URL, mutation, variables);
};

// 🔥 Export All (Added deleteCartItem)
export default {
  getCategory,
  getBusinessList,
  GetBusinessdetail,
  addToCart,
  GetUserCart,
  deleteCartItem, // ← Added this line
};