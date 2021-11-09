import React, {Component} from 'react'; 
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';


class Comments extends Component {
    constructor(props){
        super(props); 
        this.state = {
            comentario: ''
        }
    
    }
    
  
    
    render(){
        return (
           <View>
               <TextInput keyboardType='default' placeholder='Agrega tu comentario'  onChange={(com)=>this.setState({comentario: com })}/>
               <TouchableOpacity onPress={()=>this.props.comentar(this.state.comentario)}> <Text>Comentar</Text></TouchableOpacity>
           </View>
        )
    }
}

export default Comments