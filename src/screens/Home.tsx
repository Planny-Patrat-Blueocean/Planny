import * as React from 'react';
import { View, Text, Image, Button, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Styles from '../constants/Styles';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const p = {
  groupName: 'Existing Group 1',
  plants: { cactus: 'living room', aloe: 'bathroom' },
  groupId: '0987654321',
};
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <ScrollView>
      <View style={Styles.container}>
        <Button
          title="My Plants"
          onPress={() => navigation.navigate('MyPlants')}
        />
        <Button
          title="Patrat's House Plants"
          onPress={() => {
            console.log("Pressed Patrat's House Plants");
            navigation.navigate('HouseGroup', { screen: 'HouseGroup', p });
          }}
        />
      </View>
      <View style={Styles.container}>
        <Image
          style={Styles.logo}
          source={require('../../assets/PlannyLogo.png')}
        />
        <Button
          title="Go to MESSAGES"
          onPress={() => navigation.navigate('Messages')}
        />
        <Button
          title="Create House"
          onPress={() => navigation.navigate('CreateHouse')}
        />
        <Button
          title="Join House"
          onPress={() => navigation.navigate('JoinHouse')}
        />
        <Button title="Sign up" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </ScrollView>
  );
}
