import React from "react";

import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useSelector } from "react-redux";

const FilePage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>File của {user?.display_name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight || 0,

  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FilePage;
