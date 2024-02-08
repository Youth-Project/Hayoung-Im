import React, {useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import moment from 'moment';

const MonthlyCal = ({ calendarData, handleDayClick }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month() + 1);
  const circleRadius = 16;

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
                {day.expense}
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
