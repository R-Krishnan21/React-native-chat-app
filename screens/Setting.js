import React, {useContext} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Platform, StatusBar} from "react-native";
import { FONTS, COLORS,icons} from "../constants";
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const DATA = [
    {
        id: 1,
        title: 'Profile',
        iconName: 'account',
    },
    {
        id: 2,
        title: 'Bookmark',
        iconName: 'bookmark-multiple',
    },
    {
        id: 3,
        title: 'Account',
        iconName: 'account-cog',
    },
    {
        id: 4,
        title: 'Logout',
        iconName: 'logout',
    },

];

const Setting = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 35,
                        width: 35,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: COLORS.lightGray,
                        backgroundColor: COLORS.transparentBlack5,
                        marginLeft: 10,
                        marginTop: 10
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        style={{
                            width: 15,
                            height: 15,
                            tintColor: COLORS.lightGray
                        }}
                    />
                </TouchableOpacity>
                <FeatherIcon
                    name="settings"
                    style={{marginLeft:110, marginTop: 5}}
                    color="black"
                    size={40}
                />
            </View>
            <View style={styles.heading}>
                <Text style={styles.textHeading}>Settings</Text>
            </View>
            <View style={styles.list}>
                <FlatList
                    data={DATA}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item})=>{
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(item.title)}
                            >
                            <View style={styles.listItem}>
                                <View style={styles.main}>
                                    <MaterialCommunityIcon 
                                        name={item.iconName} 
                                        size={29} 
                                        color="black" 
                                    />
                                    <Text style={styles.mainText}>{item.title}</Text>
                                </View>
                                <MaterialCommunityIcon
                                    name="chevron-right" 
                                    size={24} 
                                    color="black" 
                                />
                            </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: COLORS.white
    },
    header:{
        flex: 1,
        flexDirection: "row",
    },
    heading:{
        flex: 1,
        // borderColor: "red",
        // borderStyle: 'solid',
        // borderWidth: 3,
    },
    textHeading:{
        ...FONTS.body1,
        marginLeft: 10
    },
    list:{
        flex: 7,
        marginTop: 20,
        padding: 10
    },
    main:{
        flexDirection: 'row',
    },
    mainText:{
        marginLeft: 20,
        ...FONTS.h3
    },
    listItem:{
        flexDirection: "row",
        justifyContent:"space-between",
        backgroundColor: COLORS.gray2,
        marginBottom: 13,
        padding: 20,
        ...Platform.select({

            ios: {
      
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
      
            },
      
            android: {
      
                elevation: 5,
      
            },
      
          }),
    }
})
