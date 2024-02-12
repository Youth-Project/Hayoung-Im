import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import moment from 'moment';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import firestore from "@react-native-firebase/firestore";
import AddBTNIcon from "../assets/icons/AddBTNIcon.svg";
import LeftArrow from "../assets/icons/LeftArrow";
import RightArrow from "../assets/icons/RightArrow";

const CalendarView = ({ navigation, props }) => {
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [calendarData, setCalendarData] = useState([]);
  const [amountsArray, setAmountsArray] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month() + 1);
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  const circleRadius = 16;

  useEffect(() => {
    generateCalendarData();
  }, []);

  useEffect(() => {
    getAllAmountsForDates().then((amounts) => {
      setAllAmounts(amounts);
    });
  }, [calendarData]);

  useEffect(() => {
    getAllAmountsForCurrentMonth();
  }, []);

  const generateCalendarData = () => {
    const firstDay = moment(currentDate).startOf('month').startOf('week');
    const lastDay = moment(currentDate).endOf('month').endOf('week');
  
    const rows = [];
    let days = [];
    let day = firstDay;
  
    while (day.isBefore(lastDay)) {
      for (let i = 0; i < 7; i++) {
        days.push({
          date: day.format('YYYY-MM-DD'),
          dayOfWeek: day.format('ddd'),
          isCurrentMonth: day.isSame(currentDate, 'month'),
        });
        day.add(1, 'day');
      }
      rows.push(days);
      days = [];
    }
    setCalendarData(rows);
  };

  const getAllAmountsForCurrentMonth = async () => {
    const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
    const firstDayOfMonth = moment(currentDate).startOf('month');
    const lastDayOfMonth = moment(currentDate).endOf('month');

    const start = firstDayOfMonth.format('YYYY-MM-DD');
    const end = lastDayOfMonth.format('YYYY-MM-DD');

    const amounts = {};
    const dateArray = [];

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      const date = m.format('YYYY-MM-DD');
      dateArray.push(date);
    }

    for (const date of dateArray) {
      const amount = await getAmountForDate(userId, date);
      amounts[date] = amount;
    }

    setAmountsArray(dateArray.map(date => amounts[date]));
  };

  const getAmountForDate = async (userId, date) => {
    try {
      const docRef = firestore().collection(userId).doc(date);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
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

  

  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };

  const handleMonthChange = (value) => {
    setCurrentDate(moment(currentDate).month(value - 1));
    setSelectedMonth(value);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const renderCalendar = useMemo(() => {
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
                  fontSize={15}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={day.isCurrentMonth ? (day.date === selectedDate ? 'white' : day.date === moment().format('YYYY-MM-DD') ? 'orange' : 'black') : 'lightgray'}
                >
                  {day.date.substring(8)}
                </SvgText>

                <SvgText
                  x={circleRadius}
                  y={circleRadius + 25}
                  fontSize={11}
                  textAnchor="middle"
                  fill='grey'
                  style={{ overflow: 'visible' }}
                >
                  {amountsArray[day.date]}
                </SvgText>
              </Svg>
            </View>
          </TouchableOpacity>
        ))}
        style={{ height: circleRadius * 4 }}
      />
    ));
  }, [calendarData, selectedDate, handleDayClick, amountsArray]);

  return (
    <View style={styles.container}>
      <Text style={styles.Texts}>Calendar</Text>
      <View style={styles.calContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <LeftArrow />
          </TouchableOpacity>
          <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{currentDate.format('MMMM YYYY')}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <RightArrow />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          {weekdays.map((weekday, index) => (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: "grey" }}>{weekday}</Text>
            </View>
          ))}
        </View>

        <Table>
          {renderCalendar}
        </Table>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WeekCalView', { selectedDate: selectedDate, handleDayClick: handleDayClick })}>
          <AddBTNIcon width={70} height={70} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: -90,
    left: 280,
    zIndex: 1
  },
  calContainer: {
    padding: 20,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 80,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 500,
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#F8F9FA',
  },
  Texts: {
    color: '#474646',
    font-family: NanumGothic,
    fontSize: 24,
    marginLeft: 22,
    marginTop: 20,
  },
});

export default CalendarView;
