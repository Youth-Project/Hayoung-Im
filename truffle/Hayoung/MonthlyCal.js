import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import moment from 'moment';
import firebase from 'firebase/app';
import 'firebase/firestore';

const MonthlyCal = ({ calendarData, handleDayClick }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month() + 1);
  const [allAmounts, setAllAmounts] = useState({});
  const circleRadius = 16;
  
  useEffect(() => {
    getAllAmountsForDates().then((amounts) => {
      setAllAmounts(amounts);
    });
  }, []);

  const getAmoutForDate = async (date) => {
    try{
      const userId = firebase.auth().currentUser.uid;
      const docRef = firebase.firestore().collection(userId).doc(date);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists){
        const data = docSnapshot.data();
        return data.amount || 0;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error fetching amount from date:', error);
      return 0;
    }
  };

  const getAllAmountsForDates = async () => {
    const userId = firebase.auth().currentUser.uid;
    const allAmounts = {};
    for (let day of calendarData) {
      const amount = await getAmountForDate(day.date);
      allAmounts[day.date] = amount;
    }
  return allAmounts;
};

  return calendarData.map((row, rowIndex) => (
    <Row
      key={rowIndex}
      data={row.map((day, colIndex) => (
        <TouchableOpacity
          key={colIndex}
          onPress={() => handleDayClick(day.date)}
          style={{
            flex: 1,
            marginTop: 5,
            alignItems: 'center',
          }}
        >
          <View>
            <Svg height={circleRadius * 4} width={circleRadius * 2}>
              <Circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius}
                fill={day.date === selectedDate ? 'orange' : 'transparent'}
              />

              <SvgText
                x={circleRadius}
                y={circleRadius + 4}
                fontSize={12}
                fontWeight="bold"
                textAnchor="middle"
                fill={day.isCurrentMonth ? (day.date === selectedDate ? 'white' : day.date === moment().format('YYYY-MM-DD') ? 'orange' : 'black') : 'lightgray'}
              >
                {day.date.substring(8)}
              </SvgText>

              <SvgText
                x={circleRadius}
                y={circleRadius + 25}
                fontSize={10}
                textAnchor="middle"
                fill='red'
                style={{ overflow: 'visible' }}
              >
                {allAmounts[day.date]}
              </SvgText>
            </Svg>
          </View>
        </TouchableOpacity>
      ))}
      style={{ height: circleRadius * 4 }}
    />
  ));
};

export default MonthlyCal;
