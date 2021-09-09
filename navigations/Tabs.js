import React,{useContext} from 'react'
import { StyleSheet, Image, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CallList, ChatList} from "../screens/Index"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome"

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation}) => {
    React.useLayoutEffect(() => {

        navigation.setOptions({
            headerRight: () => (
            <FontAwesome5Icon
                onPress={() => navigation.navigate('Setting')}
                name="gear"
                size={30}
                color= "#377DFF"
                style={{marginRight: 10}}
                />
            ),
        });
    }, [navigation]);
    return (
        <>
            <Tab.Navigator>
                <Tab.Screen 
                    name="ChatList" 
                    component={ChatList}
                    options={{
                        tabBarActiveTintColor: "blue",
                        tabBarInactiveTintColor: "green",
                        tabBarStyle:{
                            marginHorizontal: 10,
                            marginTop: 10,
                            borderColor: "red",
                            borderRadius: 10
                        },
                        tabBarItemStyle:{
                            elevation: 6,
                            borderRadius:10,
                        }
                    }} 
                />
                <Tab.Screen 
                    name="CallList" 
                    component={CallList} 
                    options={{
                        tabBarActiveTintColor: "blue",
                        tabBarInactiveTintColor: "green",
                        tabBarStyle:{
                            marginHorizontal: 10,
                            marginTop: 10,
                            borderColor: "red",
                            borderRadius: 10
                        },
                        tabBarItemStyle:{
                            elevation: 6,
                            borderRadius:10,
                        }
                    }} 
                    
                />
            </Tab.Navigator>
        </>
    )
}

export default Tabs

const styles = StyleSheet.create({})
