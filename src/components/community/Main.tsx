import { useState } from 'react';
import { View, Text, ScrollView, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { CommunityStackParamList } from '../../screens/Community';
import PostEntry from './PostEntry';
import Colors from '../../constants/ColorScheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

type MainScreenNavigationProp = NativeStackNavigationProp<CommunityStackParamList, 'Community'>;

type post = {
  username: string;
  time: string;
  topic: string;
  photos: string[];
  plantType: string;
  plantName: string;
  likes: number;
  replies: number;
};

export default function MainScreen() {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const onSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const [posts, setPosts] = useState<post[]>([
    {
      username: 'Nathanael Tjen',
      time: '2023-03-05',
      topic: 'Don’t use hot water for your plants',
      photos: ['https://secure.img1-cg.wfcdn.com/im/70455228/scale-w300%5Ecompr-r70/2176/217692118/default_name.jpg', 'https://secure.img1-cg.wfcdn.com/im/59356836/resize-h800-w800%5Ecompr-r85/1434/143429039/Aloe+Vera+Plant+in+Basket.jpg'],
      plantType: 'Succulent',
      plantName: 'Aloe Vera',
      likes: 10,
      replies: 1,
    },
    {
      username: 'Jessica Vu',
      time: '2023-03-03',
      topic: 'Put your plants in the sun or something idk',
      photos: ['https://jayscotts.com/wp-content/uploads/2020/12/indoor-flowers-for-beginners-3.jpg','https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1653591340-christmas-cactus-royalty-free-image-1568922653.jpg'],
      plantType: 'Succulent',
      plantName: 'Aloe Vera',
      likes: 10,
      replies: 1,
    },

    {
      username: 'Erik Newland',
      time: '2023-03-02',
      topic: 'Check out my awesome Cactus!',
      photos: ['https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/types-of-cactus-section-1.jpg', 'https://www.ftd.com/blog/wp-content/uploads/2018/07/types-of-cactus-hero.jpg', 'https://secure.img1-cg.wfcdn.com/im/56520246/resize-h445%5Ecompr-r85/2247/224789930/14%27%27+Faux+Cactus+Tree+in+Ceramic+Pot.jpg','https://secure.img1-fg.wfcdn.com/im/36176888/resize-h445%5Ecompr-r85/1209/120991332/14%27%27+Faux+Cactus+Tree+in+Ceramic+Pot.jpg'],
      plantType: 'Succulent',
      plantName: 'Cactus',
      likes: 5,
      replies: 10,
    },

    {
      username: 'Sandy Chu',
      time: '2023-02-01',
      topic: 'This is my first post!',
      photos: ['https://i.etsystatic.com/16989532/r/il/63b3a3/3421737845/il_1588xN.3421737845_26sl.jpg', 'https://i.etsystatic.com/16989532/r/il/4b15b5/1511638992/il_fullxfull.1511638992_32hu.jpg'],
      plantType: 'Succulent',
      plantName: 'Aloe Vera',
      likes: 10,
      replies: 1,
    },
    {
      username: 'Quanjing Chen',
      time: '2023-01-01',
      topic: 'If your plant seems sad, give it a little pep talk',
      photos: ['https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/A600023662_1?$AFHS-PDP-Main$','https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/types-of-cactus-section-6.jpg'],
      plantType: 'Succulent',
      plantName: 'Aloe Vera',
      likes: 10,
      replies: 1,
    },
  ]);
  posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());


  return (
    <View style={styles.container} >
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search a plant type"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.addPost} onPress={() => navigation.navigate('AddPost')}>
          <Text style={styles.addPostText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

        {posts.map((post, index) => (
          <PostEntry
            key={index}
            username={post.username}
            time={post.time}
            topic={post.topic}
            photos={post.photos}
            plantType={post.plantType}
            plantName={post.plantName}
            likes={post.likes}
            replies={post.replies}
          />
        ))}
      </ScrollView>

      <Button
        title="Show Comment"
        onPress={() => navigation.navigate('Comment')}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 5,
    alignSelf: 'center',
  },
  searchInput: {
    height: 30,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 15,
    width: '50%',
  },
  button: {
    backgroundColor: Colors.sage,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 10,
    width: 60,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10
  },
  addPost: {
    backgroundColor: Colors.greenBlack,
    borderRadius: 30,
    marginLeft: 30,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addPostText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  }
})