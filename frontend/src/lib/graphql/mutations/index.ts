import { gql } from 'graphql-request'
export const mutations = {
  login: gql`
    mutation Login($data: LoginInput!) {
      login(data: $data) {
        token
      }
    }
  `,
  register: gql`
    mutation Register($data: RegisterInput!) {
      register(data: $data) {
        token
      }
    }
  `,
  profile: gql`
    mutation Profile($data: ProfileInput!) {
      updateProfile(data: $data) {
        id
      }
    }
  `,
  createCategory: gql`
    mutation CreateCategory($data: CategoryInput!) {
      createCategory(data: $data) {
        id
      }
    }
  `,
  updateCategory: gql`
    mutation UpdateCategory($id: ID!, $data: CategoryInput!) {
      updateCategory(id: $id, data: $data) {
        id
      }
    }
  `,
  deleteCategory: gql`
    mutation DeleteCategory($id: ID!) {
      deleteCategory(id: $id)
    }
  `,
  createTransaction: gql`
    mutation CreateTransaction($data: TransactionInput!) {
      createTransaction(data: $data) {
        id
      }
    }
  `,
  updateTransaction: gql`
    mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {
      updateTransaction(id: $id, data: $data) {
        id
      }
    }
  `,
  deleteTransaction: gql`
    mutation DeleteTransaction($id: ID!) {
      deleteTransaction(id: $id)
    }
  `,
}
