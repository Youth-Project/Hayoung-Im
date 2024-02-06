import React, { useEffect, useState} from 'react';
import {
  NavigationContainer,
  Text,
  Modal,
  View,
  TouchableOpacity,
  TextInput, ScrollView, 
  StyleSheet, Image
} from 'react-native';
import firebase from 'firebase';


{/* 레시피 내용 컴포넌트 */}
const Content = (props) => {
  return (
  <View 
      style={{
        backgroundColor: 'white', 
        borderRadius: 7, 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        gap: 12, 
        paddingTop: 20, 
        paddingBottom: 20, 
        paddingLeft: 15, 
        paddingRight: 15, 
        width: 350,
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 16, left: 0, }}>{props.order}.</Text>
      <Text numberOfLines={2} style={{fontSize: 12, flexShrink : 1 }}>
          {props.recipe}
      </Text>
    </View>
  );
};


const recipeStepsView = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeSteps, setRecipeSteps] = useState([]);

  useEffect(() => {
    fetchRecipeSteps();
  }, []);

  const fetchRecipeSteps = async () => {
    try {
      const recipeId = navigation.getParam('recipeId');
      const recipeDoc = await firebase.firestore().collection('recipes').doc(recipeId).get();

      if (recipeDoc.exists) {
        const recipeData = recipeDoc.data();
        const steps = recipeData.recipe_steps;
        setRecipeSteps(steps);
      }
    } catch (error) {
      console.error('레시피 단계를 가져오는데 실패했습니다.', error);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* 모달 컴포넌트 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modal}>
            <Text style={{ fontSize: 15, bottom: 13, top: 2 }}>요리를 완료하시겠습니까?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', gap: 20 }}>
              <TouchableOpacity
                style={styles.modButton}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.modButtonText}>아니요</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  style={styles.modButton} 
                  onPress={() => navigation.navigate('Recipe')}>
                <Text style={styles.modButtonText}>네</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} />

      <Text style={styles.title}>조리과정</Text>

      <ScrollView style={styles.scrollView}>
        {recipeSteps.map((step, index) => (
          <Content key={index} order={index + 1} recipe={step} />
        ))}
      </ScrollView>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Recipe')}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>조리완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 304,  
    height: 140,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 500,
      height: 500,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 500,
  },

  modButton: {
    top: 30,
    width: 90,
    borderWidth: 1,
    borderColor: '#FEA655',
    paddingVertical: 5,
    borderRadius: 25,
  },
  modButtonText: {
    color: '#FEA655',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },
});


export default recipeStepsView;
