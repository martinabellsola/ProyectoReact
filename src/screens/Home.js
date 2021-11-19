import React, { Component } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { db, auth } from "../firebase/config";
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
      }, ()=> console.log(this.state.post))
    })
  }

  render() {
    return (
      <View style={{backgroundColor: "#e8e3e3"}}>
        {(this.state.loading === true) ? <ActivityIndicator size="large" color="pink" /> : 
          <FlatList
            data={this.state.post}
            keyExtractor={(post) => post.id.toString()}
            renderItem={({item}) => (
              <Card post={item.data} id={item.id} photo={item.photo} />
            )}
          />}
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
  formContainer:{
    marginTop: 20,
    paddingVertical:15,
    paddingHorizontal: 10,
    borderWidth:1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical:10,
},
});
export default Home;