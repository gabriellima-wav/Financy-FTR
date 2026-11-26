import { gql } from 'graphql-request'
export const workspace = gql`
  fragment CategoryFields on Category {
    id
    title
    description
    color
    icon
  }
  query Workspace {
    me {
      id
      name
      email
    }
    listCategories {
      ...CategoryFields
    }
    listTransactions {
      id
      description
      date
      type
      amountCents
      category {
        ...CategoryFields
      }
    }
  }
`
