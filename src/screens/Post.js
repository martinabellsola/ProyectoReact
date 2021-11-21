import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, Image} from "react-native";
import { db, auth } from '../firebase/config';
import MyCamera from '../components/MyCamera'
import Icon from 'react-native-vector-icons/FontAwesome5';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                
                <Image 
                    style={{width: "80%", flex: 2, marginTop: 10}}
                    source = {{uri: this.state.url}}
                /> 
                <TextInput 
                    style={styles.input}
                    placeholder="Escribe una descripción..."
                    keyboardType="default"
                    onChangeText={ text => this.setState({ description: text }) }
                    value={this.state.description}
                    multiline={true}
                />

                <TouchableOpacity
                    style={styles.buttonProfilePicture}
                    onPress={() =>  this.submitPost()}>
                    <Text style={{fontWeight: 600,}}> Postear </Text>
                </TouchableOpacity> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formContainer:{
        paddingHorizontal:10,
        display: "flex", 
        flex: 1,
        justifyContent: "center", 
        alignItems: "center"
    },
    menu: {
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center"
    },
    input: {
        borderColor: "#dbdbdb",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 50,
        borderWidth: 1,
        borderStyle: "solid",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        marginTop: 10,
        marginLeft: 8,
        width: "80%",
        marginRight: 8,
    },
    buttonProfilePicture:{
        backgroundColor: "transparent",
        paddingHorizontal: 9,
        paddingVertical: 5,
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 50,
        borderStyle: "solid",
        borderColor: "#dbdbdb",
        marginTop: 10,
        marginLeft: 160,
      },
});
export default Post;