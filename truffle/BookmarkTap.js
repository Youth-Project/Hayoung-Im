import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, TextInput, FlatList} from 'react-native';
import { addBookmark, getBookmarkedRecipes } from './recipeFunctions';

const BookmarkTab = ({ userId, navigation }) => {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  useEffect(() => {
    fetchBookmarkedRecipes(userId);
  }, [userId]);

  const fetchBookmarkedRecipes = async (userId) => {
    try {
      const recipes = await getBookmarkedRecipes(userId);
      setBookmarkedRecipes(recipes);
    } catch (error) {
      console.error('북마크 레시피를 가져오는데 실패했습니다.', error);
    }
  };

  const handleAddBookmark = async (recipeId) => {
    try {
      await addBookmark(userId, recipeId);
      fetchBookmarkedRecipes(userId);
    } catch (error) {
      console.error('북마크에 레시피를 추가하는데 실패했습니다:', error);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View>
        {/* Display your bookmarked recipes here */}
        {bookmarkedRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.post}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}>
            <Image source={{ uri: recipe.image }} style={{ width: 118, height: 66, left: 12, top: 11, borderRadius: 7 }} />
            <Text style={styles.foodText}>{recipe.name}</Text>
            <View style={{ left: 12, top: 15 }}>
              <Text style={styles.lackingText}>{recipe.lacking}{recipe.lackMore} 부족</Text>
            </View>
            <Text style={styles.timeText}>{recipe.time} 분</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
    backgroundColor: '#F8F9FA', // 배경색상 추가
    height: 'auto',
  },
  containerScroll: {
    top: 90,
    backgroundColor: '#F8F9FA', // 배경색상 추가
    height: 'auto',
  marginBottom: 170,
  },
  cont: {
    flexDirections: 'row',
    justifyContent: 'center',
    felxWrap: 'wrap',
  },
  post: {
    position: 'relative',
    width: 141,
    height: 154,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 3,
    alignContent: 'flex-start',
    shadowColor: "#000000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  foodText: {
    top: 14,
    paddingLeft: 12,
    fontWeight: 'bold',
  },
  lackingText: {
    paddingLeft: 2,
    bottom: 7,
    color: '#E50000',
    fontSize: 10,
    fontFamily: 'NanumGothic',
  },
  timeText: {
    paddingLeft: 10,
    top: 10,
    color: '#000',
    fontSize: 12,
    margin: 5,
    fontFamily: 'NanumGothic',
  },
  row: {
    flexDirection: 'row', 
    display:'flex',
    flexWrap:'wrap',
    justifyContent: 'space-around', 
    position: 'relative', 
    paddingHorizontal: 40, 
    paddingBottom: 80, 
    gap: 20,
    
  },
});

export default BookmarkTab;
