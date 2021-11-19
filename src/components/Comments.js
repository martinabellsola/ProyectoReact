import React, {Component} from 'react'; 
import { Text,ScrollView, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import { db, auth, storage} from "../firebase/config";
import firebase from 'firebase';
import moment from 'moment';


 
class Comments extends Component {
    constructor(props){
        super(props); 
        this.state = {
            comentario: '',
            comentarios:[],
            Fechacom:""
        }
    
    }

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
   
      

    render(){
        return (
           <View >
               <TextInput 
               style={styles.inputContainer}
               keyboardType='default' 
               placeholder='Agrega tu comentario'  
               onChangeText={(com)=>this.setState({comentario: com })}
               multiline
               />
               <TouchableOpacity onPress={()=>this.props.comentar(this.state.comentario)}> <Text>Comentar</Text></TouchableOpacity>
               {(this.state.comentarios.length !== 0)?(
                 
                    <FlatList style={styles.FlatList}
                        data={this.state.comentarios}
                        keyExtractor={(comentario) => comentario.date.toString()}
                        renderItem={({item}) => ( 
                      
                        <View style={styles.wrap}>
                        <View style={styles.container}>
                        <Text style={{fontWeight: 'bold' }}>{item.user}</Text> 
                        <Text>{item.text} </Text>
                        <Text style={{textAlign: 'right', opacity: 0.5 }}>{item.date}</Text>
                        </View>
                        </View> 
                      
                    )}
                    />
                ):(
                    <Text> Todavía no hay comentarios, se el primero! </Text>
                )
            }               
           </View>
        )
    }
}

const styles = StyleSheet.create({
    FlatList: {
      color: 'black',
    },
    container:{
        marginTop: 20,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
        backgroundColor: 'rgba(242, 243, 245, 1)',
        flexShrink:1,
        
      },
      inputContainer:{
        marginTop: 20,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
        backgroundColor: 'rgba(242, 243, 245, 0,7)',
        
      },
      wrap:{
        flexDirection: "row"
      }
     
});

export default Comments