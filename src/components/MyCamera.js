import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';

class myCamera extends Component {
    constructor(props){
        super(props); 
        this.state = {
            permission: false, 
            photo: "",
            showCamera: true, 
        }
        this.camera;
    }
    
    componentDidMount(){
        Camera.requestCameraPermissionsAsync()
        .then(()=>{
            this.setState({
                permission: true
            })
        })
        .catch((err)=> console.log(err))

        Camera.getAvailableCameraTypesAsync()
        .then((res)=> console.log(res))
    }

    takePicture(){
        this.camera
            .takePictureAsync()
                .then((photo)=>{
                    this.setState({
                        photo: photo.uri,
                        showCamera: false
                    })
                })
                .catch((err)=> console.log(err))
    }

    savePhoto(){
        fetch(this.state.photo)
        .then((res)=> res.blob())
            .then((image)=> {
                const ref = storage.ref(`photos/${Date.now()}.jpg`) //no existe pero te lo crea 
                ref.put(image) //metodo put de firebase
                .then(()=> {
                    ref.getDownloadURL() 
                    .then((url)=> {
                        this.props.onImageUpload(url)
                        this.setState({
                            photo: ""
                        })
                    })
                })
            }) 
            
        .catch(err => console.log(err))
        
    }
   
    cancelar(){
        this.setState({
            permission: false, 
            photo: "", 
            showCamera: true,
        })
        this.props.drawerProps.navigation.navigate("Home")
    }
   
    render(){
        return (
            <> 
                {
                    this.state.showCamera === false ? 
                    <>
                     <Image 
                        style={{width: "100%"}}
                        source = {{uri: this.state.photo}}
                     />
                     <View style={styles.menu}>
                        <TouchableOpacity onPress={()=> this.cancelar()}>
                            <Icon size={25} name="arrow-left" solid/>
                        </TouchableOpacity>
                            <Icon size={25} name="magic" solid/>
                        <TouchableOpacity onPress={()=>this.savePhoto()}>
                            <Icon size={25} style={{color:"blue"}} name="arrow-right" solid/>
                        </TouchableOpacity>
                     </View>
                    </>
                : 
                    <>
                    <Camera 
                        style={{flex: 3, width:"100%", position: "absolute", height:"100%"}}
                        type={Camera.Constants.Type.front}
                        ref={(cam)=> (this.camera = cam)}
                    /> 
                    <TouchableOpacity  style={{flex: 1, width:"100%"}} onPress={()=> this.takePicture()}>    
                        <Icon size={50} style={{color:"white", position: "relative", marginHorizontal:"auto", marginVertical:"120%"}} name="circle" solid/>
                    </TouchableOpacity>
                    </>
                }
                
            </>
        )
    }
}

export default myCamera

const styles = StyleSheet.create({
    menu: {
        display: "flex", 
        flexDirection: "row",
        justifyContent: "space-between", 
        marginBottom: 5,
    },
});