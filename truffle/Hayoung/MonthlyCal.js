import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Table, Row, Cell } from 'react-native-table-component';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import moment from 'moment';
import firestore from "@react-native-firebase/firestore";

const MonthlyCal = ({ calendarData, handleDayClick }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month() + 1);
  const [allAmounts, setAllAmounts] = useState({});
  const circleRadius = 16;

  useEffect(() => {
    getAllAmountsForDates().then((amounts) => {
      setAllAmounts(amounts);
    });
  }, []);

  const getAmountForDate = async (date) => {
    try{
      const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
      const docRef = firestore().collection(userId).doc(date);
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
    const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
    const allAmounts = {};
    const dateSet = new Set();
  
    for (let row of calendarData) {
      for (let day of row) {
        dateSet.add(day.date);
      }
    }
  
    const uniqueDates = Array.from(dateSet);
  
    for (let date of uniqueDates) {
      const amount = await getAmountForDate(date);
      if (amount !== 0) {
        allAmounts[date] = amount;
      }
    }
  
    return allAmounts;
  };

  return (
    <Table>
      {calendarData.map((row, rowIndex) => (
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
                    y={circleRadius + 20}
                    fontSize={10}
                    textAnchor="middle"
                    fill='grey'
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
      ))}
    </Table>
  );
};

export default MonthlyCal;
