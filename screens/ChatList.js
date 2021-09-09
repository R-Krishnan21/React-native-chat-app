import React, {useContext,useState,useEffect} from 'react'
import { StyleSheet, Text, View, Image,TouchableOpacity, FlatList } from 'react-native'
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome"
import {AuthContext} from '../components/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const ChatList = ({navigation}) => {
    const {user} = useContext(AuthContext);
    const [userList, setUserList] = useState(null)

    const getUser = async () => {
        const query = await firestore().collection('users').where("uid","!=",user.uid).get()
        const list = query.docs.map(doc => doc.data())
        console.log(list,user.uid)
        setUserList(list)
    }

    useEffect(() => {
        getUser()
    }, [])

    const renderItem = ({ item }) => (
        <View>
            <TouchableOpacity
                style={styles.itm}
                onPress={() => navigation.navigate('Chat',{recUid: item.uid})}
            >
                <View style={styles.listItem}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            style={{width: 60, height: 60, borderRadius: 50}}
                            source={{uri: item.userImg ? item.userImg : 'https://picsum.photos/200/300.jpg'}}
                            resizeMode={'cover'}
                        />
                        <FontAwesome5Icon
                            style={{position:'absolute',right: 0}}
                            name="circle"
                            color={item.online ? "green" : "red"}
                            size={20}
                        />
                    </View>
                    <Text style={styles.heading}>{item.name}</Text>
                    <FontAwesome5Icon
                        name="angle-right"
                        color="black"
                        size={20}
                        style={{marginRight: 0,marginTop:15}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {
                userList ?
                <View>
                    <FlatList
                        data={userList}
                        renderItem={renderItem}
                        keyExtractor={item => item.name}
                    />
                </View>
                : <></>
            } 
        </View>
    )
}

export default ChatList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 3,
        marginTop: 10,
    },
    itm:{
        borderRadius: 15,
        marginBottom: 8,
        borderBottomColor: "black",
        borderBottomWidth: 0.5,
    },
    listItem: {
        flexDirection: "row",
        height: 80,
        padding: 10,
        width: 200
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 30,
        top: 10,
        width: 220
    }
})
