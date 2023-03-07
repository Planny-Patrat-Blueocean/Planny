import { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constants/ColorScheme';


type PostProps = {
  username: string;
  time: string;
  topic: string;
  photos: string[];
  plantType: string;
  plantName: string;
  likes: number;
  replies: number;
};

export default function PostEntry(props: PostProps) {
  const {
    username,
    time,
    topic,
    photos,
    plantType,
    plantName,
    likes,
    replies,
  } = props;

  const onLikePress = () => {
    console.log('like + 1')
  };
  const onReplyPress = () => {
    console.log('reply + 1')
  };
  const onSharePress = () => {
    console.log('share + 1')
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.postUsername}>{username}</Text>
      </View>
      <View style={styles.posttopic}>
        <View style={styles.postPhotoContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <Image source={{ uri: photo }} style={styles.postPhoto} key={index} />
            ))}
          </ScrollView>
        </View>
        <Text>{topic}</Text>

      </View>
      <View style={styles.postFooter}>
        <TouchableOpacity onPress={onLikePress}>
          <Text>{likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReplyPress}>
          <Text>{replies} Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSharePress}>
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.posttime}>{time}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    // backgroundColor: Colors.porcelain,
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  postUsername: {
    fontWeight: 'bold',
  },
  posttime: {
    marginTop:5

  },
  posttopic: {
    marginBottom: 5,
  },

  postPhotoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height:210,
    marginBottom:5
  },
  postPhoto: {
    height: 200,
    width: 200,
    marginRight:20,
    borderRadius: 10
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});