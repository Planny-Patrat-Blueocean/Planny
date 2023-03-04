import * as React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Styles from '../constants/Styles';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <View style={Styles.container}>
      <Text>Hello from the HOME screen</Text>
      <Image
        style={Styles.budew}
        source={require('../../assets/budew.png')}
      />
      <Button
        title="Go to MESSAGES"
        onPress={() => navigation.navigate('Messages')}
      />
    </View>
  );
};