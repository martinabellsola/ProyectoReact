import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/FontAwesome5';

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
                    loading: false, 
                    userData: user
                })
            } else{
                this.setState({
                    loggedIn: false,
                    loading: false,
                })
            }
        })
    };

    register(email, userName, password, url) {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((userData) => {
            userData.user.updateProfile({
                displayName: userName, 
                photoURL: url
            })
        }).then((userData)=>{
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
                userData: null,
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
            (this.state.loading) ? (
                <ActivityIndicator size="large" color="purple"/> 
            ):(
                <NavigationContainer>
                    <Drawer.Navigator> 
                    {(this.state.loggedIn === false) ? (
                        <>
                            <Drawer.Screen 
                                name="Login" 
                                component={(drawerProps) => <Login drawerProps={drawerProps} error={this.state.error} login={(email, pass) => this.login(email,pass)} />} />
                            <Drawer.Screen name="Register" component={(drawerProps)=><Register drawerProps={drawerProps} error={this.state.error} register={(email, userName, pass, url) => this.register(email, userName, pass, url)} />} />
                        </>
                        ) : (
                        <>
                            <Drawer.Screen 
                                name="Home" 
                                options= {{drawerIcon: config => <Icon size={23} name="lock"/>, unmountOnBlur: true}}
                                options={{drawerIcon: config => <Icon size={23} name="home"/>}}
                                component={()=><Home loading={this.state.loading} />} />
                            <Drawer.Screen 
                                name="Post" 
                                options= {{drawerIcon: config => <Icon size={23} name="plus"/>, unmountOnBlur: true}}
                                component={(drawerProps)=><Post drawerProps={drawerProps}/>} />
                            <Drawer.Screen 
                                name="Profile"
                                options= {{drawerIcon: config => <Icon size={23} name="user"/>, unmountOnBlur: true}}
                                component={(drawerProps)=><Profile userData={this.state.userData} signOut ={() => this.signOut() } drawerProps={drawerProps}/>}/>
                            <Drawer.Screen 
                                name="Search" 
                                options= {{drawerIcon: config => <Icon size={23} name="search"/>, unmountOnBlur: true}}
                                component={()=><Search />} />
                        </>
                    )}
                    </Drawer.Navigator> 
                </NavigationContainer> 
            )
        );
    } 
}


export default Menu;