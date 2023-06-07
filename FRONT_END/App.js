import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './redux/reduxConfig';
import { Provider } from 'react-redux';
import { NavigationBar } from './components/NavigationBar';
import Home from './routes/Home';
import ProductRegistry  from './routes/ProductRegistry';
import Catalogo from './routes/Catalogo';
import LaLista from './routes/LaLista';
import DashboardContent from './routes/Dashboard';
import { saveState } from './redux/localStorage';


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
