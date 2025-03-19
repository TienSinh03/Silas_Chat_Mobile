import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    StatusBar,
    SafeAreaView,
    ScrollView,
    FlatList,
} from "react-native";
import Header from "../components/Header";
import ConservationList from "../components/ConservationList";
import TabTopCategoryChat from "../navigation/TabTopCategoryChat";

const { width, height } = Dimensions.get("window");

const ConversationScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Header iconLeft={"qrcode"} iconRight={"plus"} />
            <TabTopCategoryChat />
            {/* <ConservationList category="priority" /> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight || 0,
    },
});
export default ConversationScreen;
