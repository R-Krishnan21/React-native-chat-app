import React, {useState, useContext} from 'react';
import {View,Text,TouchableOpacity,TextInput,StyleSheet} from 'react-native';
import { AuthContext } from '../components/AuthProvider';

const SignUp = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passErr, setPassErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)

    const {registerErr,register} = useContext(AuthContext)

    const handleRegister = () => {
      // if(email != ''){
      //   setEmailErr(false)
      //   if(password == confirmPassword){
      //     setPassErr(false)
      //     register(email,password)
      //   } else {
      //     setPassErr(true)
      //   }
      // } else {
      //   console.log('email err')
      //   setEmailErr(true)
      // }
      register(email,password)
    }
 
    return (
        <View style={styles.container}>
            {
              registerErr ? 
              <View style={styles.errUi}>
                  <Text style={styles.errUiTxt}>{registerErr}</Text>
              </View>:<View></View>
            }
            {
              passErr ? 
              <View style={styles.errUi}>
                  <Text style={styles.errUiTxt}>Password Donot Match</Text>
              </View>:<View></View>
            }
            {
              emailErr ? 
              <View style={styles.errUi}>
                  <Text style={styles.errUiTxt}>Add Email</Text>
              </View>:<View></View>
            }
            <View style={styles.header}>
                <Text style={styles.heading}>Sign Up</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Email."
                placeholderTextColor="#003f5c"
                underlineColorAndroid="transparent"
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

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Confirm Password."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.forgot_button}>Already have an account?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={()=> register(email,password)}>
              <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

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
    marginBottom: 10,
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
    height: 30,
    textDecorationLine: "underline"
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

export default SignUp;