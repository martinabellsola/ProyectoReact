import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';
import { Camera } from 'expo-camera'

class myCamera extends Component {
    constructor(props){
        super(props); 
        this.state = {
            permission: false, 
            photo: "",
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
   

    takePicture(){
        this.camera
            .takePictureAsync()
                .then((photo)=>{
                    this.setState({
                        photo: photo.uri,
                    })
                })
                .catch((err)=> console.log(err))
    }
    render(){
        return (
            <> 
                {this.state.photo ? 
                    <>
                     <Image 
                        style={{width: "100%"}}
                        source = {{uri:this.state.photo}}
                     />
                     <View>
                         <TouchableOpacity onPress={()=>this.savePhoto()}>
                             <Text> Aceptar </Text>
                         </TouchableOpacity>
                         <TouchableOpacity>
                             <Text> Cancelar </Text>
                         </TouchableOpacity>
                     </View>
                    </>
                : 
                    <>
                    <Camera 
                        style={{flex: 2, width:"100%"}}
                        type={Camera.Constants.Type.front}
                        ref={(cam)=> (this.camera = cam)}
                    /> 
                    
                    <TouchableOpacity  style={{flex: 1, width:"100%"}} onPress={()=> this.takePicture()}>    
                        <Text>Shoot</Text>
                    </TouchableOpacity>
                    </>
                }
                 
                
            </>
        )
    }
}

export default myCamera