/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import {store} from './src/store';

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // /*
  //  * To keep the template simple and small we're adding padding to prevent view
  //  * from rendering under the System UI.
  //  * For bigger apps the recommendation is to use `react-native-safe-area-context`:
  //  * https://github.com/AppAndFlow/react-native-safe-area-context
  //  *
  //  * You can read more about it here:
  //  * https://github.com/react-native-community/discussions-and-proposals/discussions/827
  //  */
  // const safePadding = '5%';

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
