import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from "react-native";
import { db, auth, } from "../firebase/config";
import firebase from 'firebase';
import Comments from '../components/Comments'


class ProfileCard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        likes: 0,
        liked: false,
        comments:[],
        showModal: false,
        modalText:'Ver comentarios'
      }
    }  
    
    componentDidMount(){
      this.recieveLikes();
    }

    recieveLikes(){
      let likes = this.props.post.likes;

      if(likes) {
        this.setState({
          likes: likes.length
        })
      }

      if(likes.includes(auth.currentUser.email + ", ")){
        this.setState({
          liked:true
        })
      }
    }
    
    like(id){
      db.collection("posteos").doc(id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email + ", ")
      }).then(()=>{
        this.setState({
        liked: true,
        likes: this.state.likes + 1, 
      })})
      .catch((err)=> {
        console.log(err)
      })
      
    };

    dislike(id){
      db.collection("posteos").doc(id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email + ", ")
      }).then(()=>{
        this.setState({
        liked: false,
        likes: this.state.likes - 1, 
      })})
      .catch((err)=> {
        console.log(err)
      })  
      
    };

   comment(com){
     console.log(com)
    let comentario = {text: com, user: auth.currentUser, date: Date.now()}
    db.collection("posteos").doc(this.props.id).update({
      comment: firebase.firestore.FieldValue.arrayUnion(comentario)
    }).then(()=>{
      this.setState({
       comments: this.state.comments.push(comentario)
      })})
      .catch((err)=> {
        console.log(err)
      })  
   
  }
    render() {
      return (
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={()=> borrarPost()}>
           <Text>Borrar</Text>
          </TouchableOpacity>
          <Image style={styles.photo} source={{uri:this.props.post.photo}}/>
          <Text>Descripción: {this.props.post.description}</Text>
          <Text>Usuario: {this.props.post.username}</Text>
          <Text>Cantidad de likes: {this.props.post.likes.length}</Text>
          <Text>Usuarios que likearon: {this.props.post.likes}</Text>
          {
            ! (this.state.liked) ?  
              (<TouchableOpacity style={styles.button} onPress={() => this.like(this.props.id)}> 
                <Text style={styles.textButton}>Like</Text> 
              </TouchableOpacity>) 
            : 
              (<TouchableOpacity style={styles.button} onPress={() => this.dislike(this.props.id)}> 
                <Text style={styles.textButton}> Dislike </Text> 
              </TouchableOpacity>)
          }
          <Comments comentar= {(com)=>this.comment(com)}/>
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
    photo:{
      height: 200,
    }
  });

export default ProfileCard