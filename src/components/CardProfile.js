import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Comments from '../components/Comments'
import moment from 'moment';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
        likes: 0,
        liked: false,
        showModalPhoto: false,
        showModalComents: false,
        showModalLikes: false,
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

  render() {
    return (
      <View>
        <View> 
            <TouchableOpacity onPress={()=> this.openModalPhoto()}>
                <Image style={{height: 120, width: 120, flexShrink: 3}} source={this.props.photo}/>
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
                        <View style={styles.userNameFoto}>
                            <Image 
                                style={{width: 32, height: 32, borderRadius:"50%"}}
                                source = {require("../../assets/user.png")}
                            />
                            <Text style={styles.userName}> {this.props.post.user} </Text>
                        </View>
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
                </View>
                    
                { ! this.state.showModalComents ? 
                    null
                :
                    <Modal 
                        style={styles.modalContainer}
                        visible={this.state.showModalComents}
                        animationType="fade"
                        transparent={false}
                    >
                        <TouchableOpacity onPress={() => this.closeModalComents()} style={styles.closeModal}>
                            <Text> X </Text>
                        </TouchableOpacity>
                    
                        <Comments comentar= {(com)=>this.comment(com)}  listaComentarios= {this.props.post.comments} id={this.props.id} />
                    
                    </Modal>
                }
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
        backgroundColor: "rgba(52,52,52,0.70)",
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
      marginLeft: 6,
    },
    userNameFrame: {
      display: "flex", 
      flexDirection: "row",
      justifyContent: "space-between", 
      marginBottom: 6,
      marginLeft: 10, 
      marginTop: 6,
    },
    userNameFoto: {
      display: "flex", 
      flexDirection: "row",
      justifyContent: "flex-start", 
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
    closeModal:{
      alignSelf: 'flex-end',
      padding: 10,
      backgroundColor: '#dc3545',
      marginTop:2,
      borderRadius: 4,
    },
  });

export default Card