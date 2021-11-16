import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from "react-native";
import { db, auth, } from "../firebase/config";
import firebase from 'firebase';
import Comments from '../components/Comments'

class Post extends Component {
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
    let comentario = {text: com, user: auth.currentUser.email, date: Date.now()}
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
      <View style={styles.formContainer}>
        <Image style={styles.photo} source={{uri:this.props.post.photo}}/>
            {(this.props.post.user === auth.currentUser.email) ?(
              <>
                <TouchableOpacity onPress={()=>this.openModalX()}>
                  <Text>X</Text>
                </TouchableOpacity>
                <Text>Descripción: {this.props.post.description}</Text>
                <Text>Usuario: {this.props.post.user} </Text>
                <TouchableOpacity onPress={() => this.openModalLikes()}>
                <Text>Cantidad de likes: {this.props.post.likes.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openModalComents()}>
                  <Text>Comentarios: {this.props.post.comments.length} </Text>
                </TouchableOpacity>
                { ! (this.state.liked) ?  
                  (<TouchableOpacity style={styles.button} onPress={() => this.like(this.props.id)}> 
                    <Text style={styles.textButton}>Like</Text> 
                  </TouchableOpacity>) 
                : (
                  <TouchableOpacity style={styles.button} onPress={() => this.dislike(this.props.id)}> 
                    <Text style={styles.textButton}> Dislike </Text> 
                  </TouchableOpacity>)
                }{
                  ! this.state.showModalComents ? 
                    null
                  :
                    <Modal 
                      style={styles.modalContainer}
                      visible={this.state.showModalComents}
                      animationType="slide"
                      transparent={false}
                    >
                      <TouchableOpacity onPress={() => this.closeModalComents()} style={styles.closeModal}>
                        <Text> X </Text>
                      </TouchableOpacity>
                      <Comments comentar= {(com)=>this.comment(com)}  listaComentarios= {this.props.post.comments} id={this.props.id} />
                    </Modal>
                }{
                  ! this.state.showModalLikes ? 
                    null
                  :
                  <Modal 
                    style={styles.modalContainer}
                    visible={this.state.showModalLikes}
                    animationType="slide"
                    transparent={false}
                  >
                    <TouchableOpacity onPress={() => this.closeModalLikes()} style={styles.closeModal}>
                      <Text> X </Text>
                    </TouchableOpacity>
                    <Text>Usuarios que likearon: {this.props.post.likes}</Text>
                  </Modal>
              }
          {
         ! this.state.showModalX ? 
                      null
                  :
                      <Modal 
                          style={styles.modalContainer}
                          visible={this.state.showModalX}
                          animationType="slide"
                          transparent={false}
                      >
                        <Text> ¿Esta seguro que desea borrar su posteo? </Text>
                          <TouchableOpacity onPress={() => this.borrar(this.props.id)} style={styles.closeModal}>
                          <Text> SI </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.closeModalX()} style={styles.closeModal}>
                          <Text> NO </Text>
                          </TouchableOpacity>
                         
                      </Modal>
              }
        </>):(<><Text>Descripción: {this.props.post.description}</Text>
          <Text>Usuario: {this.props.post.user} </Text>
        <Text> Mail: {this.props.post.mail} </Text>
        <TouchableOpacity onPress={() => this.openModalLikes()}>
        <Text>Cantidad de likes: {this.props.post.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.openModalComents()}>
    <Text>Comentarios: {this.props.post.comments.length} </Text>
        </TouchableOpacity>
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
        {
         ! this.state.showModalComents ? 
                      null
                  :
                      <Modal 
                          style={styles.modalContainer}
                          visible={this.state.showModalComents}
                          animationType="slide"
                          transparent={false}
                      >
                          <TouchableOpacity onPress={() => this.closeModalComents()} style={styles.closeModal}>
                          <Text> X </Text>
                          </TouchableOpacity>
                          <Comments comentar= {(com)=>this.comment(com)}  listaComentarios= {this.props.post.comments} id={this.props.id} />
                      </Modal>
              }
        {
         ! this.state.showModalLikes ? 
                      null
                  :
                      <Modal 
                          style={styles.modalContainer}
                          visible={this.state.showModalLikes}
                          animationType="slide"
                          transparent={false}
                      >
                          <TouchableOpacity onPress={() => this.closeModalLikes()} style={styles.closeModal}>
                          <Text> X </Text>
                          </TouchableOpacity>
                         <Text>Usuarios que likearon: {this.props.post.likes}</Text>
                      </Modal>
              }</>)}
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
  },
  modalContainer: {
    width:'100%',  
    flex: 3,
    alignSelf: 'center',
    backgroundColor: "white",
    borderColor: '#000000',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#000000'
  },
  closeModal:{
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#dc3545',
    marginTop:2,
    borderRadius: 4,
  },
});

export default Post