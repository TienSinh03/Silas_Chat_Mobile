import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  await AsyncStorage.setItem('accessToken', token);
  
};

export const getToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};
export const storeRefreshToken = async (token) => {
  await AsyncStorage.setItem('refreshToken', token);

};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem('refreshToken');
};

export const removeToken = async () => {
  console.log("removeToken")
  console.log(await AsyncStorage.getItem('accessToken'))
  await AsyncStorage.removeItem('accessToken');
  console.log(await AsyncStorage.getItem('accessToken'))
};


