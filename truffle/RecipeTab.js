import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, TextInput, FlatList} from 'react-native';
import { addRecipeToCollection, orderByKorean, refrigeratorOrderByLack, getRefrigeratorIngredients, addLackToCollection, compareIngredients } from './recipeFunctions';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeTab = () => {
  const [showUserRecipes, setShowUserRecipes] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [refrigeratorIngredients, setRefrigeratorIngredients] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  useEffect(() => {
    fetchRecipeData();
    fetchRefrigeratorIngredients();
    fetchBookmarkedRecipes();
    fetchRecipeFromStorage();
  }, []);

  const saveRecipeToStorage = async (recipeData) => {
  try {
    await AsyncStorage.setItem('recipeData', JSON.stringify(recipeData));
    console.log('레시피 데이터가 AsyncStorage에 저장되었습니다.');
  } catch (error) {
    console.error('레시피 데이터를 저장하는데 실패했습니다:', error);
  }
};

const fetchRecipeFromStorage = async () => {
  try {
    const recipeData = await AsyncStorage.getItem('recipeData');
    if (recipeData !== null) {
      return JSON.parse(recipeData);
    } else {
      console.log('저장된 레시피 데이터가 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('레시피 데이터를 가져오는데 실패했습니다:', error);
    return null;
  }
};

const handleToggleSwitch = () => {
  setShowUserRecipes((prev) => !prev);
};

const fetchRecipeData = async() => {
  const db = getFirestore();
  const recipeCollections = collection(db, 'recipes');

  try{
    const querySnapshot = await getDocs(recipeCollections);
    const recipes = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: data.recipe_id,
        name: data.recipe_name,
        ingredients: data.recipe_ingredients,
        image: data.recipe_image,
        time: data.recipe_time,
      });
    });
    setRecipeData(recipes);
  } catch (error) {
    console.error('레시피 데이터를 가져오는데 실패했습니다:', error);
  }
};

const displayLackingIngredients = async (recipeId, recipeIngredients) => {
  const lackingIngredients = compareIngredients(refrigeratorIngredients, recipeIngredients);
  if (lackingIngredients.length > 0){
    try{
      const lackId = await addLackToCollection({ recipeId, lackingIngredients });
      console.log('Lack added with ID: ', lackId);
    } catch (error) {
      console.error('Error adding lack: ', error);
    }
  }
  return lackingIngredients.join(', ');
};
  
const handleSortOrder = async (orderType) => {
  switch (orderType) {
    case 'korean':
      const koreanOrder = await orderByKorean();
      setRecipeData(koreanOrder);
      break;
    case 'lack':
      const lackOrder = await refrigeratorOrderByLack(refrigeratorIngredients);
      setRecipeData(lackOrder);
      break;
    default:
      break;
  }
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerScroll}>
        <View style={styles.row}>
          {/* Recipe list */}
          {recipeData.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.post}
              onPress={() => console.log('Navigate to Recipe Detail:', recipe.id)}>
              <Image source={{ uri: recipe.image }}
                style={{ width: 118, height: 66, left: 12, top: 11, borderRadius: 7 }}
              />
              <Text style={styles.foodText}>{recipe.name}</Text>
              <View style={{ left: 12, top: 15 }}>
                <Image source={require("./assets/lack.svg")}
                  style={{ width: 10, height: 11.1, left: 3 }}
                />
                <Text style={[styles.lackingText}, { color: 'red'}]>{displayLackingIngredients(recipe.id, recipe.ingredients)} 부족</Text>
              </View>
              <Text style={styles.timeText}>{recipe.time[0]} 시간 {recipe.time[1]} 분</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    
      {/* Filtering and Sorting Controls */}
      <View style={styles.controls}>
        <View style={styles.filterSwitchContainer}>
          <Text>Show User Recipes</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={showUserRecipes ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleSwitch}
            value={showUserRecipes}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={fetchRecipeFromStorage}>
          <Text style={styles.addButtonText}>Add Recipe</Text>
        </TouchableOpacity>
        <View style={styles.sortButtons}>
          <TouchableOpacity style={styles.sortButton} onPress={() => handleSortOrder('korean')}>
            <Text>Sort by Korean</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton} onPress={() => handleSortOrder('lack')}>
            <Text>Sort by Lack</Text>
          </TouchableOpacity>
          {/* Add more sorting buttons as needed */}
        </View>
      </View>
    </View>
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

export default RecipeTab;
