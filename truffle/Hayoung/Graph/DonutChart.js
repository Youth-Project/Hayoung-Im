import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity , StyleSheet,AppRegistry,processColor,Dimensions} from 'react-native';
import PieChart from 'react-native-pie-chart'
import TruffleLogo from "../assets/logo/TruffleLogo.svg";
import firestore from "@react-native-firebase/firestore";

function DonutChart () {
  const [userbudget, setUserBudget] = useState(0);
  const [expenses, setExpenses] = useState({
    외식: 0,
    장보기: 0,
    배달: 0,
  });

  const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
  
  useEffect(() => {
    const fetchBudgetAndExpenses = async () => {
      try {
        const userBudgetDoc = await firestore().collection("users").doc(userId).get();
        const userBudgetData = userBudgetDoc.data();
        setUserBudget(userBudgetData.user_budget || 0);

        const monthlyExpenseData = await fetchMonthlyExpenses();
        setExpenses(monthlyExpenseData);
      } catch (error) {
      console.error("Error fetching budget and expenses: ", error);
      }
    };
    fetchBudgetAndExpense();
  }, []);

  const fetchMonthlyExpenses = async () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const startOfMonth = new Date(year, month-1, 1);
    const endOfMonth = new Date(year, month, 0);
    try{
      const monthlyExpenseDoc = await firestore().collection(userId)
      .where(firebase.firestore.FieldPath.documentId(), ">=", startOfMonth.toISOString().split('T')[0])
      .where(firebase.firestore.FieldPath.documentId(), "<=", endOfMonth.toISOString().split('T')[0])
      .get();

      const monthlyExpense = {
        total: 0,
        배달: 0,
        장보기: 0,
        외식: 0,
      };

      monthlyExpenseDoc.forEach((items, index) => {
        //이부분을 어케 수정하지...
        const tag = tagArr[index];
        items.nameArr.forEach((name, i) => {
          const expense = items.quantityArr[i] * items.priceArr[i];
          montlyExpense.total += expense;
          if (tag === '배달') montlyExpense.delivery += expense;
          else if (tag === '장보기') montlyExpense.shopping += expense;
          else if (tag === '외식') montlyExpense.eatout += expense;
      });
    } catch (error) {
      console.error("Error fetching monthly expenses: ", error);
    }
  };

  const calculateRemainingBudget = () => {
    const totalExpense = Object.values(expenses).reduce((acc, expense) => acc + expense, 0);
    return userBudget - totalExpense;
  };

  const remainingBudget = calculateRemainingBudget();

  const totalBudget = userBudget;
  const expensePercentages = {
    외식: (expenses.외식 / totalBudget) * 100,
    장보기: (expenses.장보기 / totalBudget) * 100,
    배달: (expenses.배달 / totalBudget) * 100,
    남은금액: (remainingBudget / totalBudget) * 100,
  };

  const series = [
    expensePercentages.장보기,
    expensePercentages.배달,
    expensePercentages.외식,
    expensePercentages.남은금액,
  ]
  const sliceColor = ['#D55A44', '#FEA655', '#FFD98E', '#ABABAB']

    return (
      <View style={Styles.container}>
        <Text style={Styles.Texts}>
          지출 통계
        </Text>
        <TruffleLogo style={Styles.Logo}/>
        <View style={{alignItems:'center'}}>
        <PieChart
            widthAndHeight={200}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.65}
            coverFill={'white'}
          />
          </View>
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}} marginTop={20}>
            <View style={[Styles.colorSlice,{backgroundColor:'#D55A44'}]}></View>
            <Text >장보기</Text>
            <View style={[Styles.colorSlice,{backgroundColor:'#FEA655'}]}></View>
            <Text>배달</Text>
            <View style={[Styles.colorSlice,{backgroundColor:'#FFD98E'}]}></View>
            <Text>외식</Text>
          </View>

      </View>
    );
  }

const Styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width*0.9,
    height:Dimensions.get('window').height *0.35,
    backgroundColor: 'white',
    padding: 10,
    margin:20,
    marginTop:20,
    borderColor:'black',
    borderRadius:12,
  },
  Texts: {
    color: '#838383',
    //fontFamily: 'NanumGothic, sans-serif',
    fontSize: 12,
    marginLeft: 10,
  },
  chart: {
    flex: 1
  },
  Logo:{
    position: 'absolute',
    bottom: 130,
    left: Dimensions.get('window').width /2.6,
    zIndex:1,
  },
  colorSlice:{
    height:12,
    width:12,
    marginRight:5,
    marginLeft:5
  }

})

export default DonutChart;
