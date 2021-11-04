import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList
  } from "react-native";
import { db, auth } from '../firebase/config';

class Post extends Component {
    constructor(){
        super();
        this.state= {
            description:"",
            username:"",
            comments:[],
            likes:[],
        };
    }
submitPost(){
        db.collection("posteos").add({
            username: auth.currentUser.email,
            description: this.state.description,
            createdAt: Date.now(),
            likes: [],
            comments: [],
        })
        .then(() => {
            
            this.setState({
                description: "",
            })

            this.props.drawerProps.navigation.navigate("Home")
        })
        .catch((err) => {
           console.log(err)
        })
    }


render() {
    return (
        <View style={styles.formContainer}>
          <Text> Nuevo Post </Text>
          <TextInput
            onChangeText={(text) => this.setState({ description: text })}
            placeholder="Descripción"
            keyboardType="default"
            value={this.state.description}
            multiline
            style={styles.multilineInput}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.submitPost()}
          >
            <Text style={styles.textButton}> Postear </Text>
          </TouchableOpacity>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    formContainer:{
        paddingHorizontal:10,
        marginTop: 20,
    },
    multilineInput:{
        height:100,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
    },
    button:{
        backgroundColor:'#28A745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4,
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#28A745'
    },
    textButton:{
        color: '#fff'
    }
});
export default Post;