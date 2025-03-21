import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from './src/pages/Login';
import HomeScreen from './src/pages/HomeScreen';
import ConversationScreen from './src/pages/ConversationScreen';
import TabBottom from './src/navigation/TabBottom';
import SingleChatScreen from "./src/pages/SingleChatScreen";
import DetailSingleChatScreen from "./src/pages/DetailSingleChatScreen";
import GroupChatScreen from "./src/pages/GroupChatScreen";
import DetailGroupChatScreen from "./src/pages/DetailGroupChatScreen";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

import ProfileScreen from "./src/pages/ProfileScreen";
import EditStatusScreen from "./src/pages/EditStatusScreen"; // Import man hinh EditStatus
import FindInfo  from "./src/navigation/FindInfo";  

import ProfileMainScreen from "./src/pages/ProfileMainSrceen";

const Stack = createStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Conversation"
                    component={ConversationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Main"
                    component={TabBottom}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SingleChatScreen"
                    component={SingleChatScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DetailSingleChatScreen"
                    component={DetailSingleChatScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="GroupChatScreen"
                    component={GroupChatScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DetailGroupChatScreen"
                    component={DetailGroupChatScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{ headerShown: false }}
                 />
                 <Stack.Screen name="EditStatus" component={EditStatusScreen} 
                    options={{ headerShown: false }}
                 
                 />

                <Stack.Screen name="FindInfo" component={FindInfo} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="ProfileMain" component={ProfileMainScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
