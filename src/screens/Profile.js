import React, { Component } from "react";
import { Text, View, TextInput, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image} from "react-native";
import { auth, db } from "../firebase/config";
import Icon from 'react-native-vector-icons/FontAwesome5';
import CardProfile from "../components/CardProfile"

class Profile extends Component{
    
  constructor(props) {
      super(props);
      this.state = {
        post: [],
        loading: true,
        showModal: false, 
        showModalPhoto: false
      }
    }

    componentDidMount(){
      this.showPost();
    }
    
    showPost(){
      db.collection("posteos").where('mail', '==', auth.currentUser.email).onSnapshot( docs => {
        let post = []
        docs.forEach((doc) => {
          post.push({
            data: doc.data(),
            id: doc.id,
          })
        })
        this.setState({
          post: post,
          loading: false,
        })
      })
    }

    openModal() {
      this.setState({
        showModal: true
      })
    }

    closeModal() {
      this.setState({
        showModal: false
      })
    }
     
    render() {
        return (
          <View style={{backgroundColor: "#fcfafa"}}>
            { this.state.loading === true ? 
                <ActivityIndicator size="large" color="pink" /> 
              :
              <View  style={{marginTop: 10}} >
                <View style={styles.containerData}>
                  <Image 
                    style={{width: 77, height: 77, borderRadius:"50%", marginTop: 5}}
                    source = {require("../../assets/user.png")}
                  />
                  <View>
                    <View style={styles.nameLog}>
                      <Text style={{fontSize: 16, fontWeight: 600}}> {auth.currentUser.displayName} </Text>
                      <TouchableOpacity
                        onPress={() => this.props.signOut()}
                      >
                        <Icon style={{marginLeft: 10}} size={20} name="sign-out-alt" />
                      </TouchableOpacity> 
                    </View>
                    <TouchableOpacity
                      style={styles.buttonProfilePicture}
                      onPress={() => this.openModal()}
                      >
                        <Text style={{fontWeight: 600,}}> Editar foto de perfil </Text>
                    </TouchableOpacity>                      
                  </View>
                </View>

                { ! this.state.showModal ? 
                  null
                :
                <Modal 
                  style={styles.modalContainer}
                  visible={this.state.showModal}
                  animationType="fade"
                  transparent={true}
                >
                  <Text>Fotito perfil</Text>
                </Modal>
                }

                <Text  style={{marginLeft: 10, color: "#8e8e8e", marginRight: 10, textAlign: "center"}}>————————————————————</Text>
                <View style={{marginLeft: 18}} >
                  <View style={styles.descrip}>
                    <Text style={{fontWeight:600, color: "#262626"}}>Contacto:</Text>   
                    <Text>{auth.currentUser.email} </Text>   
                  </View>
                  <View style={styles.descrip}>
                    <Text style={{fontWeight:600, color: "#262626"}}>Fecha de creación:</Text>   
                    <Text>{auth.currentUser.metadata.creationTime} </Text>   
                  </View>
                  <View style={styles.descrip}>
                    <Text style={{fontWeight:600, color: "#262626"}}>Última sesión:</Text>   
                    <Text>{auth.currentUser.metadata.lastSignInTime}</Text>   
                  </View>
                  <View style={styles.descrip}>
                    <Text style={{fontWeight:600, color: "#262626"}}>Publicaciones:</Text>   
                    <Text>{this.state.post.length}  </Text>   
                  </View>
                </View>
                <Text  style={{marginLeft: 10, color: "#8e8e8e", marginRight: 10, textAlign: "center"}}>————————————————————</Text>
                <FlatList
                  data={this.state.post}
                  keyExtractor={(post) => post.id.toString()}
                  renderItem={({item}) => (
                    <CardProfile post={item.data} photo={item.data.photo} />
                  )}
                />   
                { this.state.showModalPhoto ? 
                      false
                    :
                      <Modal 
                        style={styles.modalContainer}
                        visible={this.state.showModal}
                        animationType="fade"
                        transparent={true}
                      >
                        <View style={styles.modalView}> 
                          <View style={styles.modalInfo}> 
                            <View style={styles.menuLike}>
                              <Text style={{fontSize: 16, fontWeight: 600}}> Me gusta</Text>
                              <TouchableOpacity style={{marginLeft: 100}} onPress={() => this.closeModal()}>
                                <Icon size={20} name="times" />
                              </TouchableOpacity>
                            </View>
                            <Text>——————————————</Text>
                          </View>
                        </View>  
                      </Modal>
                    }
             </View> }
          </View>
        );
      }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "red",
  },
  containerData:{
    display: "flex", 
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-evenly",
  },
  nameLog: {
    alignItems: "center",
    display: "flex", 
    flexDirection: "row",
    marginTop: 15,
  },
  buttonProfilePicture:{
    backgroundColor: "transparent",
    paddingHorizontal: 9,
    paddingVertical: 5,
    textAlign: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dbdbdb",
    marginTop: 10
  },
  textButton: {
    color: "#fff",
  },
  descrip: {
    display: "flex", 
    flexDirection: "coloumn",
    marginTop: 5, 
  },
});
export default Profile;