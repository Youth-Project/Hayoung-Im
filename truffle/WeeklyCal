import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import moment from 'moment';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const WeeklyCal = ({ selectedDate, handleDayClick }) => {
  
  const startOfWeek = moment(selectedDate).startOf('week');
  const weekDays = Array.from({ length: 7 }, (_, index) => moment(startOfWeek).add(index, 'day'));
  const circleRadius = 16;
  return (
    <View style={styles.container}>
      {weekDays.map((day, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleDayClick(day.format('YYYY-MM-DD'))}
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
                fill={day.format('YYYY-MM-DD') === selectedDate ? 'orange' : 'transparent'}
              />

              <SvgText
                x={circleRadius}
                y={circleRadius + 4}
                fontSize={12}
                fontWeight="bold"
                textAnchor="middle"
                fill={day.format('YYYY-MM-DD') === selectedDate ? 'white' : 'black'}
              >
                {day.format('DD')}
              </SvgText>
            </Svg>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({

  container:{
    padding: 20,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 80,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})


export default WeeklyCal;
