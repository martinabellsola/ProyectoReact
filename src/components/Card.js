import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from "react-native";
import { db, auth, } from "../firebase/config";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'firebase';
import Comments from '../components/Comments'
import moment from 'moment';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      likes: 0,
      liked: false,
      comments:[],
      showModalComents: false,
      showModalLikes: false,
      showModalX: false,
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

  openModalLikes() {
    this.setState({
      showModalLikes: true
    })
  }

  closeModalLikes() {
    this.setState({
      showModalLikes: false
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

  borrar(id){ 
  db.collection("posteos").doc(id).delete().then(()=>{
    console.log("se borró re piola")
  })
  .catch((err)=> {
    console.log(err)
  })};

  openModalX(){
  this.setState({
    showModalX: true
  })}

  closeModalX(){
  this.setState({
    showModalX: false
  })}

  render() {
    return (
      <View style={styles.container}>
    
        <View style={styles.userNameFrame}>
          <View style={styles.userNameFoto}>
            <Image 
              style={{width: 32, height: 32, borderRadius:"50%"}}
              source = {require("../../assets/user.png")}
            />
            <Text style={styles.userName}> {this.props.post.user} </Text>
          </View>
            { this.props.post.mail === auth.currentUser.email 
              ? <>
                <TouchableOpacity onPress={()=>this.openModalX()}>
                  <Icon size={20} name="times"/>
                </TouchableOpacity>
                </>
              :
                null
            }
        </View>

        <Image style={styles.photo} source={{uri:this.props.post.photo}}/>
        
        <View style={styles.action}>
        { ! this.state.liked ?  
          <TouchableOpacity onPress={() => this.like(this.props.id)} style={{paddingRight:10}}> 
            <Icon style={{color:this.state.colorLiked}}  size={20} name="heart" />
          </TouchableOpacity>
          : 
          <TouchableOpacity onPress={() => this.dislike(this.props.id)} style={{paddingRight:10}}> 
            <Icon style={{color:this.state.colorLiked}} size={20} name="heart" solid />
          </TouchableOpacity>
        }
        <TouchableOpacity onPress={() => this.openModalComents()}> 
          <Icon size={20} name="comment"/>
        </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => this.openModalLikes()}>
          <Text style={{fontWeight: 600, color: "#262626"}} > {this.props.post.likes.length} Me gusta </Text>
        </TouchableOpacity> 
        
        <View style={styles.descrip}>
          <Text style={{fontWeight:600, color: "#262626"}}>{this.props.post.user}</Text>   
          <Text> {this.props.post.description}</Text>   
        </View>

        <TouchableOpacity onPress={() => this.openModalComents()}>
        {this.props.post.comments.length === 0 ? 
              <Text style={{color: "#8e8e8e", marginBottom:4,}}> Todavía no hay comentarios, se el primero! </Text>
            : this.props.post.comments.length === 1 ? 
              <Text style={{color: "#8e8e8e", marginBottom:4,}}> Ver {this.props.post.comments.length} comentario </Text>
            : <Text style={{color: "#8e8e8e", marginBottom:4,}}> Ver los {this.props.post.comments.length} comentarios </Text>
          }
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
              <TouchableOpacity onPress={() => this.closeModalComents()} style={styles.closeModal}>
                <Text> X </Text>
              </TouchableOpacity>
              
              <Comments comentar= {(com)=>this.comment(com)}  listaComentarios= {this.props.post.comments} id={this.props.id} />
            </Modal>
        }

        { ! this.state.showModalLikes ? 
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
                <View style={styles.menuLike}>
                  <Text style={{fontSize: 16, fontWeight: 600}}> Me gusta</Text>
                  <TouchableOpacity style={{marginLeft: 100}} onPress={() => this.closeModalLikes()}>
                    <Icon size={20} name="times" />
                  </TouchableOpacity>
                </View>
                <Text>——————————————</Text>
                <FlatList
                  data={this.props.post.likes}
                  keyExtractor={(post) => post}
                  renderItem={({item}) => (
                      <Text style={{marginTop: 5}}>{item}</Text>
                  )}
                />
              </View>
            </View>  
          </Modal>
        }

        { ! this.state.showModalX ? 
            null
          :
            <Modal 
            style={styles.modalContainer}
            visible={this.state.showModal}
            animationType="fade"
            transparent={true}
            >
            <View style={styles.modalView}> 
              <View style={styles.modalInfoBorrar}> 
                <Text style={{fontSize: 15, fontWeight: 600}}> ¿Descartar publicación? </Text>
                <Text style={{fontSize: 15, fontWeight: 400, color:"#8e8e8e", marginTop: 12}}>Si sales, no se guardarán los cambios </Text>
                <TouchableOpacity onPress={() => this.borrar(this.props.id)}>
                  <Text style={{fontSize: 15, fontWeight: 700, color: "#ed4956", marginTop: 18}}> Descartar </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.closeModalX()}>
                  <Text style={{fontSize: 15, fontWeight: 400, marginTop: 10}}> Cancelar </Text>
                </TouchableOpacity>
              </View>
            </View>  
          </Modal>
         }
      </View>
    );
  }    
}

const styles = StyleSheet.create({
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
    marginBottom: 5,
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
  descrip: {
    display: "flex", 
    flexDirection: "row",
    marginBottom: 4,
    marginTop: 5, 
    marginLeft: 3,
  },
  action: {
    display: "flex", 
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5
  },
  container:{
    paddingVertical:15,
    paddingHorizontal: 10,
    borderWidth:1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    backgroundColor: "white", 
    marginBottom: 10, 
    marginLeft: 5,
    marginRight: 5
  },
  photo:{
    height: 300,
    marginTop: 5, 
    marginBottom: 5, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22, 
  },
  modalView: {
    backgroundColor: "rgba(52,52,52,0.70)",
    height: "100%", 
  },
  modalInfo: {
    margin: "auto",
    backgroundColor: "white",
    height: "80%", 
    width: "85%",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
  },
  modalInfoBorrar: {
    margin: "auto",
    backgroundColor: "white",
    height: "129", 
    width: "80%",
    borderRadius: 12,
    padding: 35,
    alignItems: "center",
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