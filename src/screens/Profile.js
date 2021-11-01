import React, { Component } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, } from "react-native";
import { auth } from "../firebase/config";

class Profile extends Component{
    
    constructor(props) {
      super(props);
      this.state = { 

      }  
    }

  
    render() {
        return (
          <View>
            <Text> Email usuario: {auth.currentUser.email} </Text>
            <Text> Fecha de creación: {auth.currentUser.metadata.creationTime} </Text>
            <Text> Última sesión: {auth.currentUser.metadata.lastSignInTime} </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.signOut()}
            >
                <Text style={styles.textButton}> Cerrar sesión </Text>
            </TouchableOpacity>
          </View>
        );
      }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "red",
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: "center",
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "red",
    },
    textButton: {
        color: "#fff",
    },
});
    
export default Profile;