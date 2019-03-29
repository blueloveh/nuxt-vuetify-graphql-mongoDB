import registerStoreModule from '../store/common'

export default function({ store, app, req, route, params, env, redirect }) {
  console.log('params :', params)
  console.log('store :', store)
  console.log('route :', route)
  if (params && params.module) {
    const module = params.module
    console.log('loadStore > module :', module)
    store.commit('SET_AUTO_MODULE', module)

    const autoSchemas = env.autoSchemas
    autoSchemas.every(schema => {
      if (schema.name === module) {
        store.commit('SET_AUTO_SCHEMA', schema)
        return false
      }
      return true
    })

    console.log('store.registerModule :', store.registerModule)
    if (
      !store.registerModule ||
      store.registerModule === undefined ||
      store.registerModule === 'undefined'
    ) {
      console.log('undefined registerModule of store > oute.path', route.path)
      return redirect('/admin')
    }

    const autoSchema = store.getters.getAutoSchema(module)
    if (!(store && store.state && store.getters[module + '/gqlTypes'])) {
      store.registerModule(module, registerStoreModule(autoSchema), {
        preserveState: false
      })
    }
  }
}
