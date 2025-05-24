import React from "react";

import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const ImagePage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ảnh của {user?.display_name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ImagePage;
