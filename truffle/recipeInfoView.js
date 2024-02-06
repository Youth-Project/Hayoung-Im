{/* 재료박스 스크롤 하려는데 ScrollView 오류, 재료들 row로 해서 justifyContent center 하려는데 안됨, 재료랑 양이랑 margin 띄우면서 재료는 재료끼리 양은 양끼리 열맞추고 싶은데 잘안됨 */}
//잘 모르겠는데 여기...........;;;
import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  Text,
  Button,
  View,
  TouchableOpacity,
  ScrollView, 
  StyleSheet, 
  Alert, 
  Modal, 
  Image
} from 'react-native';
import firebase from 'firebase';

const recipeInfoView = ({ navigation }) => {
  const [recipeInfo, setRecipeInfo] = useState(null);

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

  if (!recipeInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

const RenderIngredients = () => {
    return recipeIngredients.map((ingredient, index) => {
      const [ingredientName, ingredientInfo] = ingredient.split('=');
      const [quantity, unit] = ingredientInfo.split('+');
      return (
        <Ingred key={index} ingred={ingredientName} num={quantity} unit={unit} />
      );
    });
  };

const { recipe_name, recipe_ingredients, recipe_time, recipe_difficulty } = recipeInfo;
const hours= recipe_time[0];
const minutes = recipe_time[1];
const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: recipeInfo.recipe_image_url }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeName}>{recipe_name}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>재료</Text>
          <ScrollView style={styles.ingredientsList}>
            {recipe_ingredients.map((ingredient, index) => {
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
    </View>
  );
}

    
 /*   <View style={styles.container}>

      <Image 
        source={{ uri: recipeInfo.recipe_image}}
        style={{
          top: 83,
          marginBottom: 20, 
          paddingTop: 4, 
          borderRadius: 7, 
          position: 'absolute', 
          backgroundColor: '#EDEDED', 
          width: 350, 
          height: 139,
        }}/>
      <Text style={styles.recipeName}>{recipe_name}</Text>

{/*<ScrollView style={{top: 100, height: 'auto'}}> */}
      <View
        style={{
          top: 240, 
          right: 130, 
          marginLeft: 10,
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          paddingLeft: 6, 
          paddingRight: 6, 
          paddingTop: 7, 
          paddingBottom: 7, 
          marginBottom: 17, 
          }}
> 
<Title food="닭볶음탕"/>
      </View>
<View
        style={{ right: 62, top: 240,
        backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    width: 215,
    height: 330,
    borderRadius: 10, }}>
        <Ingred ingred="아스파라거스" num="100" unit="ml"/>
        <Ingred ingred="표고버섯" num="2" unit="개" measure="70g"/>
      </View>
<View
        style={{ left: 115, bottom: 91,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 150,
    borderRadius: 10,
    marginBottom: 15, }}>
      <View style={{flexDirection: 'row', 
    justifyContent: 'center', top: 78,
          color: '#000',}}>
        <Time time="130"/>
    {/* 소요시간 */}
      </View>
      </View>

      <View
        style={{ left: 115, bottom: 91,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 166,
    borderRadius: 10, }}
        onPress={() => navigation.navigate('Recipe')}>
        <Text style={{
          top: 5,
          color: '#000000', 
        fontSize: 18, 
        textAlign: 'center',
        }}>
        난이도</Text>
      </View>

<View style={styles.row}>
      <TouchableOpacity
        style={{ top: 85,
        
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 10,
    width: 140,
    borderRadius: 25,
    marginBottom: 20, }}
        onPress={() => navigation.goBack()}>
 
        <Text style={{
          color: '#CCCCCC', 
        fontSize: 15, 
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'NanumGothic' 
        }}>
        뒤로가기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>조리하기</Text>
      </TouchableOpacity>
  </View>

    </View>
  );
} */


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8F9FA', // 배경색상 추가
  },

  row: {
    position: 'absolute',
    top: 570,
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    gap: 25,
  },

    button: {
    top: 85,
    width: 140,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,

  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },

});


export default recipeInfoView;
