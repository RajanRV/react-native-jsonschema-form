import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text, I18nManager } from 'react-native'
import { TextInput } from 'react-native-paper';
function BaseInput(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id) {
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const {
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    options,
    schema,
    formContext,
    registry,
    rawErrors,
    isNumberField,
    ...inputProps
  } = props;

  inputProps.type = options.inputType || inputProps.type || "text";
  const _onChange = (value) => {
    return props.onChange(value === "" ? options.emptyValue : value);
  };
  if (inputProps.label) {
    inputProps.label = inputProps.required ? `${inputProps.label} *` : inputProps.label
  }
  return (
    <View>

      <TextInput
        style={[styles.input, I18nManager.isRTL ? { textAlign: 'right' } : {}]}
        readOnly={readonly}
        disabled={disabled}
        autoFocus={autofocus}
        value={value == null ? "" : value}
        {...inputProps}
        onChangeText={_onChange}
        onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
        onFocus={onFocus && (event => onFocus(inputProps.id, event.target.value))}
        keyboardType={isNumberField ? "number-pad" : "default"}

        outlineStyle={{ borderWidth: 1 }}
        mode='outlined'
        outlineColor={"#BCBCBC"}
        activeOutlineColor={"#2B9348"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    // height: 40,
    // borderWidth: 1,
    // borderRadius: 8,
    // paddingHorizontal: 10,
    // marginTop: 5,
    // fontSize: 16,
    // borderColor: '#6DA1B7', // Border color
    // backgroundColor: 'white', // Background color
    // color: '#333', // Text color
    // marginBottom: 10,



    width: '100%',
    backgroundColor: 'transperent',
    borderColor: '#BCBCBC',
    borderRadius: 8,
    padding: 0,
    backgroundColor: 'white',

  },
})

BaseInput.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default BaseInput;
