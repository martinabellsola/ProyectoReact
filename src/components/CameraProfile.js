import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from "react-native";
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
            showModal: false,
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
                const ref = storage.ref(`photosProfile/${Date.now()}.jpg`) //no existe pero te lo crea 
                ref.put(image) //metodo put de firebase
                .then(()=> {
                    ref.getDownloadURL() 
                    .then((url)=> {
                        this.props.onImageUpload(url)
                           const user = auth.currentUser;

                            user.updateProfile({
                            photoURL: url
                            }).then(() => {
                           console.log('funciona!');
                             this.closeModal()
                            }).catch((error) => {
                            console.log('no funciona :(');
                            
                    });  
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
        this.props.Props.navigation.navigate("Home")
    }

    openModal(){
        this.setState({
          showModal: true
        }
    )}
      
    closeModal(){
        this.setState({
          showModal: false
        }
    )}
   
    render(){
        return (
            <> 
                {
                    this.state.showCamera === false ? 
                    <>
                     <View style={styles.menu}>

                        <TouchableOpacity onPress={()=> this.openModal()}>
                            <Icon size={16} name="arrow-left" solid/>
                        </TouchableOpacity>

                        { ! this.state.showModal ? 
                            null
                        :
                        <Modal 
                            style={styles.modalContainer}
                            visible={this.state.showModal}
                            animationType="fade"
                            transparent={true}
                        >
                            <View style={styles.modalView}> 
                            <View style={styles.modalInfo}> 
                                <Text style={{fontSize: 15, fontWeight: 600}}> ¿Descartar publicación? </Text>
                                <Text style={{fontSize: 15, fontWeight: 400, color:"#8e8e8e", marginTop: 12}}>Si sales, no se guardarán los cambios </Text>
                                <TouchableOpacity onPress={() => this.cancelar()}>
                                    <Text style={{fontSize: 15, fontWeight: 700, color: "#ed4956", marginTop: 18}}> Descartar </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.closeModal()}>
                                    <Text style={{fontSize: 15, fontWeight: 400, marginTop: 10}}> Cancelar </Text>
                                </TouchableOpacity>
                            </View>
                            </View>  
                        </Modal>
                        }
                            <Text style={{fontWeight:600, fontSize: 14}}> Actualizá tu foto de perfil! </Text>
                        <TouchableOpacity onPress={()=>this.savePhoto()}>
                            <Text style={{color:"#0095f6", fontWeight:400, fontSize: 14}}> Actualizar</Text>
                        </TouchableOpacity>
                     </View>
                     <Image 
                        style={{width: "100%", height:350}}
                        source = {{uri: this.state.photo}}
                     />
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22, 
        backgroundColor: 'pink'
      },
    menu: {
        display: "flex", 
        flexDirection: "row",
        justifyContent: "space-between", 
        marginBottom: 5,
        marginTop: 5, 
        marginLeft: 2, 
        marginRight: 2,
    },
    modalView: {
        backgroundColor: 'rgba(52, 52, 52, 0.70)',
        height: "100%", 
      },
    modalInfo: {
        margin: "auto",
        backgroundColor: "white",
        height: "129", 
        width: "80%",
        borderRadius: 12,
        padding: 35,
        alignItems: "center",
    },
});