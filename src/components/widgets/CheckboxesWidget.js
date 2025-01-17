import React from "react";
import { View, Text, StyleSheet } from 'react-native'
import CheckBox from 'react-native-check-box'
import { getStyle } from '../../utils'
import _ from 'lodash'
function CheckboxsWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onChange,
    styleSheet,
    enumOptions
  } = props;
  let uniqueItems = {}
  for (let item of props.options.enumOptions) {
    uniqueItems[item.value] = item
  }
  props.options.enumOptions = Object.keys(uniqueItems).map(key => uniqueItems[key])
  let widgetStyle = (styleName) => getStyle(styleSheet, styleName, "CheckboxsWidget")
  let checkboxs = _.map(props.options.enumOptions, (option) => {
    let checked = false
    if (Array.isArray(value)) {
      checked = value.includes(option.value)
    } else {
      checked = value == option.value
    }
    return (
      <View style={[styles.content, widgetStyle('content')]}
        key={option.value}>
        <CheckBox
          id={id}
          unCheckedImage={<View style={{ width: 22, height: 22, backgroundColor: 'white' }} />}
          uncheckedCheckBoxColor={'#6DA1B7'}
          checkedCheckBoxColor={'#6DA1B7'}
          required={required}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onClick={() => { onChange(Array.isArray(value) ? (value.find(val => val === option.value) ? value.filter(val => val !== option.value) : [...value, option.value]) : option.value) }}
          isChecked={checked}
          style={{ marginRight: 10, width: '10%' }}
        />
        <Text style={[styles.text, widgetStyle('text')]} >{option.label}</Text>
      </View>
    )
  })
  return (
    <View style={[styles.container, widgetStyle('container')]}>
      {checkboxs}
    </View>
  )


}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10

  },
  content: {
    flexDirection: "row",
    minHeight: 25,
    width: '90%',
    marginTop: 10
  },
  text: {
    width: '90%',
    textAlign: "left"
  },
})

export default CheckboxsWidget;
