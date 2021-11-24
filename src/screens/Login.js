import { WhiteBalance } from 'expo-camera/build/Camera.types';
import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { db } from '../firebase/config';

class Login extends Component {
  constructor(){
    super();
    this.state= {
      email: "",
      password: "",
      loggedIn: false
    };
  }

  NavigateToRegister(){
    this.props.drawerProps.navigation.navigate('Register')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> {this.props.error} </Text>
        <Text style={styles.titleText}> Bienvenido a Hooves </Text>
        <TextInput
          onChangeText={(text) => this.setState({ email: text })}
          placeholder="email"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          onChangeText={(text) => this.setState({ password: text })}
          placeholder="password"
          keyboardType="email-address"
          secureTextEntry={true}
          style={styles.input}
        />

        {(this.state.email !== '' && this.state.password !== '') ? (
          <TouchableOpacity style={styles.loginButton}
          onPress={() => this.props.login(this.state.email, this.state.password)}
            >
            <Text style={styles.loginText} >Login</Text>
          </TouchableOpacity>
          ):(
          <TouchableOpacity
            style={styles.deshabilitado}
          >
            <Text style={styles.loginText} >Login</Text>
          </TouchableOpacity> 
        )} 

      <TouchableOpacity onPress={()=> this.NavigateToRegister()}>
        <Text style={styles.textnavigation}> ¿No tenes una sesión? Registate! </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

  const styles = StyleSheet.create({

  loginButton: {
    backgroundColor:'green',
    paddingHorizontal: 24,
    paddingVertical: 10,
    textAlign: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "green",
   
  },
  loginText:{
    color: "#fff",
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  deshabilitado: {
      backgroundColor:'gray',
      paddingHorizontal: 24,
      paddingVertical: 10,
      textAlign: "center",
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "gray",
  },

    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#E2F2F3",
    },
    titleText:{
      fontSize: 37,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20
    },
    input: {
      width: 300,
      fontSize: 20,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginVertical: 10,
      marginBottom: 15
    },
    textnavigation: {
      marginTop: 10,
      fontSize: 16,
    }
  });

export default Login;