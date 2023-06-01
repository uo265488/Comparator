import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './routes/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductRegistry from './routes/ProductRegistry';
import { Provider } from 'react-redux';
import { store } from './redux/reduxConfig';
import Catalogo from './routes/Catalogo';
import LaLista from './routes/LaLista';
import throttle from 'lodash.throttle';
import { saveState } from './redux/localStorage';
import { NavigationBar } from './components/NavigationBar';
import DashboardContent from './routes/Dashboard';

export default function App() {

  {/*store.subscribe(throttle(() => {
    saveState({
      laLista: store.getState()
    });
  }, 1000));*/}

  store.subscribe(() => {
    saveState(store.getState());
  });
  
  return (
    <View style={styles.container}>
      <Provider store={store}>
        <BrowserRouter>
          <NavigationBar/>
        <Routes>
            <Route path="/" element={<Home />} ></Route>
            <Route path="scanner" element={<ProductRegistry></ProductRegistry>}> </Route>
            <Route path="productos" element={<Catalogo></Catalogo>}></Route>
            <Route path="la Lista de la compra" element={<LaLista></LaLista>}></Route>
            <Route path="estadisticas" element={<DashboardContent></DashboardContent>}></Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
