import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, TextInput, FlatList} from 'react-native';
import { addRecipeToCollection, orderByKorean, refrigeratorOrderByLack, getRefrigeratorIngredients, getBookmarkedRecipes } from './recipeFunctions';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const RecipeTab = () => {
  const [showUserRecipes, setShowUserRecipes] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [refrigeratorIngredients, setRefrigeratorIngredients] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  useEffect(() => {
    fetchRecipeData();
    fetchRefrigeratorIngredients();
    fetchBookmarkedRecipes();
  }, []);

const handleAddRecipe = () => {
  navigation.navigate('AddUserRecipeView');
  console.log('레시피 추가 화면으로 이동');
  //여기에 레시피 데이터 받아오기
  addNewRecipe(newUserRecipeData);
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
        steps: data.recipe_steps,
        ingredients: data.recipe_ingredients,
        image: data.recipe_image,
        difficulty: data.recipe_difficulty,
        time: data.recipe_time,
      });
    });
    setRecipeData(recipes);
  } catch (error) {
    console.error('레시피 데이터를 가져오는데 실패했습니다:', error);
  }
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

const filteredRecipeData = showUserRecipes ? userRecipes : recipeData;
  
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
              <Image source={{ uri: "https://via.placeholder.com/118x66" }}
                style={{ width: 118, height: 66, left: 12, top: 11, borderRadius: 7 }}
              />
              <Text style={styles.foodText}>{recipe.food}</Text>
              <View style={{ left: 12, top: 15 }}>
                <Image source={require("./assets/lack.svg")}
                  style={{ width: 10, height: 11.1, left: 3 }}
                />
                <Text style={styles.lackingText}>{recipe.lacking}{recipe.lackMore} 부족</Text>
              </View>
              <Text style={styles.timeText}>{recipe.time} 분</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    <View style={styles.container}>
      <ScrollView style={styles.containerScroll}>
        <View style={styles.row}>
          {/* Recipe list */}
          {filteredRecipeData.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.post}
              onPress={() => console.log('Navigate to Recipe Detail:', recipe.id)}>
              <Image source={{ uri: "https://via.placeholder.com/118x66" }}
                style={{ width: 118, height: 66, left: 12, top: 11, borderRadius: 7 }}
              />
              <Text style={styles.foodText}>{recipe.food}</Text>
              <View style={{ left: 12, top: 15 }}>
                <Image source={require("./assets/lack.svg")}
                  style={{ width: 10, height: 11.1, left: 3 }}
                />
                <Text style={styles.lackingText}>{recipe.lacking}{recipe.lackMore} 부족</Text>
              </View>
              <Text style={styles.timeText}>{recipe.time} 분</Text>
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
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
