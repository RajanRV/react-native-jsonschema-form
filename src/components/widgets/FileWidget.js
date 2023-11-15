import React, { Component } from "react";
import PropTypes from "prop-types";
import {Pressable, Text, View } from 'react-native'
import { dataURItoBlob, shouldRender, setState } from "../../utils";
import * as DocumentPicker from 'expo-document-picker';

function addNameToDataURL(dataURL, name) {
  return dataURL.replace(";base64", `;name=${name};base64`);
}

function processFile(file) {
  return new Promise((resolve, reject) => {
    resolve(file)
  });
}

function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo(props) {
  const { filesInfo } = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    // <ul className="file-info">
      filesInfo.map((fileInfo, key) => {
        const { name, size, mimeType } = fileInfo;
        return (
          name && (
            <Text key={key}>
              {name} ({mimeType}, {size} bytes)
            </Text>
          )
        );
      })
    // </ul>
  );
}

function extractFileInfo(dataURLs) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== "undefined")
    .map(dataURL => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

class FileWidget extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    const values = !value ? [] : Array.isArray(value) ? value : [value];
    this.state = { values, filesInfo: values };

    this.onChange.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onChange = async () => {
    const { multiple, onChange, type, copyToCacheDirectory } = this.props;

    const resp = await DocumentPicker.getDocumentAsync({ type: (type || '*/*'), multiple, copyToCacheDirectory: (copyToCacheDirectory || false) })
    processFiles(resp?.assets || []).then(filesInfo => {
      const state = {
        values: filesInfo.map(fileInfo => fileInfo.uri),
        filesInfo,
      };
      setState(this, state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  render() {
    const { multiple, id, readonly, disabled, autofocus } = this.props;
    const { filesInfo } = this.state;
    const { buttonStyles, buttonText, buttonTextStyles, FilesInfoComponent } = this.props.options
    return (
      <View>
        <View>
          <Pressable 
            ref={ref => this.inputRef = ref}
            onPress={this.onChange}
            disabled={readonly || disabled}
            style={{ ...(buttonStyles || {}) }}
          >
            <Text style={{ ...(buttonTextStyles || {}) }}>{buttonText || "Browse"}</Text>
          </Pressable>
        </View>
        {FilesInfoComponent ? (
          <FilesInfoComponent filesInfo={filesInfo} />
        ): (
          <FilesInfo filesInfo={filesInfo} />
        )}
      </View>
    );
  }
}

FileWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  FileWidget.propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    autofocus: PropTypes.bool,
  };
}

export default FileWidget;
