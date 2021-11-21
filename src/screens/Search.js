import React, { Component } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { db, auth } from "../firebase/config";
import Card from "../components/Card"
import Icon from 'react-native-vector-icons/FontAwesome5';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: [],
      loading: true,
      result: '', 
      searchDone: false,
      isActive: false
    };
  }

  showPost(){
    db.collection("posteos").where('mail','==', this.state.result).onSnapshot( docs => {
      let post = []
      docs.forEach((doc) => {
        post.push({
          data: doc.data(),
          id: doc.id,
        })
      })
      this.setState({
        post: post,
        loading: false,
        searchDone: true
      })
    })
  }

  onFocus(){
    this.setState({
      isActive: true
    })
  }

  render() {
    return (
      <View> 
        <View style={styles.searchContainer}> 
          <TextInput 
            style={{flex:2}}
            onChangeText={(txt)=>this.setState({result:txt})} 
            placeholder="¡Buscá el post mediante email!" 
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={()=>this.showPost()}> 
            <Icon style={{flex:1, color: "#cccccc",}} size={23} name="search"/>
          </TouchableOpacity>
        </View>
        
        { this.state.searchDone ? 
          this.state.post.length == 0 ? 
            <Text style={{marginLeft: 8, marginRight: 8, textAlign: "center", fontSize: 14, fontWeight:600, marginTop: 10,}}>¡No se han encontrado posteos para tu busqueda, probá con otro usuario!</Text>
          :
            <FlatList
              data={this.state.post}
              keyExtractor={(post) => post.id.toString()}
              renderItem={({item}) => (
                <Card post={item.data} id={item.id} photo={item.photo} />
              )}
            />
          : null
        }
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: "solid",
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderColor: "#dbdbdb",
    marginTop: 10,
    marginLeft: 8,
    marginRight: 8,
  
  },
});
export default Search;