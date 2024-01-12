import React from "react";
import PropTypes from "prop-types";
import DescriptionField from "../fields/DescriptionField.js";
import { View, Text, StyleSheet } from 'react-native'
import CheckBox from 'react-native-check-box'
import { getStyle } from '../../utils'



function CheckboxWidget(props) {
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
    styleSheet
  } = props;
  let checkValue = typeof value === "undefined" ? false : value
  let widgetStyle = (styleName) => getStyle(styleSheet, styleName, "CheckboxWidget")
  return (
    // className={`checkbox ${disabled || readonly ? "disabled" : ""}`}
    <View style={[styles.container, widgetStyle('container')]}>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}
      <CheckBox
        id={id}
        unCheckedImage={
          <View style={styles.checkboxUnCheckedImage}>
            {/* Customize the unchecked checkbox appearance */}
          </View>
        }
        checkedImage={
          <View style={styles.checkboxCheckedImage}>
            {/* Customize the checked checkbox appearance */}
          </View>
        }
        type="checkbox"
        uncheckedCheckBoxColor={'#6DA1B7'}
        checkedCheckBoxColor={'#6DA1B7'}
 
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onClick={() => { onChange(!checkValue) }}
        isChecked={checkValue}
      />
      <Text style={[styles.checkboxLabel, widgetStyle('text')]}>{label}</Text>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    padding: 5,
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: '100',
    width: '85%',
    textAlign: 'left'
  },
  checkboxContainer: {
    marginTop: 20,
    padding: 5,
    justifyContent: 'space-between',
    // Add any additional styling for the checkbox container
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // Customize the container styling as needed
  },
  checkboxImage: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    // Customize the checkbox image styling as needed
  },
  text: {
    fontWeight: '100',
    width: '85%',
    textAlign: 'left',
    // Customize the text styling as needed
  },
  checkboxLabel: {
    marginLeft: 10, // Adjust the spacing between checkbox and label
    fontSize: 16, // Customize the font size
    color: '#333', // Customize the text color
  },
  checkboxUnCheckedImage: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6DA1B7',
    backgroundColor: 'white', // Background color when unchecked
  },

  checkboxCheckedImage: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#6DA1B7', // Background color when checked
  },

})

CheckboxWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxWidget;
