import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PhoneBookFriend = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Danh bạ bạn bè</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default PhoneBookFriend;
