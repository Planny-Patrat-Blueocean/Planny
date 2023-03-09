import { Text, View, Image, StyleSheet, TouchableOpacity, Button, Modal, Alert, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useState, Component, useEffect } from 'react'
const placeholder1 = require('./images/placeholder-1.jpeg')
const placeholder2 = require('./images/placeholder-2.webp')
const placeholder3 = require('./images/placeholder-3.png')
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Chatroom from './chatroom'
import { RootStackParamList } from '../../../RootStack';
import axios from 'axios'
import auth from '../../constants/firebase/firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type CreateHouseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Your Homes'>;

export default function MessageGroupList() {

  const navigation = useNavigation<CreateHouseScreenNavigationProp>();


  const [homes, setHomes] = useState([{householdName: 'Mom\'s house', lastMessage: 'I watered your flowers', lastMessager: 'PlantMama040', avatar: placeholder1}, {householdName:  'Dorm', lastMessage: 'bro my cactus!', lastMessager: 'Todd', avatar: placeholder3}, {householdName: 'Grandma\'s house', lastMessage: 'How do I care for a succulent?', lastMessager: 'GreenGranny', avatar: placeholder2}])
  // ADD NEW HOUSE
  const [modalVisible, setModalVisible] = useState(false);
  const [houseName, setHouseName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [dbMessageId, setDbMesageId] = useState(null);
  const [offlineRoom, setOfflineRoom] = useState('')

  //ADD NEW HOUSE
  const handleHouseNameChange = (text) => {
    setHouseName(text);
  };

  //ADD NEW MEMBERS
  const handleMemberNameChange = (text) => {
    setMemberName(text);
  };

  const addMember = () => {
    setMembers([...members, memberName]);
    setMemberName('');
  };

  //CREATE NEW HOME
  const createHome = () => {
    setHomes([...homes, {householdName: houseName, lastMessage: 'test', lastMessager: 'test', avatar: placeholder2, householdMembers: members }])
    setModalVisible(false)
    //setHouseName('');
    setMemberName('');
    setMembers([]); //userId below will be from auth context
    axios.post('http://localhost:3100/db/household', {userId: 'try1', household: {
      householdName: houseName,
      photo: '',
    }
  }).then(({data}) => {
    console.log(data.messageId);
    setDbMesageId(data.messageId)
  })
  }

  const convertToUnixTimestamp = (dateTimeString) => {
    let dateTimeStringArray = dateTimeString.split(" ");
    let month = dateTimeStringArray[1];
    let day = dateTimeStringArray[2];
    let time = dateTimeStringArray[4];
    let year = new Date().getFullYear();

    let dateTimeStringFormatted = `${month} ${day} ${year} ${time}`;

    return Date.parse(dateTimeStringFormatted);
  }

  const evaluateDataArray = (dataArray) => {
    const lastObjectTime = convertToUnixTimestamp(dataArray[dataArray.length - 1].time);
    console.log(dataArray)
    const currentTime = Date.now();
    const timeDifference = currentTime - lastObjectTime;
    console.log('current time', currentTime)
    console.log('last message time:', lastObjectTime)
    console.log('difference', timeDifference)
    if (timeDifference > 66412630) {
      console.log('user is offline');
      setOfflineRoom(true);
    } else {
      setOfflineRoom(false);
    }
  };


  // CHANGE NAVIGATION TITLE ON BACK

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ title: 'Your Homes'})
    }, [])
  );

  // useEffect(() => {
  //   axios.get('http://localhost:3100/db/message', {params: { messageId: 4}})
  //     .then(({data}) => {
  //     // console.log(data[0].messages)
  //     // setMessages(data[0].messages)
  //   })
  // }, [])

  useEffect(() => {
    // console.log(auth)
    // in params
// {
//   "householdId": 1
// }                       //this householdID is returned when we create room
  axios.get('http://localhost:3100/db/household', {params: {householdId: 4}}).then(({data}) => {
    console.log(data)
    setHomes([...homes, ...data])
  })
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 10, maxHeight: '90%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,}}>
      <Text style={{marginBottom: 25}}>Your Houses</Text>
      {homes.map((home, index) => (
          <TouchableOpacity
          key={home.householdName}
          onPress={() => {
            // Navigate to ChatRoomat page
            navigation.setOptions({
              title: home.householdName
            });
            navigation.navigate('ChatRoom', { homeLocation: home.householdName });
            console.log('testing pressing and opacity', home)
            console.log(homes)
          }}
        >
        <View key={home.householdName} style={{flexDirection: 'row', borderWidth: 0, borderColor: 'black', padding: 10, margin: 10, borderRadius: 20, marginBottom: 25, backgroundColor: index % 2 === 0 ? '#C6D5BE' : '#B7DBDB'}}>
          <Image source={home.avatar} style={{width: 50, height: 50, borderRadius: 25}} />
          <View style={{marginLeft: 10, marginBottom: 5}}>
            <Text style={{fontWeight: 'bold', textDecoration: 'underline', fontSize: '20px', }}>{home.householdName}</Text>
            <View style={{maxWidth: 200}}>
              <Text style={{fontSize: '16px'}}>{home.lastMessager}</Text>
              <Text>{home.lastMessage}</Text>
            </View>
          </View>
          <View style={{position: 'absolute',  right: 20, bottom: 22}}>
          {/* {index === 1 &&
          // <MaterialCommunityIcons
          //         name="circle-medium"
          //         size={40}
          //         color={offlineRoom}
          //       />
          <LinearGradient
          colors={offlineRoom ? ['#5AFF15', '#5AFF15', '#5AFF15D8'] : ['#FF0000', '#FF0000', '#FF0000D8']}
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          style={styles.circle}
        />
          } */}
          </View>
        </View>
        </TouchableOpacity>
      ))}
      </ScrollView>
      {/* <Chatroom/> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
          setHouseName('');
          setMemberName('');
          setMembers([]);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Pressable
              style={[styles.button, styles.buttonClose, styles.test]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}> &#x2716;</Text>
            </Pressable>
            <Text>House Name</Text>
              <TextInput
                style={{ borderWidth: 2, borderColor: '#C6D5BE', padding: 10, borderRadius: 10, marginBottom: 5  }}
                value={houseName}
                onChangeText={handleHouseNameChange}
              />
            <Text>Add a Member</Text>
              <TextInput
                style={{ borderWidth: 2, borderColor: '#C6D5BE', padding: 10, borderRadius: 10, marginBottom: 5 }}
                value={memberName}
                onChangeText={handleMemberNameChange}
              />

              <View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                {members.map((member) => (
                  <Text key={member} style={{margin: 8}}>{member}</Text>
                  ))}
                  </View>
              </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={addMember}>
            <Text style={styles.textStyle}>Add Member</Text>
              </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => createHome()}>
              <Text style={styles.textStyle}>Create your Home!</Text>
            </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{position: 'absolute', bottom: 10, left: 0, right: 0, backgroundColor: '#B7DBDB'}}>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Create Home</Text>
      </Pressable>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column', // inner items will be added vertically
        // all the available vertical space will be occupied by it
    // justifyContent: 'space-between', // will create the gutter between body and footer
    position: 'relative',
    backgroundColor: '#B7DBDB'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#B7DBDB',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#C6D5BE',
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  buttonClose: {
    backgroundColor: '#C6D5BE',
  },
  textStyle: {
    color: '#2A2B2A',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 'auto',
    padding: 0,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  test: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    backgroundColor: 'none'
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'linear-gradient(45deg, #5AFF15 0%, #5AFF15 40%, #5AFF15D8 100%)',
  }
})