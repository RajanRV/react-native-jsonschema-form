import React from "react";
import PropTypes from "prop-types";
import { View } from 'react-native'

import { rangeSpec } from "../../utils";

function RangeWidget(props) {
  const {
    schema,
    value,
    registry: {
      widgets: { BaseInput },
    },
  } = props;
  return (
    <View className="field-range-wrapper">
      <BaseInput type="range" {...props} {...rangeSpec(schema)} />
      <span className="range-view">{value}</span>
    </View>
  );
}

if (process.env.NODE_ENV !== "production") {
  RangeWidget.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
}

export default RangeWidget;
