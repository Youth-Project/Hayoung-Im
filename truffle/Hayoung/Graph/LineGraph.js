import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity , StyleSheet,ScrollView} from 'react-native';
import {Dimensions} from 'react-native';
import {LineChart} from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import firestore from "@react-native-firebase/firestore";

const DropdownData =[
  { label: '최근 1주', value: '1' },
  { label: '최근 3개월', value: '3' },
  { label: '최근 6개월', value: '4' },
  { label: '최근 1년', value: '5' },
];

//--labels에 해당 달 출력--\\
const currentDate = moment();
const currentMonth = currentDate.month()+1;

// 현재 달의 날짜를 역순으로 생성하여 labels 배열에 넣습니다.
const yearLabels = Array.from({ length: 12 }, (_, index) => moment(currentDate).subtract(11-index, 'month').format('MMM'));
const halfyearLabels = Array.from({ length: 6 }, (_, index) => moment(currentDate).subtract(5-index, 'month').format('MMM'));
const quarteryearLabels = Array.from({ length: 3 }, (_, index) => moment(currentDate).subtract(2-index, 'month').format('MMM'));
const monthlyLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LineGraph = () => {
  const [value, setValue] = useState(null);
  const [data1, setData1] = useState(null);
  const [data3, setData3] = useState(null);
  const [data4, setData4] = useState(null);
  const [data5, setData5] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
        const userRef = firestore().collection('users').doc(userId);
        const snapshot = await userRef.get();
        if (!snapshot.exists) {
          throw new Error("No monthly expenses data found");
        }
        const userData = snapshot.data();
        const totalExpenses = [];

        for (let i = 0; i < userData.delivery.length; i++) {
          const totalExpense = (userData.delivery[i] || 0) + (userData.shopping[i] || 0) + (userData.eatOut[i] || 0);
          totalExpenses.push(totalExpense);
        }

        setData3({
          labels: quarteryearLabels,
          datasets: [
            {
              data: [totalExpenses[totalExpenses.length - 3] || 0, totalExpenses[totalExpenses.length - 2] || 0, totalExpenses[totalExpenses.length - 1] || 0],
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

        setData4({
          labels: halfyearLabels,
          datasets: [
            {
              data: [totalExpenses[totalExpenses.length - 6] || 0, totalExpenses[totalExpenses.length - 5] || 0, totalExpenses[totalExpenses.length - 4] || 0, totalExpenses[totalExpenses.length - 3] || 0, totalExpenses[totalExpenses.length - 2] || 0, totalExpenses[totalExpenses.length - 1] || 0],
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

        setData5({
          labels: yearLabels,
          datasets: [
            {
              data: [totalExpenses[totalExpenses.length - 12] || 0, totalExpenses[totalExpenses.length -11] || 0, totalExpenses[totalExpenses.length - 10] || 0, totalExpenses[totalExpenses.length - 9] || 0, totalExpenses[totalExpenses.length - 8] || 0, totalExpenses[totalExpenses.length - 7] || 0, totalExpenses[totalExpenses.length - 6] || 0, totalExpenses[totalExpenses.length - 5] || 0, totalExpenses[totalExpenses.length - 4] || 0, totalExpenses[totalExpenses.length - 3] || 0, totalExpenses[totalExpenses.length - 2] || 0, totalExpenses[totalExpenses.length - 1] || 0],
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

        const startDate = moment().startOf('isoWeek'); // 이번 주 시작일
        const endDate = moment().endOf('isoWeek'); // 이번 주 종료일
        const days = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
          const dateStr = currentDate.format('YYYY-MM-DD');
          const dailyData = await fetchDailyData(userId, dateStr);
          days.push(dailyData);
          currentDate = currentDate.clone().add(1, 'days');
        }
        setData1({
          labels: monthlyLabels,
          datasets: [
            {
              data: days,
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });
        console.log(data1);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    fetchDailyData();
  }, []);

  const fetchDailyData = async (userId, dateStr) => {
    const docRef = firestore().collection(userId).doc(dateStr);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data().amount || 0;
    } else {
      return 0;
    }
  };

const renderDropdown = () => {
  switch (value) {
    case '1':
      return data1 ? <LineChart data={data1} width={380} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier /> : null;
    case '3':
      return data3 ? <LineChart data={data3} width={450} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier /> : null;
    case '4':
      return data4 ? <LineChart data={data4} width={450} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier /> : null;
    case '5':
      return data5 ? <LineChart data={data5} width={450} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier /> : null;
    default:
      return data1 ? <LineChart data={data1} width={400} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier /> : null;
  }
};

return (
  <View style={styles.container}>
    <View style={{flexDirection: 'row',}}>
    <Text style={styles.Texts}>
      지출 추이
    </Text>
    <View style={styles.dropdown_container}>
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={DropdownData}
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder="최근 1주"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
    />
    </View>
    </View>
      {renderDropdown()}
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
    marginTop:10,
    borderColor:'black',
    borderRadius:12,
  },

  Texts: {
    color: '#838383',
    //fontFamily: 'NanumGothic, sans-serif',
    fontSize: 12,
    marginLeft: 10,
  },

  dropdown_container: {
    marginLeft: 160,
    width:130,
    height:30,
    zIndex: 1000,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
})

const chartConfig = {
  backgroundGradientFrom: "white",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "white",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(55, 55, 55, ${opacity})`,
  strokeWidth: 3,
  barPercentage: 11,
  useShadowColorFromDataset: true,
};

export default LineGraph;
