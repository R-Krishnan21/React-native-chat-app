import React, { useState, useContext, useEffect } from 'react'
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, Image } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import {AuthContext} from '../components/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Chat = ({navigation, route}) => {
    const {user, logout} = useContext(AuthContext);
    const {recUid} = route.params;
    const [messages, setMessages] = useState([]);
    const [userData, setUserData] = useState(null);

    const getUser = () => {
        const currentUser =  firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((documentSnapshot) => {
        if( documentSnapshot.exists ) {
            console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data());
        }
        })
    }
    
    useEffect(() => {
        getUser()

        const docId = recUid > user.uid ? user.uid + "-" + recUid : recUid + "-" + user.uid

        const messageRef = firestore().collection('chatrooms')
        .doc(docId)
        .collection('messages')
        .orderBy('createdAt', 'desc')

        messageRef.onSnapshot((querySnap)=>{
            const allMsg = querySnap.docs.map(docSnap => {
                if(docSnap.data().createdAt){
                    return{
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt.toDate()
                    }
                }
            })
            setMessages(allMsg)
        })

    }, [])

    const onSend = (messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: recUid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))

        const docId = recUid > user.uid ? user.uid + "-" + recUid : recUid + "-" + user.uid

        firestore().collection('chatrooms')
        .doc(docId)
        .collection('messages')
        .add({...mymsg,createdAt: firestore.FieldValue.serverTimestamp()})
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons 
                        name="send-circle" 
                        style={{marginBottom: 5, marginRight: 5}}
                        size={42} 
                        color="#2e64e5"
                    />
                </View>
            </Send>
        )
    }

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right:{
                        backgroundColor: '#377DFF', 
                    }
                }}
                textStyle={{
                    right:{
                        color: "#fff"
                    }
                }}
            />
        )
    }

    const scrollToBottomComponent = () => {
        return (
            <FontAwesomeIcon name="angle-double-down" size={22} color="#333" />
        )
    }
    
    return (
        <View style={styles.container}>
        { userData && user.uid ?
            <>
                <View style={styles.header}>
                    <FontAwesomeIcon
                        name="long-arrow-left"
                        color="#377DFF"
                        size={30}
                        style={{marginLeft:10}}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={{fontSize: 20, marginLeft: 5, color:'#377DFF'}}>Back</Text>
                    <Text style={styles.heading}>{userData.name}</Text>
                    <View style={styles.headerIcon}>
                        <Image
                            style={{width: 50, height: 50, borderRadius: 50}}
                            source={{uri: userData ? userData.userImg : 'https://picsum.photos/200/300.jpg'}}
                            resizeMode={'cover'}
                        />
                        <FontAwesomeIcon
                            style={{position: 'absolute', right: -5}}
                            name="circle"
                            color={userData.online ? "green" : "red"}
                            size={20}
                        />
                    </View>
                </View>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user.uid,
                    }}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            </>
        : <></>}
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        width: '100%',
        marginBottom: 2,
        elevation:3,
        flexDirection: "row",
        marginTop: 5,
        paddingVertical: 10
    },
    img: {
        height: 50,
        width: 50,
        borderRadius: 50
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 70
    },
    headerIcon:{
        flexDirection: 'row',
        marginLeft: 110
    }
})
