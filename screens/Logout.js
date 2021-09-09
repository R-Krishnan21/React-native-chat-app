import React, {useEffect,useContext} from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { AuthContext } from '../components/AuthProvider';


const Logout = ({navigation}) => {
    const {logoutErr,logout} = useContext(AuthContext)

    useEffect(() => {
        logout()
    }, [])
    return (
        <View>
            {
                logoutErr ? 
                <View style={styles.errUi}>
                    <Text style={styles.errUiTxt}>Not Authorised</Text>
                </View>:<View></View>
            }
            <ActivityIndicator size={50} color="red" style={styles.loader}/>
        </View>
    )
}

export default Logout

const styles = StyleSheet.create({
    loader:{
        flex: 1,
        justifyContent: "center",
        top: 200
    },
    errUi:{
        backgroundColor: "red",
        borderRadius: 10,
        padding: 20
      },
      errUiTxt:{
        fontSize: 20,
        color: "white"
      }
})
