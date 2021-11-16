import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";

class Register extends Component {
  constructor(){
    super();
    this.state= {
      email: '',
      password: '',
      userName: '',
    }
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

        {(this.state.email !== ''&& this.state.userName !== '' && this.state.password !== '') ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.register(this.state.email, this.state.userName, this.state.password)}
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
  });

export default Register;