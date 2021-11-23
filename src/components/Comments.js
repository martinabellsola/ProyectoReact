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
           <View>
               <TextInput 
                    style={styles.inputContainer}
                    keyboardType='default' 
                    placeholder='Agrega tu comentario'  
                    onChangeText={(com)=>this.setState({comentario: com })}
                    multiline
                />
               <TouchableOpacity style={styles.botonComentar} onPress={()=>this.props.comentar(this.state.comentario)}> <Text>Comentar</Text></TouchableOpacity>
               
               {(this.state.comentarios.length !== 0)?(
                 
                    <FlatList style={styles.FlatList}
                        data={this.state.comentarios}
                        keyExtractor={(comentario) => comentario.keydate.toString()}
                        renderItem={({item}) => ( 
                      
                        <View style={styles.wrap}>
                            <View style={styles.container}>
                                <Text style={{fontWeight: 'bold' }}>{item.user}</Text> 
                                <Text numberOfLines={1}>{item.text} </Text>
                                <Text style={{textAlign: 'right', opacity: 0.5 }}>{item.date}</Text>
                            </View>
                        </View> 
                      
                    )}
                    />
                ):(
                    <Text style={{color: "#8e8e8e", margin: "auto", marginTop: 150}}> Todavía no hay comentarios, se el primero! </Text>
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
        flexShrink: 1,
        marginLeft: 5
    },
    inputContainer:{
        marginTop: 20,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 10,
        marginVertical:10,
        backgroundColor: 'rgba(242, 243, 245, 0,7)',
        marginLeft: 5, 
        marginRight: 5
    },
    wrap:{
        flexDirection: "row"
    },
    botonComentar:{
        backgroundColor: "transparent",
        paddingHorizontal: 9,
        paddingVertical: 5,
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 50,
        borderStyle: "solid",
        borderColor: "#dbdbdb",
        marginLeft: 160,
        marginRight: 5
    }
     
});

export default Comments