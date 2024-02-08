import React, {useState} from 'react';
import { View, Button, Modal, Text, TouchableOpacity, StyleSheet,Dimensions, TextInput } from 'react-native';
import { ListItem } from 'react-native-elements';
import AddBTNIcon from "../assets/icons/AddBTNIcon.svg";
import { addDailyExpense, getDailyExpense } from './calendarFunctions';

const EditModal = ({ EditVisible, toggleEditModal, selectedDate }) => {
  const [amount, setAmount] = useState(0);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState({ method: '', shop: '', tag: '' });
  const [memo, setMemo] = useState('');

  const handleAddDailyExpense = async () => {
    const expenseData = {
      amount,
      items,
      payment,
      memo, 
    };
    const success = await addDailyExpense(selectedDate, expenseData);
    if (success) {
      console.log('Daily expense added successfully');
    } else {
      console.log('Failed to add daily expense');
    }
  };

  const handleGetDailyExpense = async () => {
    const data = await getDailyExpense(selectedDate);
    if (data) {
      setAmount(data.amount);
      setItems(data.items);
      setPayment(data.payment);
      setMemo(data.memo);
      console.log('Daily expense retrieved successfully:', data);
    } else {
      console.log('Failed to retrieve daily expense');
    }
  };

  const handleAddPayment = () => {
    setItems([...items, { name: '', quantity: 0, price: 0 }]);
    setPayment({ method: '', shop: '', tag: '' });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={EditVisible}
      onRequestClose={() => {
        toggleEditModal();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={{alignItems:'center', marginTop:50}}>
          <Text>{selectedDate}</Text>
          
        
          <View style={{ marginTop:50, flexDirection:'row', gap:20}}>
            <TextInput
            placeholder="수량"
            style={styles.input}
            value={quantity}
            keyboardType="number-pad"
            onChangeText={(text) => setQuantity(text)}
            />
            <TextInput
            placeholder="품목"
            style={styles.input}
            value={itemName}
            onChangeText={(text) => setItemName(text)}
            />
            <TextInput
            placeholder="가격"
            style={styles.input}
            value={price}
            keyboardType="number-pad"
            onChangeText={(text) => setPrice(text)}
            />
              </View>
            <TouchableOpacity onPress={handleAddItem} >
              <AddBTNIcon />
            </TouchableOpacity>
        </View>

         <View style={{marginTop:20}}>
          {items.map((item, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Subtitle>{`# ${item.quantity} ${item.itemName} ${item.price}원`}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          ))}
        </View>

       <TouchableOpacity onPress={toggleEditModal}>
          <Text>back to weekly cal view</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    backgroundColor:'#F8F9FA'

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
    height: 40,
    backgroundColor:'white',
    borderColor: 'gray',
    borderBottomWidth:1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default EditModal;
