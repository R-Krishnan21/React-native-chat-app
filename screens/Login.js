import React, {useState,useContext} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput
} from 'react-native';
import { AuthContext } from '../components/AuthProvider';

const Login = ({navigation}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {loginErr,login} = useContext(AuthContext)

  return (
      <View style={styles.container}>
        {
          loginErr ? 
          <View style={styles.errUi}>
            <Text style={styles.errUiTxt}>Not Authorised</Text>
          </View>:<View></View>
        }
        <View style={styles.header}>
          <Text style={styles.heading}>Login</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email."
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={()=> login(email,password)}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.forgot_button}>Create An Account</Text>
        </TouchableOpacity>
      </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    header:{
      marginBottom: 30
    },
    heading:{
      fontSize: 40
    },
    inputView: {
      marginBottom: 15,
      height: 50,
      alignItems: "center",
    },
   
    TextInput: {
      flex: 1,
      padding: 10,
      borderColor:'#377DFF',
      borderWidth: 2,
      borderRadius: 10,
      width: 270,
      height: 50
    },
   
    forgot_button: {
      marginTop: 10,
      textDecorationLine: "underline",
    },
   
    loginBtn: {
      width: 270,
      borderRadius: 10,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      backgroundColor: "#377DFF",
    },
    loginText: {
      color: "white",
      fontSize: 20
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
});
