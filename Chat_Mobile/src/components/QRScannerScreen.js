import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { saveQaCode } from '../api/qaCode';
import { getToken } from '../utils/authHelper';

export default function QRScannerScreen({ route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();

  const { userId } = route.params;
  console.log("userId", userId);
  
  const handleBarCodeScanned = async ({ data }) => {

    const token =  await getToken();

    if (scanned || loading) return;

    setScanned(true);
    setScannedData(data);
    setLoading(true);

    const success = await saveQaCode(data, userId, token);
    console.log("success", success);
    console.log("data", data);
    console.log("userId------------------------", userId);
    console.log("token------------------", token);

    setLoading(false);

    if (success) {
      Alert.alert("Thành công", "Cho phép đăng nhập trên laptop nhoa.", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack(); //  Quay về màn hình trước
          }
        }
      ]);
    } else {
      Alert.alert("Lỗi", "Không gửi được session ID.");
    }

    // Cho phép quét lại sau 5 giây (nếu cần giữ màn hình ở lại)
    setTimeout(() => {
      setScanned(false);
      setScannedData(null);
    }, 5000);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Chưa có quyền truy cập camera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.resultBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.resultText}>
            {scannedData ? `Session ID: ${scannedData}` : 'Quét mã QR để gửi session ID:'}
            {userId ? ` ${userId}` : ''}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  resultBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'tomato',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

/*
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { saveQaCode } from "../api/qaCode";

export default function QRScannerScreen({ route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();

  const { userId } = route.params;
  console.log("userId", userId);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || loading) return;

    setScanned(true);
    setScannedData(data);
    setLoading(true);

    const success = await saveQaCode(data, userId);

    setLoading(false);

    if (success) {
      Alert.alert("Thành công", "Cho phép đăng nhập trên laptop.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Lỗi", "Không gửi được session ID.");
    }

    setTimeout(() => {
      setScanned(false);
      setScannedData(null);
    }, 5000);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Chưa có quyền truy cập camera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View style={styles.resultBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.resultText}>
            {scannedData ? `Session ID: ${scannedData}` : "Quét mã QR để gửi session ID"}
            {userId ? `\nUser: ${userId}` : ""}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  resultBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    alignItems: "center",
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "tomato",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
});

*/