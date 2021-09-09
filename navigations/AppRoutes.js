import React, {useContext, useState, useEffect} from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../components/AuthProvider';
import AppStack from "./AppStack"
import AuthStack from './AuthStack';
import {ChatProvider} from '../components/ChatProvider'

const Stack = createStackNavigator();

const AppRoutes = ()  => {

  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };
 
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
 
  if (initializing) return null;

//   const [isLogin, setIsLogin] = useState(true)

  return (
    <NavigationContainer>
      {user ? 
          <AppStack /> : 
        <AuthStack />
      }
    </NavigationContainer>
  );
};

export default AppRoutes;