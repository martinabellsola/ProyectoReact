import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal, Image } from "react-native";

class Register extends Component {
  constructor(){
    super();
    this.state= {
      email: '',
      password: '',
      userName: '',
      url: 'https://cdhcolima.org.mx/wp-content/uploads/2016/11/user.png',
    }
  }

  NavigateToLogin(){
    this.props.drawerProps.navigation.navigate('Login')
  }

  render() {
    return (
      <View>

        <Text> {this.props.error} </Text>
        
        <TextInput
          onChangeText={(text) => this.setState({ userName: text })}
          placeholder="User name"
          keyboardType="default"
        />

        <TextInput
          onChangeText={(text) => this.setState({ email: text })}  
          placeholder="email"
          keyboardType="email-address"
        />

        <TextInput
          onChangeText={(text) => this.setState({ password: text })}
          placeholder="password"
          keyboardType="default"
          secureTextEntry={true}
        />


        {(this.state.email !== '' && this.state.userName !== '' && this.state.password !== '') ? (
       
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.register(this.state.email, this.state.userName, this.state.password, this.state.url)}
          >
            <Text style={styles.textButton}>Registrar</Text>
          </TouchableOpacity>

          ):(
          <TouchableOpacity
            style={styles.deshabilitado}
          >
            <Text style={styles.textButton}>Registrar</Text>
          </TouchableOpacity> 
        )} 

        <TouchableOpacity onPress={()=> this.NavigateToLogin()}>
          <Text> ¿Ya tenés usuario? Iniciar Sesión</Text>
        </TouchableOpacity>
        
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
    deshabilitado: {
      backgroundColor:'gray',
      paddingHorizontal: 10,
      paddingVertical: 6,
      textAlign: "center",
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "gray",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22, 
    },
    modalView: {
      backgroundColor: "rgba(52,52,52,0.5)",
      height: "100%", 
     
    },
    modalInfo: {
      margin: "auto",
      backgroundColor: "white",
      height: "80%", 
      width: "85%",
      borderRadius: 15,
      padding: 35,
      alignItems: "center",
    },
    closeModal:{
      alignSelf: 'flex-end',
      padding: 10,
      backgroundColor: '#dc3545',
      marginTop:2,
      borderRadius: 4,
    },
  });

export default Register;