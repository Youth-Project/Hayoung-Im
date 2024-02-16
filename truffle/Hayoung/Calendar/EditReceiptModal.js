import React, {useState, useEffect} from 'react';
import { View, Button, Modal, Text, TouchableOpacity, StyleSheet,Dimensions, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import Line from "../assets/icons/Line";
import SmallAddBTNGrey from "../assets/icons/SmallAddBTNGrey";
import AddBTNIcon from "../assets/icons/AddBTNIcon";
import TruffleLogo from "../assets/logo/TruffleLogo";
import SaveBTN from "../assets/icons/SaveBTN";
import LeftArrow from "../assets/icons/LeftArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const EditReceiptModal = ({ EditVisible, toggleEditModal, selectedDate}) => {

  const [items, setItems] = useState([{ name: '', quantity: '', price: '' }]);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  //--input 바뀌었을 때--\\
  const handleInputChange = (text, index, key) => {
    const newItems = [...items];
    newItems[index][key]  = text;
    setItems(newItems);
  };
  //--input 받기--\\
  const handleAddItem = () => {
    if (quantity && name && price) {
      const newItem = { name: name, quantity: quantity, price: price };
      setItems([...items, newItem]);
    } else {
      Alert.alert('Warning', 'Please fill all fields.');
    }
    setName('');
    setQuantity('');
    setPrice('');
  };

  //--모든 TextInput이 값이 채워졌는지 확인(안채우면 add안됨)--\\
  const areitemsFilled = () => {
    return items.every(input => input.quantity && input.name && input.price);
  };
  //--AsyncStorage에 데이터 저장--\\
  const saveData = async () => {
    try {
      const dataToSave = items.map(item => ({
        nameArr: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      await AsyncStorage.setItem(selectedDate, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //--AsyncStorage에서 데이터 불러오기--\\
useEffect(() => {
  const loadData = async () => {
    try {
      const storeditems = await AsyncStorage.getItem(selectedDate); // 해당 날짜의 items 불러오기
      if (storeditems) {
        const parsedItems = JSON.parse(storeditems);
        const initialItems = parsedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
        setItems(initialItems);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  loadData();
}, [selectedDate]);
//--AddDailyExpense--\\  
  const [inputTagList, setInputTaglist] = useState([{items:[{name:'', quantity:'', price:''}],pay: '', shop:'', tags:''}]);

  const [shop, setShop] = useState('');
  const [pay, setPay] = useState(null);
  const [tags, setTags] = useState(null);


  //--장보기 외식 배달 string 변환 변환 후 array에 저장--\\
  const handleTags = (buttonName, index) => {
    // 선택한 버튼의 값에 따라 태그 설정
    let tagsReturnVal = '';
    if(buttonName==='shopping'){
      tagsReturnVal='장보기';
    } else if (buttonName === 'eatOut'){
      tagsReturnVal='외식';
    } else {
      tagsReturnVal='배달';
    }
    // 해당 인덱스의 입력 상태를 업데이트
    setInputTaglist(prevInputTagList => {
      const newList = [...prevInputTagList];
      newList.tags = tagsReturnVal;
      return newList;
    });
  };

//--현금 카드 string 변환 후 array에 저장--\\
const handlepay = (buttonName, index) => {
  let btnReturnVal='';
  if(buttonName=='cash'){
    btnReturnVal='현금';
  } else {
    btnReturnVal='카드';
  }
  setInputTaglist(prevInputTagList => {
    const newList = [...prevInputTagList];
    newList.pay = btnReturnVal;
    return newList;
  });
};
  //--shop input--\\
  const handleShopChange = (text, index) => {
    setInputTaglist(prevInputTagList => {
      const newList = [...prevInputTagList];
      newList.shopArr = text;
      return newList;
    });
  };

  // SaveBTN을 눌렀을 때 inputTagList 저장
  const handleInputTagListSave = () => {
    saveData(); // AsyncStorage에 데이터 저장
  };
  //--플러스 버튼 누르면 아레이 값 증가--\\
  const handleAddExpense = () => {
     setInputTaglist(prevInputTagList => [
      ...prevInputTagList, 
      { 
        items:[],
        pay: '', 
        shop: '', 
        tags: '',
      }
    ]);
  };
  
  //--EditReciptModal--\\
  const [dailyExpense, setDailyExpense] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [memo,setMemo]=useState('');
  const [shoppingExpense, setShoppingExpense] = useState(0);
  const [eatOutExpense, setEatOutExpense] = useState(0);
  const [deliveryExpense, setDelivertyExpense] = useState(0);
 //--하루 총액 구하기--\\
useEffect(() => {
  let totalExpense = 0;
  inputTagList.forEach((item) => {
    item.items.forEach((elem) => {
      totalExpense += parseFloat(elem.price);
    });
  });
  setDailyExpense(totalExpense);
}, [inputTagList]);

//--장보기 합산--\\
useEffect(() => {
  let totalShopping = 0;
  inputTagList.forEach((item) => {
    item.items.forEach((elem) => {
      if (elem.tags === '장보기') {
        totalShopping += parseFloat(elem.price);
      }
    });
  });
  setShoppingExpense(totalShopping);
}, [inputTagList]);

//--외식 합산--\\
useEffect(() => {
  let totalEatOut = 0;
  inputTagList.forEach((item) => {
    item.items.forEach((elem) => {
      if (elem.tags === '외식') {
        totalEatOut += parseFloat(elem.price);
      }
    });
  });
  setEatOutExpense(totalEatOut);
}, [inputTagList]);

//--배달 합산--\\
useEffect(() => {
  let totalDelivery = 0;
  inputTagList.forEach((item) => {
    item.items.forEach((elem) => {
      if (elem.tags === '배달') {
        totalDelivery += parseFloat(elem.price);
      }
    });
  });
  setDelivertyExpense(totalDelivery);
}, [inputTagList]);

  
  //----파이어베이스에 업데이트----\\
  const [loading, setLoading] = useState(false);
  const handleSaveData = async () => {
    try {
    
      setLoading(true);
      const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
      const totalPrice=dailyExpense;
      const date = selectedDate;
      const data = {
  amount: totalPrice,
  items: [
    { name: name, quantity: quantity, price: price },
  ],
  pay: [
    { pay: pay, shop: shop, tag: tags },
  ],
  memo: memo
};
      const currentDate = new Date(date);
      const currentMonthIndex = currentDate.getMonth();
      const userRef = firestore().collection('users').doc(userId);
      
    const currentShoppingSnapshot = await userRef.get();
    const currentShopping = currentShoppingSnapshot.data().shopping[currentMonthIndex] || 0;

    const currentEatOutSnapshot = await userRef.get();
    const currentEatOut = currentEatOutSnapshot.data().eatOut[currentMonthIndex] || 0;

    const currentDeliverySnapshot = await userRef.get();
    const currentDelivery = currentDeliverySnapshot.data().delivery[currentMonthIndex] || 0;

      
    const updatedShopping = currentShopping + totalShopping;
    const updatedEatOut = currentEatOut + totalEatOut;
    const updatedDelivery = currentDelivery + totalDelivery;

      await userRef.update({
        [`shopping.${currentMonthIndex}`]: updatedShopping,
        [`eatOut.${currentMonthIndex}`]: updatedEatOut,
        [`delivery.${currentMonthIndex}`]: updatedDelivery
      });
      
  await firestore().collection(userId).doc(date).set(data);
  handleInputTagListSave();
  Alert.alert('Success', 'Data saved successfully.');
  } catch (error) {
    console.error('Error saving data:', error);
    Alert.alert('Error', 'Failed to save data.');
  } finally {
    setLoading(false);
  }
 };

  const checkingArr = () => {
    console.log(items, pay, shop, tags);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={EditVisible}
      onRequestClose={() => {
        toggleEditModal();
      }}
    >
    <SafeAreaView>
      <ScrollView>
        <View>
        <View style={styles.modalContainer}>
          {/* 뒤로 가기 로고 플러스 버튼*/}
        <View  style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:10}}>
          <TouchableOpacity onPress={() => {toggleEditModal()}}>
          <LeftArrow height={30} width={30}/>
          </TouchableOpacity>
          <TruffleLogo height={30} width={30}/>
          <TouchableOpacity onPress={handleAddExpense}>
            <AddBTNIcon height={35} width={35} />
          </TouchableOpacity>
        </View>
          <View style={{alignItems:'center', marginTop:20}}>
            <View style={styles.expenseHeader}>
              <View style={{width:8}}></View>
                <Text style={styles.expenseText}>{dailyExpense}</Text>
                <Text style={{fontSize:24, fontWeight:'400'}}>원</Text>
              </View>
              <Line/>
            {/*ProductList */}
            {inputTagList.map((inputTag, index) => (
  <View key={index} style={{ alignItems: 'center' }}>
    {inputTag.items.map((item, itemIndex) => (
      <View key={itemIndex} style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 10 }}>
        <TextInput
          placeholder="항목 입력"
          style={[styles.ProductInput, { width: 100 }]}
          value={item.name}
          onChangeText={(text) => handleInputChange(text, itemIndex, 'name')}
        />
        <TextInput
          placeholder="수량"
          style={[styles.ProductInput, { width: 40 }]}
          value={item.quantity}
          keyboardType="number-pad"
          onChangeText={(text) => handleInputChange(text, itemIndex, 'quantity')}
        />
        <TextInput
          placeholder="가격"
          style={[styles.ProductInput, { width: 100 }]}
          value={item.price}
          keyboardType="number-pad"
          onChangeText={(text) => handleInputChange(text, itemIndex, 'price')}
        />
        <Text style={{ fontSize: 18 }}>₩</Text>
      </View>
    ))}
    <TouchableOpacity onPress={handleAddItem} disabled={!areitemsFilled()} style={{ marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
      <SmallAddBTNGrey />
    </TouchableOpacity>

          <View style={{alignItems:'center'}}>
            <Line />
            {/* AddDailyExpense */}
          <View style={{ alignItems: 'flex-start', marginLeft: -20 }}>
            <View style={styles.tagStyle}>
              <Text>PAY</Text>
              <TouchableOpacity
                style={[styles.TagsBTN, inputTag.pay === 'cash' && styles.selectedBTN]}
                onPress={() => handlepay('cash', index)}
              >
                <Text style={[styles.TagsBTNText, inputTag.pay === 'cash' && styles.selectedBTNText]}>현금</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.TagsBTN, inputTag.pay === 'card' && styles.selectedBTN]}
                onPress={() => handlepay('card', index)}
              >
                <Text style={[styles.TagsBTNText, inputTag.pay === 'card' && styles.selectedBTNText]}>카드</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagStyle}>
              <Text>SHOP</Text>
              <TextInput
                placeholder="..."
                style={styles.shopInput}
                value={index.shop}
                onChangeText={(text) => handleShopChange(text, index)}
              />
            </View>
            <View style={styles.tagStyle}>
              <Text>TAG</Text>
              <TouchableOpacity
                style={[styles.TagsBTN, inputTag.tags === 'shopping' && styles.selectedBTN]}
                onPress={() => handleTags('shopping', index)}
              >
                <Text style={[styles.TagsBTNText, inputTag.tags === 'shopping' && styles.selectedBTNText]}>장보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.TagsBTN, (inputTag.tags === 'eatOut' && styles.selectedBTN)]}
                onPress={() => handleTags('eatOut', index)}
              >
                <Text style={[styles.TagsBTNText, inputTag.tags === 'eatOut' && styles.selectedBTNText]}>외식</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.TagsBTN, inputTag.tags === 'delivery' && styles.selectedBTN]}
                onPress={() => handleTags('delivery', index)}
              >
                <Text style={[styles.TagsBTNText, inputTag.tags === 'delivery' && styles.selectedBTNText]}>배달</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>
      ))}
      <Line/>

      <View style={styles.memoContainer}>
        <Text>MEMO</Text>
          </View>
          <TextInput
          placeholder="..."
          style={styles.input}
          value={memo}
          onChangeText={(text) => setMemo(text)}
          />
          </View>
          <TouchableOpacity
          style={{alignItems:'center', marginBottom:200}}
          onPress={()=>{
            handleSaveData();
            toggleEditModal();
            handleInputTagListSave();
            checkingArr();
          }}
          >
            <SaveBTN/>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
</Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor:'#F8F9FA',
    width: Dimensions.get('window').width,
  },
  modalContent: {
    backgroundColor: 'white',
    width: 304,
    height:310,
    borderRadius: 10,
  },
  HeaderText:{
    fontSize:14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 150,
    width: Dimensions.get('window').width-100,
    borderColor: 'gray',
    borderWidth:0.5,
    fontSize:14,
    textAlign:'center',
    marginBottom:50,
    marginTop:10,
    borderRadius:10,
  },
  memoContainer:{
    width: Dimensions.get('window').width,
    alignItems:'flex-start',
    marginLeft:100,
    marginTop:10,
  },
  expenseText:{
    fontSize:38,
  },
  expenseHeader:{
    flexDirection:'row',
    width: Dimensions.get('window').width*0.7,
    justifyContent:'space-between',
    alignItems:'center'
  },
  ProductInput: {
    height: 38,
    backgroundColor:'white',
    borderColor: 'gray',
    borderBottomWidth:1,
    marginBottom: 8,
    paddingHorizontal: 8,
    fontSize:14,
    textAlign:'center'
  },
  shopInput: {
    height: 35,
    width:100,
    borderColor: 'gray',
    borderBottomWidth:1,
    fontSize:14,
    textAlign:'center'
  },
  TagsBTN: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderColor:'#D4D4D4',
    borderWidth:1,
    width:60,
  },
  selectedBTN: {
    borderColor: '#FEA655',
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderWidth:1,
    width:60,
  },
  TagsBTNText: {
    color: '#D4D4D4',
    fontSize: 14,
    textAlign:'center'
  },
  selectedBTNText: {
    color: '#FEA655',
    fontSize: 14,
    textAlign:'center'
  },
  tagStyle:{
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    marginTop:5,
    marginBottom:5
  },
});

export default EditReceiptModal;
