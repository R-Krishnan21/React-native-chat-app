import React, {createContext, useContext,useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [allUser, setAllUser] = useState(null)
    const [chatId, setChatId] = useState(null)

    return (
        <ChatContext.Provider
            value={{
                chatId,
                setChatId,
                getUser : async () => {
                    const query = await firestore().collection('users').get()
                    const list = query.docs.map(doc => doc.data())
                    setAllUser(list)
                }
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};