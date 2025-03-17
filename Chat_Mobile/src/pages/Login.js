import React from "react";
import { StyleSheet,View, Text, StatusBar } from "react-native";

const Login = () => {
    return (
        <View style={styles.container}>
            <Text>Login</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: StatusBar.currentHeight || 0,
    }
});

export default Login;