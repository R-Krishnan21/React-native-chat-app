import React,{useContext, useEffect,useState} from 'react';
import { View, Image } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Setting, Logout,Call, Chat, Profile,EditAccount,CallList, ChatList} from "../screens/Index"
import Tabs from "../navigations/Tabs"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome"
import {AuthContext} from '../components/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();


const AppStack = () => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setUserData(documentSnapshot.data());
      }
    })
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen
          name="Home"
          component={Tabs}
          options={({ navigation, route }) => ({
            headerShown:true,
            headerStyle:{elevation: 0, height: 70},
            headerTitle: '',
            headerLeft: () => (
              userData ? 
                <>
                  <View style={{flexDirection:'row'}}>
                      <Image
                          style={{width: 60, height: 60, borderRadius: 50, margin: 10}}
                          source={{uri: userData.userImg ? userData.userImg : 'https://picsum.photos/200/300.jpg'}}
                          resizeMode={'cover'}
                      />
                      <FontAwesome5Icon
                          style={{position: 'absolute', right:7, top:7}}
                          name="circle"
                          color={userData.online ? "green" : "red"}
                          size={20}
                      />
                  </View>
                </> : <></>
            ),
          })}
      />
      <Stack.Screen
          name="Setting"
          component={Setting}
          options={{
            headerShown: false
          }}
      />
      <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle:{elevation: 0, backgroundColor:'#F0F0F0'},
            headerBackTitle: 'Back',
            headerBackTitleStyle: {color: '#377DFF', paddingLeft: 5, fontSize: 20},
            headerBackTitleVisible: true,
          }}
      />
      <Stack.Screen
          name="EditAccount"
          component={EditAccount}
      />
      <Stack.Screen
          name="Call"
          component={Call}
      />
      <Stack.Screen
          name="ChatList"
          component={ChatList}
      />
      <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: false
          }}
      />
      <Stack.Screen
          name="Logout"
          component={Logout}
      />
    </Stack.Navigator>
  )
};

export default AppStack;
