import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { db, auth } from '../firebase/config';
import MyCamera from '../components/MyCamera'
import Icon from 'react-native-vector-icons/FontAwesome5';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '', 
            showCamera: true,
            url: '',
        }
    }

    submitPost() {
        db.collection('posteos').add({
            user: auth.currentUser.displayName, 
            mail: auth.currentUser.email,
            createdAt: Date.now(),
            description: this.state.description,
            likes: [],
            comments: [], 
            photo: this.state.url
        }).then(() => {
            this.setState({
               title: '',
               description: '', 
               url: '',
            })
            this.props.drawerProps.navigation.navigate("Home") 
        }).catch(err => console.log(err))
    }

    onImageUpload(url){
      this.setState({
        url: url, 
        showCamera: false
      })
    }

    render() {
        return (
          this.state.showCamera ? 
            <MyCamera onImageUpload={(url)=> this.onImageUpload(url)} drawerProps={this.props.drawerProps} /> 
            :  
            <View style={styles.formContainer}>  
                <TextInput 
                    style={styles.input}
                    placeholder="Escribe una descripción..."
                    keyboardType="default"
                    onChangeText={ text => this.setState({ description: text }) }
                    value={this.state.description}
                    multiline={true}
                />

                <TouchableOpacity style={styles.button} onPress={() => this.submitPost()}>
                    <Text style={styles.textButton}>
                        Postear
                    </Text>
                </TouchableOpacity>
            </View>
        )
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