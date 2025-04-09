import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./src/pages/LoginScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import VerifyScreen from "./src/pages/VerifyScreen";
import NameRegisterScreen from "./src/pages/NameRegisterScreen";
import PersonalInfoScreen from "./src/pages/PersonalInfoScreen";
import AvatarScreen from "./src/pages/AvatarScreen";
import HomeScreen from "./src/pages/HomeScreen";
import ConversationScreen from "./src/pages/ConversationScreen";
import TabBottom from "./src/navigation/TabBottom";
import SingleChatScreen from "./src/pages/SingleChatScreen";
import DetailSingleChatScreen from "./src/pages/DetailSingleChatScreen";
import GroupChatScreen from "./src/pages/GroupChatScreen";
import DetailGroupChatScreen from "./src/pages/DetailGroupChatScreen";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

import ProfileScreen from "./src/pages/ProfileScreen";
import EditStatusScreen from "./src/pages/EditStatusScreen"; // Import man hinh EditStatus
import FindInfo from "./src/navigation/FindInfo";

import ProfileMainScreen from "./src/pages/ProfileMainSrceen";
import CallScreen from "./src/pages/CallScreen";

import AddFriendScreen from "./src/pages/AddFriendScreen";
import CreateGroupScreen from "./src/pages/CreateGroupScreen";

import { getToken } from "./src/utils/authHelper";
import { AuthProvider } from "./src/contexts/AuthContext";
import { useAuth } from "./src/contexts/AuthContext";

const Stack = createStackNavigator();

const AppNavigation = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;
  return (
    <NavigationContainer>
        <Stack.Navigator >
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Main"
                component={TabBottom}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Conversation"
                component={ConversationScreen}
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
              <Stack.Screen
                name="EditStatus"
                component={EditStatusScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="FindInfo"
                component={FindInfo}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="ProfileMainScreen" options={{ headerShown: false }}>
                {props => <ProfileMainScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>

              <Stack.Screen
                name="CallScreen"
                component={CallScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddFriendScreen"
                component={AddFriendScreen}
                options={{ headerTitle: "Thêm bạn bè" }}
              />
              <Stack.Screen
                name="CreateGroupScreen"
                component={CreateGroupScreen}
                options={{ headerTitle: "Nhóm mới" }}
              />
            </>
          ) : (
            <>
            
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VerifyScreen"
                component={VerifyScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NameRegisterScreen"
                component={NameRegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PersonalInfoScreen"
                component={PersonalInfoScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AvatarScreen"
                component={AvatarScreen}
                options={{ headerShown: false }}
              />
            </>
          )}

          
        </Stack.Navigator>
      </NavigationContainer>
  )
}

export default function App() {
 

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigation />
    </AuthProvider>
  );
}
