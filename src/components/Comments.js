import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';


class Comments extends Component {
    constructor(props){
        super(props); 
        this.state = {
            comentario: '',
            comentarios:[]
        }
    
    }

 // ------
    componentDidMount() {
        this.getComments()
    }

    componentDidUpdate() {
        this.getComments()
    }

    getComments() {
        db.collection('posteos').doc(this.props.id).get()
        .then(doc => {
            this.setState({
                comentarios: doc.data().comments,
            })
        })
        .catch(err => console.log(err))
    }
  // ------
    
    render(){
        console.log(this.state.comentarios);
        return (
           <View>
               <TextInput 
               keyboardType='default' 
               placeholder='Agrega tu comentario'  
               onChangeText={(com)=>this.setState({comentario: com })}
               multiline
               />
               <TouchableOpacity onPress={()=>this.props.comentar(this.state.comentario)}> <Text>Comentar</Text></TouchableOpacity>
               <FlatList style={styles.FlatList}
            data={this.state.comentarios}
            keyExtractor={(comentario) => comentario.date.toString()}
            renderItem={({item}) => (
            <Text>{item.user} : {item.text}</Text>
           
            )}
          />}
               
           </View>
        )
    }
}

const styles = StyleSheet.create({
    FlatList: {
      color: 'black'
    },
    
  });

export default Comments