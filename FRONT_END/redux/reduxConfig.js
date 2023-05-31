import { combineReducers, configureStore, createReducer, createSelector} from "@reduxjs/toolkit";
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { createSlice } from "@reduxjs/toolkit";
import { compareProducts } from "../helper/comparator";
import { loadState } from "./localStorage";

export const LA_LISTA = "laLista";

const initialState = { lista: [] };

export const laListaSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        añadirProductoALaLista: (state, action) => {
            var isProductInLaLista = -1;
            var counter = 0;
            state.lista.forEach(item => {
                if (compareProducts(action.payload.producto, item.producto))
                    isProductInLaLista = counter;
                counter++;
            });
            if (isProductInLaLista >= 0) {
                if (state.lista[isProductInLaLista].unidades < 100) {
                    state.lista[isProductInLaLista].unidades++;
                    console.log("Añadir +1 unidad al producto")
                }
            }
            else {
                state.lista.push(action.payload); 
                console.log("Nuevo producto.")
            }
        },
        borrarProductoDeLaLista: (state, action) => {
            const isProductInLaLista = state.lista.map((item => { return item.producto.barcode }))
                .indexOf(action.payload.producto.barcode);
            if (isProductInLaLista >= 0) {
                state.lista[isProductInLaLista].unidades--;
                if(state.lista[isProductInLaLista].unidades === 0) {
                    state.lista.splice(isProductInLaLista,1);
                }
            }
        },
        vaciarLaLista: (state) => {
            state.lista = [];
        }, 
        cargarLaLista: (state, action) => {
            state.lista = action.payload;
        },
        mejorarAlternativa: (state, action) => {
            var isProductInLaLista = -1;
            var isAlternativaInLaLista = -1;
            var counter = 0;
            console.log(action.payload);
            var porcentajeDeMejora =
                (action.payload.productoAMejorar.precioActual - action.payload.alternativa.precioActual) /
                action.payload.productoAMejorar.precioActual;
            state.lista.forEach(item => {
                if (compareProducts(action.payload.alternativa, item.producto)) 
                    isAlternativaInLaLista = counter;                    
                if (compareProducts(action.payload.productoAMejorar, item.producto)) 
                    isProductInLaLista = counter;
                counter++;
            });
            if (isProductInLaLista >= 0 && isAlternativaInLaLista == -1) {
                state.lista[isProductInLaLista] =
                {
                    producto: action.payload.alternativa,
                    unidades: state.lista[isProductInLaLista].unidades,
                    mejora: porcentajeDeMejora
                }
            } else if (isProductInLaLista >= 0 && isAlternativaInLaLista > -1) {
                if (isProductInLaLista != isAlternativaInLaLista) {
                    state.lista[isAlternativaInLaLista] =
                    {
                        producto: action.payload.alternativa,
                        unidades: state.lista[isProductInLaLista].unidades + state.lista[isAlternativaInLaLista].unidades,
                        mejora: porcentajeDeMejora
                    }
                    state.lista.splice(isProductInLaLista, 1);
                }
            }
        }
    }
});

const persistConfig = {
    key: LA_LISTA,
    blacklist: ['product'],
    storage
};

export const productSlice = createSlice({
    name: "products",
    initialState, 
    reducers: {
        cargarProductos: (state, action) => {
            state.lista = action.payload;
        }
    }
});

const reducers = combineReducers({
    laListaReducer: laListaSlice.reducer,
    producto: productSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, reducers); 

const persistedState = loadState();

export const store = configureStore({  //create Store abstraction
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
    preloadedState: persistedState
});


export const {cargarProductos} = productSlice.actions;
export const { añadirProductoALaLista, borrarProductoDeLaLista, vaciarLaLista, cargarLaLista, mejorarAlternativa } = laListaSlice.actions;
