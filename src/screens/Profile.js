import React, { Component } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image} from "react-native";
import { auth, db } from "../firebase/config";
import Card from '../components/Card'

class Profile extends Component{
    
  constructor(props) {
      super(props);
      this.state = {
        post: [],
        loading: true,
        showModal: false
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
    
    render() {
        return (
          <View>
            { this.state.loading === true ? 
                <ActivityIndicator size="large" color="pink" /> 
              :
              <View>
                <View style={styles.containerData}>
                  <Image 
                    style={{width: 77, height: 77, borderRadius:"50%"}}
                    source = {require("../../assets/user.png")}
                  />
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 600}}> {auth.currentUser.displayName} </Text>
                    <TouchableOpacity
                    style={styles.buttonProfilePicture}
                    onPress={() => this.props.openModal()}
                    >
                      <Text style={{fontWeight: 600,}}> Editar foto de perfil </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text> Email usuario: {auth.currentUser.email} </Text>
                <Text> Fecha de creación: {auth.currentUser.metadata.creationTime} </Text>
                <Text> Última sesión: {auth.currentUser.metadata.lastSignInTime} </Text>
                <Text> Cantidad de posteos realizados: {this.state.post.length} </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.props.signOut()}
                >
                  <Text style={styles.textButton}> Cerrar sesión </Text>
                </TouchableOpacity>
                <FlatList
                  data={this.state.post}
                  keyExtractor={(post) => post.id.toString()}
                  renderItem={({item}) => (
                    <Card post={item.data} id={item.id} photo={item.photo} />
                  )}
                />   
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
    justifyContent: "space-between", 
    marginBottom: 5,
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
  },
  textButton: {
    color: "#fff",
  },
});
export default Profile;