import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { dataURItoBlob, shouldRender, setState } from "../../utils";
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from "@expo/vector-icons";
import RNFetchBlob from 'rn-fetch-blob';

const CALC_WIDTH = (Dimensions.get('screen').width / 3) - 36

function addNameToDataURL(dataURL, name) {
  return dataURL.replace(";base64", `;name=${name};base64`);
}

function processFile(file) {
  return new Promise((resolve, reject) => {
    if (typeof file.uri === 'string' && file.uri.startsWith(`data:${file.mimeType};base64,`)) {
      return resolve(file)
    } else {
      return RNFetchBlob.fs
        .readFile(file.uri, 'base64')
        .then((data) => {
          resolve({ ...file, uri: `data:${file.mimeType};base64,${data}` })
        })
        .catch((err) => reject(err));
    }
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
    <View style={{ ...styles.imagesContainer, ...styles.rounImageContainer }}>
      {filesInfo.map((fileInfo, key) => {
        const { name, size, mimeType } = fileInfo;

        return name && (
          <View style={styles.imageView} key={key}>
            <View style={styles.imageStyles}>
              <Ionicons name='file-tray-outline' size={30} color={colors.black} />
              <Text key={key}>
                {name}
                {/* ({mimeType}, {size} bytes) */}
              </Text>
            </View>
            {/* <Image source={{ uri: image.uri }} style={styles.imageStyles} /> */}
            <TouchableOpacity
              style={{ backgroundColor: colors.redBorder, padding: 5, borderRadius: 8, position: 'absolute', left: 6, top: 6 }}
              onPress={() => props.deleteFile(key)}
            >
              <Ionicons name='close' size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
        )

        return (
          name && (
            <Text key={key}>
              {name} ({mimeType}, {size} bytes)
            </Text>
          )
        );
      })}
    </View>
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
    const { multiple, type, copyToCacheDirectory } = this.props;

    const resp = await DocumentPicker.getDocumentAsync({ type: (type || '*/*'), multiple, copyToCacheDirectory: (copyToCacheDirectory || false) })
    this.handleFilePickerResp(resp)
  };

  handleFilePickerResp = (resp) => {
    const { multiple, onChange } = this.props;
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
  }

  deleteImage = (index) => {
    const filesInfo = this.state.filesInfo.filter((item, exindex) => exindex != index)
    this.handleFilePickerResp({ assets: filesInfo })
  }

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
            style={{
              ...({
                marginTop: 10,
                "alignItems": "center",
                "justifyContent": "center",
                "paddingVertical": 12,
                "paddingHorizontal": 32,
                "borderRadius": 4,
                "elevation": 3,
                "backgroundColor": "rgb(247, 144, 35)"
              }), ...(buttonStyles || {})
            }}
          >
            <Text style={{
              ...({
                "fontSize": 16,
                "lineHeight": 21,
                "fontWeight": "bold",
                "letterSpacing": 0.25,
                "color": "white"
              }), ...(buttonTextStyles || {})
            }}>{buttonText || "Browse"}</Text>
          </Pressable>
        </View>
        {FilesInfoComponent ? (
          <FilesInfoComponent filesInfo={filesInfo} />
        ) : (
          <FilesInfo filesInfo={filesInfo} deleteFile={this.deleteImage} />
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

const colors = {
  primary: '#2B9348',
  primaryTransparent: '#2B934844',
  black: '#363537',
  gray: '#79787A',
  white: '#F9F9F9',
  red: '#EF2D56',
  whitebg: '#E8F7E1',
  greenGoogle: '#173D07',
  grayBorders: '#BCBCBC',
  screenBg: '#f2f2f2',
  darkBlack: '#111111',
  darkGray: '#EFEFF0',
  lightGray: '#585758',
  borderGray: '#DEE6DB',
  orange: '#FF8F00',
  borderColor: '#EAEAEB',
  properBlack: '#000000',
  properWhite: '#ffffff',
  placeholder: '#D7D7D7',
  ligtGreen: '#F3FAF0',
  cardText: '#555555',
  lightRed: '#FAEEEB',
  redBorder: '#FFC9B9',
  lightText: '#585758',
  lightGreen: '#EBFAEF',
  greenBorder: '#D5E9DA',
  // orange: '#ED7D3A',
}

const styles = StyleSheet.create({
  rounImageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginStart: -8,
    justifyContent: 'space-between'
  },

  imageStyles: {
    width: CALC_WIDTH,
    height: CALC_WIDTH,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageView: {
    marginLeft: 8,
    borderColor: 'red',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: colors.darkGray,
    borderColor: colors.grayBorders,
    width: CALC_WIDTH,
    height: CALC_WIDTH,
    borderRadius: 8
  },
  imagesContainer: {
    marginTop: 8,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});