import React, {useState,useEffect, useContext} from 'react'
import { StyleSheet, Text, View, TextInput, Image, StatusBar,Alert } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Formik } from 'formik';
import * as yup from "yup";
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {AuthContext} from '../components/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const ReviewSchema = yup.object({
    name: yup.string().required()
})

const Profile = ({navigation}) => {
    const {user, logout} = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userData, setUserData] = useState(null);

    const getUser = async() => {
      const currentUser = await firestore()
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

    const uploadImage = async () => {
      if( image == null ) {
        return null;
      }
      const uploadUri = image;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
  
      // Add timestamp to File Name
      const extension = filename.split('.').pop(); 
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;
  
      setUploading(true);
      setTransferred(0);
  
      const storageRef = storage().ref(`photos/${filename}`);
      const task = storageRef.putFile(uploadUri);
  
      // Set transferred state
      task.on('state_changed', (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
  
        setTransferred(
          Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
            100,
        );
      });
  
      try {
        await task;
  
        const url = await storageRef.getDownloadURL();
  
        setUploading(false);
        setImage(null);
  
        Alert.alert(
          'Image uploaded!',
          'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
        );
        return url;
  
      } catch (e) {
        console.log(e);
        return null;
      }
  
    };

    useEffect(() => {
      getUser();
    }, []);
  

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 300,
          cropping: true,
          compressImageQuality: 0.7,
        }).then((image) => {
          console.log(image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          setImage(imageUri);
          this.bs.current.snapTo(1);
        });
      };
    
      const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          compressImageQuality: 0.7,
        }).then((image) => {
          console.log(image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          setImage(imageUri);
          this.bs.current.snapTo(1);
        });
      };

      renderInner = () => (
        <View style={styles.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
          </View>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => this.bs.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );

      renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>
      );

      bs = React.createRef();
      fall = new Animated.Value(1);

    return (
        <View styles={styles.container}>
          { userData ?
          <>
            <BottomSheet
                ref={this.bs}
                snapPoints={[330, -90]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}
            />
            <View style={{alignSelf: "center", marginTop: 10}}>
                <Image
                    style={styles.profileImg}
                    source={{uri: userData ? userData.userImg || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
                />
                <FontAwesome
                    style={styles.icon}
                    name="edit"
                    size={30}
                    onPress={() => this.bs.current.snapTo(0)}
                />
            </View>
            <View style={styles.list}>
                <View style={styles.data}>
                    <FontAwesome
                        name="calendar-times"
                        size={50}
                    />
                    <View style={{marginLeft: 25}}>
                        <Text style={{fontSize: 20}}>Joined On</Text>
                        <Text
                            style={{marginVertical: 5}}
                        >10/5/2020</Text>
                    </View>
                </View>
                <View>
                <Formik
                    initialValues={{ name: userData ? userData.name : ''}}
                    validationSchema={ReviewSchema}
                    onSubmit= {async (values)=>{
                      console.log(values.name)
                      let imgUrl = await uploadImage();

                      if( imgUrl == null && userData.userImg ) {
                        imgUrl = userData.userImg;
                      }
                  
                      firestore()
                      .collection('users')
                      .doc(user.uid)
                      .update({
                        name: values.name,
                        userImg: imgUrl,
                      })
                      .then(() => {
                        console.log('User Updated!');
                        Alert.alert(
                          'Profile Updated!',
                          'Your profile has been updated successfully.'
                        );
                      })

                      getUser()
                    }}
                >

                    {({ handleChange, handleBlur, handleSubmit, values,errors,touched }) => (
                        <View style={{paddingBottom: 90}}>
                            <View>
                                <Text>{touched.name && errors.name}</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('name')}
                                    value={values.name}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSubmit}
                            >
                                <View style={styles.btn}>
                                    <Text style={styles.txt}>Edit</Text>
                                </View>
                            </TouchableOpacity>   
                        </View>
                    )}

                    </Formik>
                </View>
            </View>
          </>
          : 
          <><View><Text>no</Text></View></>
          }
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    img:{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        height: 50,
        width: 50
    },
    icon:{
        position: 'absolute',
        bottom: 0,
        left: 120,
        color: "#377DFF"
    },
    profileImg:{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 75,
        height: 150,
        width: 150,

    },
    list:{
        paddingHorizontal: 10,
        marginTop: 30,
    },
    data:{
        flexDirection: 'row',
        borderColor: '#377DFF',
        borderWidth: 2,
        borderRadius: 10,
        padding: 5,
        paddingLeft: 20,
    },
    input: {
        marginBottom: 10,
        borderColor: '#377DFF',
        borderWidth: 2,
        borderRadius: 10,
        height: 65,
        fontSize: 30,
    },
    btn:{
        backgroundColor: "#377DFF",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    txt:{
        color: 'white',
        fontSize: 20
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      width: '100%',
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      paddingTop: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#2e64e5',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
})
