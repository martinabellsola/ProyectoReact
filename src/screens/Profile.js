import React, { Component } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList} from "react-native";
import { auth, db } from "../firebase/config";
import Card from '../components/Card'
class Profile extends Component{
    constructor(props) {
      super(props);
      this.state = {
        post: [],
        loading: true
      }
      console.log(auth.currentUser);
    }
    componentDidMount(){
      this.showPost();
    }
    showPost(){
      db.collection("posteos").where('user', '==', auth.currentUser.email).onSnapshot( docs => {
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
        }, ()=> console.log(this.state.post)
        )
      })
    }
    render() {
        return (
          <View>
            {(this.state.loading === true) ? <ActivityIndicator size="large" color="pink" /> :
            <>
            <Text> Nombre usuario: </Text>
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
             />   </> }
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
  textButton: {
    color: "#fff",
  },
});
export default Profile;