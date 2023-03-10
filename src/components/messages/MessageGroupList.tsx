import { Text, View, Image, StyleSheet, TouchableOpacity, Button, Modal, Alert, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useState, Component, useEffect, useContext } from 'react'
const placeholder1 = require('./images/placeholder-1.jpeg')
const placeholder2 = require('./images/placeholder-2.webp')
const placeholder3 = require('./images/placeholder-3.png')
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Chatroom from './chatroom'
import { RootStackParamList } from '../../../RootStack';
import axios from 'axios'
import auth from '../../constants/firebase/firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../../App';

import { RouteProp, useFocusEffect } from '@react-navigation/core';

type CreateHouseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Your Homes'>;

export default function MessageGroupList(route) {

  const navigation = useNavigation<CreateHouseScreenNavigationProp>();
  const { user, setUser } = useContext(UserContext);
  const [messageID, setMessageID] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  //Dummy room data in state for now
  const [homes, setHomes] = useState([])
  // ADD NEW HOUSE (No Longer in use)
  const [modalVisible, setModalVisible] = useState(false);
  const [houseName, setHouseName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [dbMessageId, setDbMesageId] = useState(null);
  const [offlineRoom, setOfflineRoom] = useState('')
  const[bool, SetBool] = useState(null)

  // Fake House DATA
  // {householdName: 'Mom\'s house', lastMessage: 'I watered your flowers', lastMessager: 'PlantMama040', avatar: placeholder1}, {householdName:  'Dorm', lastMessage: 'bro my cactus!', lastMessager: 'Todd', avatar: placeholder3}, {householdName: 'Grandma\'s house', lastMessage: 'How do I care for a succulent?', lastMessager: 'GreenGranny', avatar: placeholder2}


  //ADD NEW HOUSE (No Longer in use)
  const handleHouseNameChange = (text) => {
    setHouseName(text);
  };

  //ADD NEW MEMBERS (No Longer in use)
  const handleMemberNameChange = (text) => {
    setMemberName(text);
  };

  const addMember = () => {
    setMembers([...members, memberName]);
    setMemberName('');
  };

  //CREATE NEW HOME (No Longer in use)
  const createHome = () => {
    setHomes([...homes, {householdName: houseName, lastMessage: 'test', lastMessager: 'test', avatar: placeholder2, householdMembers: members }])
    setModalVisible(false)
    //setHouseName('');
    setMemberName('');
    setMembers([]); //userId below will be from auth context
    axios.post('http://localhost:3000/db/household', {userId: user.userId, household: {
      householdName: houseName,
      photo: '',
    }
  }).then(({data}) => {
    console.log(data.messageId);
    setDbMesageId(data.messageId)
  })
  }

  // Helper function to convert my stored date format to unix for time comparison
  const convertToUnixTimestamp = (dateTimeString) => {
    let dateTimeStringArray = dateTimeString.split(" ");
    let month = dateTimeStringArray[1];
    let day = dateTimeStringArray[2];
    let time = dateTimeStringArray[4];
    let year = new Date().getFullYear();

    let dateTimeStringFormatted = `${month} ${day} ${year} ${time}`;

    return Date.parse(dateTimeStringFormatted);
  }

  // Function to implement a timer that turns a circle red/green depending on time since last message...time difference needs work.
  const evaluateDataArray = (dataArray) => {
    const lastObjectTime = convertToUnixTimestamp(dataArray[dataArray.length - 1].time);
    console.log(dataArray)
    const currentTime = Date.now();
    const timeDifference = currentTime - lastObjectTime;
    console.log('current time', currentTime)
    console.log('last message time:', lastObjectTime)
    console.log('difference', timeDifference)
    if (timeDifference > 664126) {
      console.log('user is offline');
      setOfflineRoom(true);
    } else {
      setOfflineRoom(false);
    }
  };

  const removeLetters = (str) => {
    return Number(str.replace(/[^0-9]/g, ''));
  }


  // CHANGE NAVIGATION TITLE ON BACK

  // useFocusEffect(

  //   React.useCallback(() => {
  //     // navigation.setOptions({ title: ''})
  //     console.log('use focus test', user)
  //     let tempHomes = []
  //     if (user.household.length !== 0) {
  //     let allRooms = user.household.flat()
  //     for (var i = 0; i < allRooms.length; i++) {
  //       //console.log(allRooms[i])
  //       let z = i
  //       axios.get('http://localhost:3000/db/household', {params: {householdId: allRooms[i]}}).then(({data}) => {
  //         //console.log('this is msg id', data)
  //         setMessageID(data[0].messageId) //currently being overwritten
  //         // let temp = {householdName: 'data.householdName', lastMessage: '', lastMessager: ', avatar: data.photo}
  //         console.log(data)
  //         console.log([...data])
  //         //setHomes([...homes, ...data])
  //         tempHomes.push(data)
  //         setHomes(tempHomes.flat())
  //         //console.log('this is the bug:', data[0].messageId)
  //         axios.get('http://localhost:3000/db/message', {params: { messageId: data[0].messageId}}).then(({data}) => {
  //           //console.log('message data:', data[0].messages)
  //           for (var j = 0; j < data[0].messages.length; j++) {
  //             setMessages(data[0].messages[j])
  //           }
  //         }).catch((err) => console.error(err))
  //       })
  //     }
  //   }
  //   }, [])
  // );

  // useFocusEffect(

  //   React.useCallback(() => {
  //     for (var i = 0; i < user.household.length; i++) {
  //       // console.log(user.household[i])
  //       let z = i
  //       axios.get('http://localhost:3000/db/household', {params: {householdId: user.household[i]}}).then(({data}) => {
  //         console.log('this is msg id', data)
  //         setMessageID(data[z].messageId)
  //         // let temp = {householdName: 'data.householdName', lastMessage: '', lastMessager: ', avatar: data.photo}
  //         setHomes([...homes, ...data])
  //         axios.get('http://localhost:3000/db/message', {params: { messageId: data[z].messageId}}).then(({data}) => {
  //           console.log('message data:', data[0].messages)
  //           for (var j = 0; j < data[0].messages.length; j++) {
  //             setMessages(data[0].messages[j])
  //           }
  //         }).catch((err) => console.error(err))
  //       })
  //     }
  //   }, [])
  // );

  // Use Effect for Search Functionality, ideally loads all messages from user's rooms for sorting.
  // useEffect(() => {
  //   axios.get('http://localhost:3000/db/message', {params: { messageId: 5}}).then(({data}) => {
  //     console.log(data[0].messages)
  //     setMessages(data[0].messages)
  //   })
  // }, [])

  // Use Effect to get user's rooms.
  useEffect(() => {
    console.log(route)
    // Navigate to ChatRoomat page
    navigation.setOptions({
      title: '',
      headerLeft: null,
    });
      // console.log('all households', user.household)
      // console.log('all households, flattened', allRooms)
      let tempHomes = []
      let tempIDs = []
      if (user.household.length !== 0) {
      let allRooms = user.household.flat()
      for (var i = 0; i < allRooms.length; i++) {
        //console.log(allRooms[i])
        let z = i
        axios.get('http://localhost:3000/db/household', {params: {householdId: allRooms[i]}}).then(({data}) => {
          //setMessageId
          tempIDs.push(data[0].messageId)
          setMessageID(tempIDs) // currently overwriting to the last messageId
          // let temp = {householdName: 'data.householdName', lastMessage: '', lastMessager: ', avatar: data.photo}
          console.log(data)
          console.log([...data])
          //setHomes([...homes, ...data])
          tempHomes.push(data)
          setHomes(tempHomes.flat())
          //console.log('this is the bug:', data[0].messageId)
          axios.get('http://localhost:3000/db/message', {params: { messageId: data[0].messageId}}).then(({data}) => {
            //console.log('message data:', data[0].messages)
            for (var j = 0; j < data[0].messages.length; j++) {
              setMessages([...messages, data[0].messages[j]])
            }
          }).catch((err) => console.error(err))
        })
      }
    }
  }, [])

  // Handles Search Function
  const handleSearchSubmit = () => {
    console.log('this is homes we map: ', homes)
    console.log('this is all messages: ', messages)
    setSearchTerm('')
    const foundMessage = messages.message.includes(searchTerm)
    console.log(messages)
    if (foundMessage) {
      navigation.navigate('ChatRoom', { homeLocation: homes[0].householdName, messageID: messageID});
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 10, maxHeight: '90%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,}}>
      <Text style={{margin: 'auto', justifyContent: 'center', fontSize: 25}}>Your Houses</Text>
      {homes.map((home, index) => (
          <TouchableOpacity
          key={home.householdName}
          onPress={() => {
            // Navigate to ChatRoomat page
            navigation.setOptions({
              title: ''
            });
            navigation.navigate('ChatRoom', { messageID: messageID[index], homeLocation: home.householdName});
            // console.log('testing pressing and opacity', home)
            // console.log('this is homes: ', homes)
            // console.log('this is messages:', messages)
            console.log(messageID)
          }}
        >
        <View key={home.householdName} style={{flexDirection: 'row', borderWidth: 2, backgroundColor: 'white', padding: 10, margin: 10, borderRadius: 20, marginBottom: 25, borderColor: index % 2 === 0 ? 'green' : '#B7DBDB'}}>
          <Image source={home.photo} style={{width: 50, height: 50, borderRadius: 25, justifyContent: 'center', margin: 'auto'}} />
          <View style={{margin: 'auto', marginRight: 70, marginLeft: 15}}>
            <Text style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'center', marginTop: 10 }}>{home.householdName}</Text>
            <View style={{maxWidth: 200, flexDirection: 'row'}}>
              <Text style={{fontSize: '16px'}}>
                {messages.firstName &&
                messages.firstName + ' ' + messages.lastName + ':'
                }</Text>
              <Text style={{marginLeft: 5, marginTop: 0.5}}>{messages.message}</Text>
            </View>
            <Text style={{fontSize: 12}}>{messages.time}</Text>
          </View>
          <View style={{position: 'absolute',  right: 20, bottom: 22}}>
          {/* {index === 1 &&
          // <MaterialCommunityIcons
          //         name="magnify"
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
      <View style={{position: 'absolute', bottom: 10, left: 0, right: 0, backgroundColor: 'white'}}>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Create Home</Text>
      </Pressable> */}
      <View style={{display: 'flex', flexDirection: 'row'}}>
      <TextInput
        placeholder="Search messages"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{maxWidth: '80%', borderBottomWidth: 2, borderBottomColor: 'black', margin: 'auto', marginBottom: 5, marginRight: 0, textAlign: 'center'}}
      />
      <Pressable style={[styles.button, styles.buttonOpen, {marginRight: 100, marginLeft: 0}]} title="Search" onPress={handleSearchSubmit}>
      {/* <Text style={styles.textStyle}>Hello world</Text> */}
       <MaterialCommunityIcons
                  name="magnify"
                  size={40}
                  color={offlineRoom}
                />
        </Pressable>
        </View>
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
    backgroundColor: '#EFDBCA'
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
    width: 100,
    borderRadius: 20,
    padding: 5,
  },
  buttonOpen: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
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