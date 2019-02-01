import { makeExecutableSchema } from 'graphql-tools'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import resolvers from './resolvers'

const typeDefs = `
    type User {
      email: String!
      accessToken: String
      posts: [Post] # the list of Posts by this author
    }
    type Post {
        author: User!
        title: String!
        slug: String
        content: String
    }
    type Query {
      posts: [Post],
      me: User  
    }
    type Mutation {
        addPost(
            title: String,
            slug: String,
            content: String
        ): Post
        signinUser(email: String!, password: String!): User
        createUser(email: String!, password: String!): User
    }
`

export default makeExecutableSchema({
  typeDefs,
  resolvers
})

const getUser = async (authorization, secrets, mongo) => {
  const bearerLength = 'Bearer '.length
  if (authorization && authorization.length > bearerLength) {
    const token = authorization.slice(bearerLength)
    const { ok, result } = await new Promise(resolve =>
      jwt.verify(token, secrets.JWT_SECRET, (err, result) => {
        if (err) {
          resolve({
            ok: false,
            result: err
          })
        } else {
          console.log('token verified!')
          resolve({
            ok: true,
            result
          })
        }
      })
    )

    if (ok) {
      const user = await mongo
        .collection('users')
        .findOne({ _id: ObjectId(result._id) })
      return user
    } else {
      console.error(result)
      return null
    }
  }

  return null
}

export async function context(headers, secrets, mongo) {
  // Optional: Export a function to get context from the request.
  const user = await getUser(headers.authorization, secrets, mongo)
  return { headers, secrets, mongo, user }
}
