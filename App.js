import React from 'react';
import {Provider} from 'react-redux';
import Authentication from './src/components/Authentication';
import { PersistGate } from 'redux-persist/es/integration/react';
import {store,persistor} from './src/store';
import { Font } from 'expo';


export default class App extends React.Component {

  
  
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Authentication />
        </PersistGate>
      </Provider>
    );
  }
}

