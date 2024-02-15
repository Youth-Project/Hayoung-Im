import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';
import TruffleLogo from "../assets/logo/TruffleLogo.svg";
import firestore from "@react-native-firebase/firestore";

function DonutChart () {
  const [userBudget, setUserBudget] = useState(0);
  const [expenses, setExpenses] = useState({
    eatOut: 0, // 외식
    shopping: 0, // 장보기
    delivery: 0, // 배달
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
    fetchBudgetAndExpenses();
  }, []);

  const fetchMonthlyExpenses = async () => {
  try {
    const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
    const userRef = firestore().collection('users').doc(userId);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      throw new Error("No monthly expenses data found");
    }

    const userData = snapshot.data();
    const deliveryExpense = userData.delivery[userData.delivery.length - 1] || 0;
    const shoppingExpense = userData.shopping[userData.shopping.length - 1] || 0;
    const eatOutExpense = userData.eatOut[userData.eatOut.length - 1] || 0;

    return {
      total: deliveryExpense + shoppingExpense + eatOutExpense,
      delivery: deliveryExpense,
      shopping: shoppingExpense,
      eatOut: eatOutExpense,
    };
  } catch (error) {
    console.error("Error fetching monthly expenses: ", error);
    return {
      total: 0,
      delivery: 0,
      shopping: 0,
      eatOut: 0,
    };
  }
};

  const calculateRemainingBudget = () => {
    const total = expenses.eatOut + expenses.shopping + expenses.delivery;
    return userBudget - total;
  };

  const remainingBudget = calculateRemainingBudget();
  const totalBudget = userBudget;
  const { eatOut, shopping, delivery } = expenses;
  const extraBudget = remainingBudget / totalBudget * 100;

  const series = [
    shopping / totalBudget * 100,
    delivery / totalBudget * 100,
    eatOut / totalBudget * 100,
    extraBudget,
  ];
  const sliceColor = ['#D55A44', '#FEA655', '#FFD98E', '#ABABAB'];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        지출 통계
      </Text>
      <TruffleLogo style={styles.logo}/>
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={200}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.65}
          coverFill={'white'}
        />
      </View>
      <View style={styles.legendContainer}>
        <View style={[styles.colorSlice,{backgroundColor:'#D55A44'}]}/>
        <Text>장보기</Text>
        <View style={[styles.colorSlice,{backgroundColor:'#FEA655'}]}/>
        <Text>배달</Text>
        <View style={[styles.colorSlice,{backgroundColor:'#FFD98E'}]}/>
        <Text>외식</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width*0.9,
    height:Dimensions.get('window').height *0.35,
    backgroundColor: 'white',
    padding: 10,
    margin:20,
    borderColor:'black',
    borderRadius:12,
  },
  text: {
    color: '#838383',
    fontSize: 12,
    marginLeft: 10,
  },
  chartContainer: {
    alignItems:'center',
  },
  logo:{
    position: 'absolute',
    bottom: 130,
    left: Dimensions.get('window').width /2.6,
    zIndex:1,
  },
  legendContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 20,
  },
  colorSlice:{
    height:12,
    width:12,
    marginRight:5,
    marginLeft:5
  }
});

export default DonutChart;
