import React from "react";
import PropTypes from "prop-types";
import { TextInput, StyleSheet, View, I18nManager, Platform } from 'react-native'
import { getStyle } from '../../utils'
import { Text } from "react-native";

function TextareaWidget(props) {
  const {
    id,
    options,
    placeholder,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    styleSheet,
    label
  } = props;
  const _onChange = (text) => {
    return onChange(text || options.emptyValue);
  };
  return (
    <>
      <Text style={{ marginTop: 5 }}>{label}</Text>
    <View style={[styles.textAreaContainer, getStyle(styleSheet, 'textAreaContainer', 'TextareaWidget'), Platform.OS === 'ios' ? { alignItems: "flex-start" } : {}]} >
      <TextInput
        id={id}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        rows={options.rows}
        // onBlur={onBlur && (event => onBlur(id, event.target.value))}
        // onFocus={onFocus && (event => onFocus(id, event.target.value))}
        onChangeText={(text) => _onChange(text)}
        numberOfLines={10}
        multiline={true}
        placeholder={placeholder || label || "Type something..."}
        placeholderTextColor='lightgray'
        style={[styles.textArea, getStyle(styleSheet, 'textArea', 'TextareaWidget')]}
        underlineColorAndroid="transparent"
      />
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#BCBCBC',  // Set the border color to match your design
    borderRadius: 4,  // Optional: Add border radius for rounded corners
    marginTop: 5,
    padding: 5,
    justifyContent: 'space-between',
  },
  textArea: {
    textAlignVertical: 'top',  // For Android
    padding: 10,
    height: 120,  // Adjust the height as per your design
    fontSize: 16,
    color: '#000',  // Set the text color to match your design
  },
})

TextareaWidget.defaultProps = {
  autofocus: false,
  options: {},
};

if (process.env.NODE_ENV !== "production") {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.number,
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default TextareaWidget;
