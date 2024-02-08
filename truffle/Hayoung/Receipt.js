import React, {useState} from 'react';
import { View, Text,StyleSheet, TouchableOpacity } from 'react-native';
import TopTri from "../assets/icons/TopTri.svg";
import BottomTri from "../assets/icons/BottomTri.svg";
import EditBTN from "../assets/icons/EditBTN.svg";
import Line from "../assets/icons/Line.svg";
import EditModal from "../components/EditModal";
import { addDailyExpense, getDailyExpense } from './calendarFunctions';

const Receipt = ({selectedDate}) => {
  const [EditVisible, setEditVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState({ method: '', shop: '', tag: '' });
  const [memo, setMemo] = useState('');

  useEffect(() => {
    handleGetDailyExpense();
  }, [selectedDate]);
  
  const toggleEditModal = () => {
    setEditVisible(!EditVisible);
  };
  
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

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 0, price: 0 }]);
  };

  const handleAddPayment = () => {
    setItems([...items, { name: '', quantity: 0, price: 0 }]);
    setPayment({ method: '', shop: '', tag: '' });
  };
  
  
  return (

<View style={{alignItems:'center'}}>
  <TopTri/>
   <View style={styles.container}>
     <View style={{marginLeft:10}}>
      <TouchableOpacity onPress={toggleEditModal}>
       <EditBTN/>
      </TouchableOpacity>
      <EditModal EditVisible={EditVisible} toggleEditModal={toggleEditModal} selectedDate={selectedDate}/>
      </View>

    <View style={{alignItems:'center',}}>
      <View style={{ flexDirection:'row'}}>
        <Text> {amount}</Text>
        <Text> 원</Text>
        {/*금액 원 출력 */}  
      </View>
      <Line marginTop={20}/>
    </View>

    <View style={{alignItems:'center', marginTop:20}}>
      <View style={{ flexDirection:'row', gap:45}}>
        <Text> #{index + 1}</Text>
        {item.map((subItem, subIndex) => (
                <Text key={subIndex}>{subItem}</Text>
              ))} //여기 잘 모르겠엄
        {/*구매목록 */}  
      </View>
      <Line marginTop={20}/>
    </View>
    
    <View style={{marginTop:20, marginLeft:20}}>
      <View style={{ flexDirection:'row',}}>
        <Text> PAY</Text>
        <Text> {payment.method}</Text>
        {/*pay*/}  
      </View>
      <View style={{ flexDirection:'row',}}>
        <Text> SHOP</Text>
        <Text> {payment.shop}</Text>
        {/*shop*/}  
      </View>
      <View style={{ flexDirection:'row',}}>
        <Text> TAG</Text>
        <Text> {payment.tag}</Text>
        {/*tag*/}  
      </View>
      <Line marginTop={20} alignItems={'center'}/>
    </View>
    
    <View style={{ marginTop:20, marginLeft:20}}>
      <View style={{ flexDirection:'row', gap:45}}>
        <Text> MEMO</Text>
      </View>
      <Text> {memo}</Text>
    </View>

  </View>
  <BottomTri marginTop={-5}/>
</View>
  );
};

const styles = StyleSheet.create({

  container:{
    backgroundColor: 'white',
    height: 500,
    width:300,
    marginTop:-5,
  },
})

export default Receipt;
