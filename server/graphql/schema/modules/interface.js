import { ObjectId } from 'mongodb'
import { prepare, generateQuery } from '../../../query'
import { capitalize } from '../../../../utils'

export const typeDef = `
  
  interface Searchable{
    _id: ID!
    created: Date
    updated: Date
    owner: User
  }

  extend type Mutation {
    addItem(module:String!, payload:[updateInput]!):ModuleItem
    updateItem(module:String!, payload:[updateInput]!):ModuleItem
    deleteItem(module:String!, _id:String!): Boolean
    deleteItems(module:String!, _ids:[String]!): Boolean
  }

  input updateInput {
    kind:String
    value: Any
  }

  extend type Query {
    search(module:String!, ids:[String], keywords: keywordsInput, period: periodInput, range:rangeInput, pagination:paginationInput): Page
  }

  type Page {
    total: Int
    module: String
    items: [Searchable]
  }

  type ModuleItem {
    module: String
    item: Searchable
  }

`

export const resolvers = {
  Query: {
    search: async (root, args, { mongo, user }) => {
      const collection = mongo.collection(args.module)

      const { query, sortBy, page, rowsPerPage } = generateQuery(args)

      const total = await collection.find(query).count()
      const items = (await collection
        .find(query)
        .sort(sortBy)
        .skip(page > 0 ? (page - 1) * rowsPerPage : 0)
        .limit(rowsPerPage)
        .toArray()).map(prepare)

      return { total: total, module: args.module, items: items }
    }
  },
  Mutation: {
    addItem: async (root, args, { mongo, user }) => {
      if (user) {
        const collection = mongo.collection(args.module)
        const payload = args.payload
        const query = {
          owner: user._id,
          like: 0,
          created: new Date(),
          updated: new Date()
        }
        payload.forEach(obj => {
          query[obj.kind] = obj.value
        })
        const inserted = await collection.insertOne(query)
        const item = prepare(
          await collection.findOne({
            _id: inserted.insertedId
          })
        )
        return { module: args.module, item: item }
      } else throw new Error('User is not authenticated!')
    },
    updateItem: async (root, args, { mongo, user }) => {
      if (user) {
        const collection = mongo.collection(args.module)
        const payload = args.payload
        const query = { updated: new Date() }
        // Object.keys(payload).forEach(key => {
        //   if (key !== '_id') query[key] = payload[key]
        // })
        let _id = null
        payload.forEach(obj => {
          if (obj.kind === '_id') _id = obj.value
          else query[obj.kind] = obj.value
        })
        await collection.updateOne({ _id: ObjectId(_id) }, { $set: query })
        const item = prepare(
          await collection.findOne({
            _id: ObjectId(_id)
          })
        )
        return { module: args.module, item: item }
      } else throw new Error('Failed updatePost!')
    },
    deleteItem: async (root, args, { mongo, user }) => {
      if (user) {
        const collection = mongo.collection(args.module)
        await collection.deleteOne({ _id: ObjectId(args._id) })
        return true
      } else throw new Error('User is not authenticated!')
    },
    deleteItems: async (root, args, { mongo, user }) => {
      if (user) {
        const collection = mongo.collection(args.module)
        const conditions = []
        args._ids.forEach(_id => {
          conditions.push(ObjectId(_id))
        })
        console.log('conditions :', conditions)
        await collection.deleteMany({ _id: { $in: conditions } })
        return true
      } else throw new Error('User is not authenticated!')
    }
  },
  Searchable: {
    __resolveType(obj, ctx, info) {
      console.log(info.variableValues.module)
      return capitalize(info.variableValues.module, true)
    }
  }
}
