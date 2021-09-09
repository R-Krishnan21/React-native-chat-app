import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loginErr, setloginErr] = useState(null)
  const [registerErr, setRegisterErr] = useState(null)
  const [logoutErr, setLogoutErr] = useState(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginErr,
        registerErr,
        logoutErr,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password)
            .then(()=>{
              setloginErr(null)
            })
            .catch((e)=>{
              setloginErr(e)
              console.log(e)
            })
          } catch (e) {
            setloginErr(e)
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
              setRegisterErr(null)
              //save in firestore
              firestore().collection('users').doc(auth().currentUser.uid)
              .set({
                  name: '',
                  email: email,
                  createdAt: firestore.Timestamp.fromDate(new Date()),
                  online: true,
                  userImg: null,
                  uid: auth().currentUser.uid
              })
              .catch(e => {
                setRegisterErr(e)
                  console.log('Something went wrong with added user to firestore: ', e);
              })
            })
            .catch(e => {
              setRegisterErr(e)
              console.log('Something went wrong with sign up: ', e);
            });
          } catch (e) {
            setRegisterErr(e)
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut()
              .then(()=>{
                setLogoutErr(null)
                setRegisterErr(null)
                setloginErr(null)
              })
              .catch((e)=>{
                setLogoutErr(e)
              })
          } catch (e) {
            setLogoutErr(e)
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};