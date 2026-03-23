/**
 * App.tsx — Root component
 *
 * Wraps the entire app with:
 *   - Redux Provider (global state)
 *   - RootNavigator (auth gate + navigation)
 */
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
