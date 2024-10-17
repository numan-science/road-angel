import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store";
import Theme from "@/components/template/Theme";
import Layout from '@/components/layout'
import history from "./history";
import "./locales";

const persistor = persistStore(store);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter history={history}>
          <Theme>
            <Layout />
          </Theme>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;