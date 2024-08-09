// "use client"
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import rawImages from './features/images'
import cutouts from './features/cutouts'
import editor from './features/editor'
import processApi from './features/api'

export const makeStore = () => {

    let store = configureStore({
        reducer: {
            rawImages:rawImages.reducer,
            cutouts:cutouts.reducer,
            editor:editor.reducer,
            processApi: processApi.reducer,
        },
        middleware:(getDefaultMiddleware) =>{
            return getDefaultMiddleware({serializableCheck:false}).concat(processApi.middleware)
        }
    })

    setupListeners(store.dispatch)
    // window.store = store
    return store
}

export type Store = ReturnType<typeof makeStore>
export type State = ReturnType<Store["getState"]>