import * as React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ReactLoading from 'react-loading';

import Styles from '../constants/Styles';
import ColorScheme from '../constants/ColorScheme';
import { RootStackParamList } from '../../RootStack';
import axios from 'axios';
import { PORT } from '@env';
import { UserContext } from '../../App';

type CreateHouseScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
const SERVER = `http://localhost:${PORT}`

export default function CreateHouseScreen() {
  const [image, setImage] = React.useState<String>('');
  const [newGroup, setNewGroup] = React.useState<String>('');
  const [loading, setLoading] = React.useState<Boolean>(false);
  const navigation = useNavigation<CreateHouseScreenNavigationProp>();
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    setImage(require('../../assets/budew.png'));
  }, []);

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => { resolve(reader.result); };
      reader.readAsDataURL(blob);
    });
  };

  async function userPickImage() {
    const image = await launchImageLibraryAsync();
    let base64Data;
    if (!image.canceled) {
      const data = await fetch(image.assets[0].uri);
      const blob = await data.blob();
      base64Data = await blobToBase64(blob);
    }
    const formData = new FormData();
    await formData.append('file', base64Data);
    await formData.append('upload_preset', 'o9exuyqa');
    await axios.post('https://api.cloudinary.com/v1_1/dsiywf70i/image/upload', formData)
      .then((res) => { setImage(res.data.secure_url); })
      .catch((err) => { console.log('could not post to cloudinary', err) })
  }

  function loadingScreen() {
    if (loading) {
      return (
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <ReactLoading type="bars" color='#2F7A3E' height={'30%'} width={'30%'}/>
      </View>
      )
    }
  }

  function textInputHandler(e) {
    setNewGroup(e.target.value);
  }
  async function buttonHandler() {
    setLoading(true);
    if (!user) { return }
    const bod = {
      "userId": user['userId'],
      "household": {
        "householdName": newGroup
      }
    }
    if (image !== '') {
      bod['household']['photo'] = image;
    }
    setNewGroup('');
    const output = await axios.post(`${SERVER}/db/household`, bod);
    const newId = output.data['householdId'];
    setLoading(false);
    navigation.navigate('HouseGroup', {screen: 'HouseGroup', p: {groupName: newGroup, groupId: newId, groupPhoto: image}});
  }

  return (
    <View style={Styles.container}>
      <View>
        <Image source={image as any} style={{height: 200, width: 200, borderRadius: 100, overflow:"hidden", resizeMode: 'cover', borderWidth: 1}}/>
        <TouchableOpacity style={tempStyling.TOpacity}>
          <MaterialCommunityIcons name="file-image-plus" size={24} color='black'
          onPress={userPickImage}/>
        </TouchableOpacity>
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 30, paddingTop: 15}}>
        Create a New House
      </Text>
      <View style={{height: 200, width: 200, margin: 20}}>
        <TextInput
          style={tempStyling.TInput}
          placeholder="Name..." placeholderTextColor={'grey'}
          onChange={textInputHandler} maxLength={15}
        />
        <Button onPress={buttonHandler} title="Create" type="outline"
            buttonStyle={{paddingVertical: 7, borderColor: '#1D9D51', borderWidth: 2, borderRadius: 15}}
            titleStyle={{color: '#1D9D51', fontWeight: 'bold'}}
          />
        {loadingScreen()}
      </View>
    </View>
  );
}

const tempStyling = StyleSheet.create({
  TInput: {
    height: 40, marginBottom: 30,
    borderBottomWidth: 1,
    textAlign: 'center',
    overflow: 'hidden', padding: 10
  },
  TOpacity: {
    height: 50, width: 50,
    borderRadius:25, overflow:'hidden',
    backgroundColor: ColorScheme.porcelain, zIndex: 1,
    position: 'absolute',
    alignItems:'center', justifyContent:'center',
    bottom: 0, right: 30}
})
