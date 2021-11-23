import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import Comments from './Comments'


class CardProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        likes: 0, 
        liked: false,
        showModalPhoto: false,
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
        liked: true, 
        colorLiked: "red", 
      })
    }
  }

  like(id){
    db.collection("posteos").doc(id).update({
      likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email + ", ")
    }).then(()=>{
      this.setState({
        liked: true,
        colorLiked: "red", 
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
      colorLiked: "black", 
      likes: this.state.likes - 1, 
    })})
    .catch((err)=> {
      console.log(err)
    })  
  };

  comment(com){
    let comentario = {text: com, user: auth.currentUser.email, date: moment().format('ll'), keydate: Date.now()}
    db.collection("posteos").doc(this.props.id).update({
      comments: firebase.firestore.FieldValue.arrayUnion(comentario)
    }).then(()=>{
    let ArrayComentarios = this.state.comments
    ArrayComentarios.push(comentario)
    this.setState({
      comments: ArrayComentarios
    })
    }).catch((err)=> {
      console.log(err)
    })  
  }

  openModalComents() {
    this.setState({
      showModalComents: true
    })
  }

  closeModalComents() {
    this.setState({
      showModalComents: false
    })
  }

  openModalPhoto(){
    this.setState({
      showModalPhoto: true
    }) 
  } 

  closeModalPhoto(){
    this.setState({
      showModalPhoto: false
    }) 
  } 

  render() {
    return (
      <View>
        <View>
            <TouchableOpacity onPress={()=> this.openModalPhoto()}>
                <Image style={{height: 145, width: 145, marginHorizontal: 5, marginVertical: 5}} source={this.props.photo}/>
            </TouchableOpacity>
        </View>
        { ! this.state.showModalPhoto ? 
            null
        :
            <Modal 
                style={styles.modalContainer}
                visible={this.state.showModalLikes}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalInfo}>  
                        <View style={styles.userNameFrame}>
                            <Text style={styles.userName}> {this.props.post.user} </Text>
                            <TouchableOpacity onPress={()=> this.closeModalPhoto()} > 
                              <Icon style={{color:"#8e8e8e", paddingLeft: 125, paddingTop: 5}}  size={15} name="arrow-right" solid />
                            </TouchableOpacity>        
                        </View>

                        <Image style={styles.photo} source={this.props.photo}/>

                        <View style={styles.action}>
                            { ! this.state.liked ?  
                            <TouchableOpacity onPress={() => this.like(this.props.id)} style={{paddingRight: 10}}> 
                                <Icon style={{color:this.state.colorLiked}}  size={20} name="heart" />
                            </TouchableOpacity>
                            : 
                            <TouchableOpacity onPress={() => this.dislike(this.props.id)} style={{paddingRight: 10}}> 
                                <Icon style={{color:this.state.colorLiked}} size={20} name="heart" solid />
                            </TouchableOpacity>
                            }

                            <TouchableOpacity onPress={() => this.openModalComents()}> 
                                <Icon size={20} name="comment"/>
                            </TouchableOpacity>
                            
                            { ! this.state.showModalComents ? 
                                null
                            :
                            <Modal 
                                style={styles.modalContainer}
                                visible={this.state.showModalComents}
                                animationType="fade"
                                transparent={false}
                            >
                              <TouchableOpacity onPress={() => this.closeModalComents()}>
                                <Icon style={{marginLeft: 290, marginTop: 10}} size={20} name="times" />
                              </TouchableOpacity>
                              <Comments comentar= {(com)=>this.comment(com)}  listaComentarios= {this.props.post.comments} id={this.props.id} />
                            </Modal>
                            }
                        </View>
                 </View>
                 </View>
            </Modal>
        }
        </View>
    );
  }    
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
    }, 
    modalView: {
        backgroundColor: "rgba(52,52,52,0.75)",
        height: "100%", 
    },
    modalInfo: {
        backgroundColor: "white",
        borderRadius: 12,
        alignItems: "flex-start",
        margin: "auto"
    },
    photo:{
        height: 300,
        width: 300,
    },
    userName: {
      color: "#262626", 
      fontWeight: "bold", 
      fontSize: 15, 
      marginTop: 5,
    },
    userNameFrame: {
      display: "flex", 
      flexDirection: "row",
      justifyContent: "space-between", 
      marginBottom: 6,
      marginLeft: 10, 
      marginTop: 6,
    },
    menuLike: {
      display: "flex", 
      flexDirection: "row", 
      justifyContent: "center"
    },
    action: {
      display: "flex", 
      flexDirection: "row",
      marginBottom: 6,
      marginTop: 6, 
      marginLeft: 10, 
    },
});

export default CardProfile