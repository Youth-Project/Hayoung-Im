import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView, 
  StyleSheet, 
  Image
} from 'react-native';
import firebase from 'firebase';

const RecipeInfoView = ({ navigation }) => {
  const [recipeInfo, setRecipeInfo] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  useEffect(() => {
    const fetchRecipeInfo = async () => {
      try {
        const recipeId = navigation.getParam('recipeId');
        const recipeDoc = await firebase.firestore().collection('recipes').doc(recipeId).get();

        if(recipeDoc.exists) {
          const recipeData = recipeDoc.data();
          setRecipeInfo(recipeData);
        } else {
          console.error('Recipe not found!');
        }
      } catch (error) {
        console.error('Failed to fetch recipe: ', error);
      }
    };

    const fetchRecipeIngredients = async () => {
      try {
        const recipeId = navigation.getParam('recipeId');
        const recipeDoc = await firebase.firestore().collection('recipes').doc(recipeId).get();

        if (recipeDoc.exists) {
          const recipeData = recipeDoc.data();
          const ingredients = recipeData.recipe_ingredients || [];
          setRecipeIngredients(ingredients);
        } else {
          console.error('Recipe not found!');
        }
      } catch (error) {
        console.error('Failed to fetch recipe ingredients: ', error);
      }
    };

    fetchRecipeInfo();
    fetchRecipeIngredients();
  }, []);

  if (!recipeInfo || !recipeIngredients) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { recipe_name, recipe_time, recipe_difficulty, recipe_image_url } = recipeInfo;
  const hours = recipe_time[0];
  const minutes = recipe_time[1];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleStartCooking = () => {
    const recipeId = navigation.getParam('recipeId');
    navigation.navigate('RecipeStepsView', { recipeId });
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: recipe_image_url }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeName}>{recipe_name}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>재료</Text>
          <ScrollView style={styles.ingredientsList}>
            {recipeIngredients.map((ingredient, index) => {
              const [name, quantity, unit] = ingredient.split(' ');
              return (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientName}>{name}</Text>
                  <Text style={styles.ingredientQuantity}>{quantity} {unit}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>조리 시간</Text>
          <Text>{hours} 시간 {minutes} 분</Text>
          <Text style={styles.sectionTitle}>난이도</Text>
          <Text>{recipe_difficulty}</Text>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.button}
          onPress={handleStartCooking}>
          <Text style={styles.buttonText}>조리하기</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  ingredientsContainer: {
    flex: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ingredientsList: {
    maxHeight: 200,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  ingredientName: {
    flex: 1,
  },
  ingredientQuantity: {
    marginLeft: 10,
  },
  additionalInfo: {
    flex: 1,
    marginLeft: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeInfoView;
