import React from "react";
import RNPickerSelect from 'react-native-picker-select';
import { asNumber } from "../../utils";
import _ from 'lodash'
import { Text, View, StyleSheet, Image, Platform } from 'react-native'
import { getStyle } from '../../utils'

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, value) {
  if (value == null) {
    return undefined;
  }
  else if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  return value;
}

function getValue(event, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else {
    return event.target.value;
  }
}

class SelectWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerSelect: ''
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let optionsFull = []
    this.props.options.enumOptions.forEach(element => {
      optionsFull.push(element.value)
    });
    if (this.props.value != null && !_.includes(optionsFull, this.props.value))
      this.props.onChange(processValue(this.props.schema, undefined))
  }

  render() {
    const {
      schema,
      id,
      options,
      value,
      required,
      disabled,
      readonly,
      multiple,
      autofocus,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      styleSheet,
    } = this.props;
    var { enumOptions, enumDisabled } = options;
    const emptyValue = multiple ? [] : placeholder ? placeholder : "";
    let optionsFull = []
    let label = undefined

    let values = {}
    enumOptions = enumOptions.filter((enumOp) => {
      if(values[enumOp.value]) {
        return false
      }
      values[enumOp.value] = true
      return true
    })

    enumOptions.forEach(element => {
      optionsFull.push(element.label)
      if (element.value == value)
        label = element.label
    });

    let widgetLabel = this.props.label
    // const valueverified=_.includes(optionsFull,value)?value:emptyValue
    // onChange(processValue(schema, valueverified))
    let widgetStyle = (styleName) => getStyle(styleSheet, styleName, "SelectWidget")
    return (
      <View style={{ marginTop: 10 }}>
        <Text>{widgetLabel} {required ? '*': ''}</Text>
        <RNPickerSelect
          id={id}
          disabled={disabled || readonly}
          items={enumOptions}
          required={required}
          multiple={multiple}
          autoFocus={autofocus}
          onValueChange={Platform.OS === 'ios' ? (value) => { this.setState({ pickerSelect: value }) } : value => { onChange(processValue(schema, value)) }}
          onDonePress={() => { onChange(processValue(schema, this.state.pickerSelect)) }}
          style={{
            chevronUp: {
              transform: [{ translateY: 17 }, { rotate: '45deg' }],
            },
            chevronDown: {
              transform: [{ translateY: 8 }, { rotate: '-135deg' }],
            },

          }}
        >
          <View style={[styles.content, widgetStyle('content')]}>
            {label ?
              <Text style={widgetStyle('text')}>{label}</Text>
              : <Text style={widgetStyle('placeHolderText')}>{emptyValue}</Text>}
            <Image
              source={require('../../images/dark.png')}
            />
          </View>
        </RNPickerSelect>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#BCBCBC', // Adjust the border color to match the text input box

    width: '100%',
    backgroundColor: 'transperent',
    borderColor: '#BCBCBC',
    borderRadius: 4,
    padding: 10,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginTop: 5
  },
  dropdownStyle: {
    height: 130
  },
  dropdownTextStyle: {
    textAlign: 'left',
    fontSize: 20
  },
  inputAndroid: {
    fontSize: 70,
    color: 'green'
  }
})

export default SelectWidget;
