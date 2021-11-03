import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { db, auth } from "../firebase/config";

import Home from '../screens/Home';
import Login from '../screens/Login';
import Post from '../screens/Post';
import Profile from '../screens/Profile';
import Register from '../screens/Register';
import Search from '../screens/Search'


const Drawer = createDrawerNavigator();

class Menu extends Component {
    constructor(){
        super();
        this.state= {
            loggedIn: false,
            error: '',
            userData: {}, 
            loading: true,
        };
    }

    componentDidMount(){
        auth.onAuthStateChanged((user) => {
            if (user !== null) {
                this.setState({
                    loggedIn: true,
                    loading: false
                })
            } else{
                this.setState({
                    loggedIn: false,
                    loading: false,
                })
            }
        })
    }


    register(email, password) {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((userData) => {
            this.setState({
                loggedIn: true,
                userData: userData.user, 
            })
        })
        .catch((err) => {
            this.setState({
                error: err.message
            })
        })
    }

    login(email, password) {
        auth
        .signInWithEmailAndPassword(email, password)
        .then((userData) => {
            this.setState({
                loggedIn: true,
                userData: userData,
            })
        })
        .catch((err) => {
            this.setState({
                error: err.message
            })
        })
    }

    signOut(){
        auth
        .signOut()
        .then((userData) => {
            this.setState({
                loggedIn: false, 
                loading: false,
            })
        })
        .catch((err) => {
            this.setState({
                error: err.message,
            })
        })
    }

    render() {
        return( 
            (this.state.loading === true) ? (
                <ActivityIndicator size="large" color="purple"/> 
            ):(
                <NavigationContainer>
                    <Drawer.Navigator> 
                    {(this.state.loggedIn === false) ? (
                        <>
                            <Drawer.Screen name="Login" component={() => <Login  error={this.state.error} login={(email, pass) => this.login(email,pass)} />} />
                            <Drawer.Screen name="Register" component={()=><Register error={this.state.error} register={(email, pass) => this.register(email,pass)} />} />
                        </>
                        ) : (
                        <>
                            <Drawer.Screen name="Home" component={()=><Home loading={this.state.loading} />} />
                            <Drawer.Screen name="Post" component={(drawerProps)=><Post drawerProps={drawerProps}/>} />
                            <Drawer.Screen name="Profile" component={()=><Profile userData={this.state.userData} signOut ={() => this.signOut() }/>}/>
                            <Drawer.Screen name="Search" component={()=><Search />} />
                        </>
                    )}
                    </Drawer.Navigator> 
                </NavigationContainer> 
            )
        );
    } 
}


export default Menu;