import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { isDevelop } from '@/libs/configs'
import core from './core/core.reducer'
import auth from './auth/auth.reducer'
import record from './record/record.reducer'

const reducer = combineReducers({
  core,
  auth,
  record
})

const setMiddleware = () => {
  const StoreEnhancer = applyMiddleware()
  return isDevelop ? composeWithDevTools(StoreEnhancer) : StoreEnhancer
}

const createReduxStore = createStore(reducer, setMiddleware())

export default createReduxStore
export type StoreTypes = ReturnType<typeof reducer>
export const { dispatch } = createReduxStore
export { useDispatch, useSelector } from 'react-redux'
export { default as authActions } from './auth/auth.actions'
export { default as authSelector } from './auth/auth.selectors'
export { default as coreActions } from './core/core.actions'
export { default as coreSelector } from './core/core.selectors'
export { default as recordActions } from './record/record.actions'
export { default as recordSelector } from './record/record.selectors'
