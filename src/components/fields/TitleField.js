import React from "react";
import { View, Text, StyleSheet } from 'react-native'
import { getStyle } from '../../utils'

const REQUIRED_FIELD_SYMBOL = "*";
function TitleField(props) {
  const { id, title, required, styleSheet } = props;
  let widgetStyle = (styleName) => getStyle(styleSheet, styleName, "TitleField")
  return (
    <View style={[styles.container, widgetStyle('container')]}>
      <Text style={[styles.text, widgetStyle('text')]}>{title}{required && " " + REQUIRED_FIELD_SYMBOL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',  // Align text and other elements vertically
    marginTop: 25,
    // padding: 5,
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: '500',  // Adjust font weight as needed
    fontSize: 20,  // Adjust font size as needed
    color: '#333',  // Set the text color to match your design
  },
})

export default TitleField;
