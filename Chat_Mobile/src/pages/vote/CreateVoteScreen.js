import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet
} from 'react-native';

const CreateVoteScreen = ({ navigation, route }) => {
  const [options, setOptions] = useState(['Phương án 1', 'Phương án 2']);
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [canAddOption, setCanAddOption] = useState(true);
  const [hideVoters, setHideVoters] = useState(false);
  const [hideResultsBeforeVote, setHideResultsBeforeVote] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đặt câu hỏi bình chọn</Text>
      {options.map((option, index) => (
        <View key={index} style={styles.optionRow}>
          <TextInput
            style={styles.input}
            value={option}
            onChangeText={(text) => updateOption(text, index)}
            placeholder={`Phương án ${index + 1}`}
          />
          <TouchableOpacity onPress={() => removeOption(index)}>
            <Text style={styles.remove}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {canAddOption && (
        <TouchableOpacity onPress={addOption}>
          <Text style={styles.addOption}>+ Thêm phương án</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Tuỳ chọn</Text>

      <View style={styles.option}>
        <Text>Ẩn người bình chọn</Text>
        <Switch value={hideVoters} onValueChange={setHideVoters} />
      </View>

      <View style={styles.option}>
        <Text>Ẩn kết quả khi chưa bình chọn</Text>
        <Switch value={hideResultsBeforeVote} onValueChange={setHideResultsBeforeVote} />
      </View>

      <View style={styles.option}>
        <Text>Chọn nhiều phương án</Text>
        <Switch value={allowMultiple} onValueChange={setAllowMultiple} />
      </View>

      <View style={styles.option}>
        <Text>Có thể thêm phương án</Text>
        <Switch value={canAddOption} onValueChange={setCanAddOption} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { marginTop: 20, fontWeight: 'bold', fontSize: 16 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8
  },
  remove: {
    marginLeft: 8,
    color: 'red',
    fontSize: 18
  },
  addOption: {
    color: '#007bff',
    // marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default CreateVoteScreen;
