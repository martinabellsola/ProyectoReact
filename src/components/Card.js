import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { db, auth, } from "../firebase/config";
import firebase from 'firebase';
class Post extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        likes: 0,
        liked: false,
        comments:[]
      }
    }  
    like(id){
        db.collection("posteos").doc(id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
      })  
    };
    dislike(id){
      db.collection("posteos").doc(id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
    })  
    };


    //hace falta cargar quien carajo hizo el like y quien el dislike
  
    render() {
      return (
        <View style={styles.formContainer}>
          <Text>Descripción: {this.props.post.description}</Text>
          <Text>Usuario: {this.props.post.username}</Text>
          <Text>Cantidad de likes: {this.props.post.likes.length}</Text>
          <Text>Usuarios que likearon: {this.props.post.likes}</Text>
          <TouchableOpacity style={styles.button} onPress={() => this.dislike(this.props.id)}> <Text style={styles.textButton}> Dislike </Text> </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.like(this.props.id)}> <Text style={styles.textButton}>Like</Text> </TouchableOpacity> 
        </View>
      );
    }    
       
  }
  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#28A745",
      paddingHorizontal: 10,
      paddingVertical: 6,
      textAlign: "center",
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#28A745",
    },
    textButton: {
      color: "#fff",
    },
    formContainer:{
      marginTop: 20,
      paddingVertical:15,
      paddingHorizontal: 10,
      borderWidth:1,
      borderColor: '#ccc',
      borderStyle: 'solid',
      borderRadius: 6,
      marginVertical:10,
  },
  });
export default Post