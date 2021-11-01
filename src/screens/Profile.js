import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList
  } from "react-native";
import { db } from '../firebase/config';

class Profile extends Component {
    constructor(){
        super();
        this.state= {
           
        };
    }



render() {
    return(
            
        <View>
          <Text> Hola </Text>
        </View>

        );
    }
}
export default Profile;