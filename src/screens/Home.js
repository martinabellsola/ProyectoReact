import React, { Component } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { db } from "../firebase/config";
import Card from "../components/Card"

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: [],
      loading: true,
    };
  }

  componentDidMount(){
    this.showPost();
  }

  showPost(){
    db.collection("posteos").orderBy('createdAt', 'desc').onSnapshot( docs => {
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
      })
    })
  }

  render() {
    return (
      <View style={{backgroundColor: "#fcfafa", height: "600"}}>
        { this.state.loading 
          ? <ActivityIndicator  style={{marginTop: "70%", marginBottom: "70%"}} size="large" color="blue" /> 
          : <FlatList
              data={this.state.post}
              keyExtractor={(post) => post.id.toString()}
              renderItem={({item}) => (
                <Card post={item.data} id={item.id} photo={item.photo} />
              )}
            />
          }
      </View>
    );
  }
}

export default Home;