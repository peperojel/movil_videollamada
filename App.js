import React, { Component } from 'react';
// Desde v4 de react-navigation createStackNavigator se importa desde react-navigation-stack (requiere instalación)
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AsesoriasScreen from './src/views/asesorias/asesorias.js';
import Videollamada from './src/Videollamada.js';

import SocketConnection from './src/utils/socket';

const ws = new SocketConnection();

const RootStack = createStackNavigator(
  {
    asesoria:{
      screen: AsesoriasScreen,
      navigationOptions: {
        header: null,
      }
   },
    videollamada:{
      screen: Videollamada,
      navigationOptions:{
        title: 'videollamada',
      }
    }
  },
  {
    initialRouteName: 'asesoria',
  },{
    defaultNavigationOptions: {
      header: null
    },}
);
const AppContainer = createAppContainer(RootStack);
export default class App extends Component {
  render() {
    return <AppContainer screenProps={{socket: ws}}/>;
  }
}
