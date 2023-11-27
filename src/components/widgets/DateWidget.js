import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, I18nManager, Image } from 'react-native'
import { default as DropIcon } from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Calendar } from 'react-native-calendars'
import ReactModal from 'react-native-modal';
import _ from 'lodash'
import { getStyle } from '../../utils'

const today = moment().startOf('day')

class DateWidget extends React.Component {
  constructor(props) {
    super(props)

    const { dates } = this.getValidDates(props)
    const { schema } = props

    var startDay = moment('1700-01-01', 'YYYY-MM-DD')
    var endDate = moment('9999-01-01', 'YYYY-MM-DD')

    if (schema.minimum) {
      if (schema.minimum === 'today') {
        startDay = moment()
      } else {
        startDay = moment(schema.minimum)
      }
    }

    if (schema.maximum) {
      if (schema.maximum === 'today') {
        endDate = moment()
      } else {
        endDate = moment(schema.maximum)
      }
    }

    const startDayFormat = startDay.format('YYYY-MM-DD')
    // props.onChange(startDayFormat)
    this.state = {
      calander: false,
      calanderSelection: null,
      dateSelected: '',
      startDay: startDayFormat,
      endDate: endDate.format('YYYY-MM-DD'),
      possibleDates: dates,
      theme: {
        textSectionTitleColor: this.widgetStyle('textSectionTitleColor').color || 'rgb(247, 144, 35)',
        selectedDayBackgroundColor: this.widgetStyle('selectedDayBackgroundColor').color || 'rgb(247, 144, 35)',
        selectedDayTextColor: this.widgetStyle('selectedDayTextColor').color || '#ffffff',
        todayTextColor: this.widgetStyle('todayTextColor').color || 'rgb(247, 144, 35)',
        arrowColor: this.widgetStyle('arrowColor').color || 'rgb(247, 144, 35)',
        monthTextColor: this.widgetStyle('monthTextColor').color || 'rgb(247, 144, 35)',
        textDayFontFamily: this.widgetStyle('dateFonts').fontFamily || null,
        textMonthFontFamily: this.widgetStyle('dateFonts').fontFamily || null,
        textDayHeaderFontFamily: this.widgetStyle('dateFonts').fontFamily || null,
        textMonthFontWeight: this.widgetStyle('textMonthFontWeight').fontWeight || 'bold',
        textDayFontSize: this.widgetStyle('dateFonts').fontSize || 16,
        textMonthFontSize: this.widgetStyle('dateFonts').fontSize || 16,
        textDayHeaderFontSize: this.widgetStyle('dateFonts').fontSize || 16,
      }
    }
  }

  widgetStyle = (styleName) => getStyle(this.props.styleSheet, styleName, "DateWidget")


  getValidDates(props) {
    let dates = {}
    let possibleDates = {}
    let startDay = today //moment('1700-01-01', 'YYYY-MM-DD').startOf('day')
    let endDate = today //moment('4000-01-01', 'YYYY-MM-DD').startOf('day')
    // if (props.options.enumOptions) {
    //   props.options.enumOptions.forEach((options) => {

    //     let date = moment(options.value).startOf('day')

    //     if (date >= today && (startDay === null || date <= startDay)) {
    //       startDay = date
    //     }
    //     if ((endDate > today) && endDate === null || date >= endDate) {
    //       endDate = date
    //     }
    //     if (date < today) {
    //       possibleDates[options.value] = { disabled: true, disableTouchEvent: true }
    //     } else {
    //       possibleDates[options.value] = { disabled: false, disableTouchEvent: false }
    //     }
    //   })
    // }

    // let daysBetweenDates = moment.duration(endDate.diff(startDay)).asDays()

    // for (let i = 0; i <= daysBetweenDates; i++) {
    //   let formatDate = { [moment().add(i, 'd').format('YYYY-MM-DD')]: { disabled: true, disableTouchEvent: true } }
    //   dates = Object.assign(formatDate, dates)
    // }

    // _.forIn(possibleDates, (value, key) => {
    //   dates[key] = value
    // });


    const intial = { dates, startDay, endDate }

    return intial
  }

  toggleCalendar() {
    this.setState({
      calander: !this.state.calander
    })
  }

  onPressDay(date) {
    let myDates = _.cloneDeep(this.state.possibleDates)
    if (this.state.calanderSelection) {
      if (!myDates[this.state.calanderSelection]) {
        myDates[this.state.calanderSelection] = {}
      }
      myDates[this.state.calanderSelection].selected = false
    }
    if (!myDates[date.dateString]) {
      myDates[date.dateString] = {}
    }
    myDates[date.dateString].selected = true
    this.setState({
      possibleDates: myDates,
      calanderSelection: date.dateString
    });
  }

  getDate() {
    const dateUi = moment(this.state.calanderSelection).format('dddd, YYYY-MM-DD')
    const dateSchema = moment(this.state.calanderSelection).format('YYYY-MM-DD').toString()
    this.setState({ dateSelected: dateUi });
    this.toggleCalendar()
    this.props.onChange(dateSchema)
  }

  renderArrow(direction) {
    if (I18nManager.isRTL) {
      switch (direction) {
        case 'left':
          direction = 'right'
          break;
        case 'right':
          direction = 'left'
          break;
      }
    }
    return (
      <Icon
        name={`arrow-${direction}`}
        color={'rgb(247, 144, 35)'}
        size={18}
      />
    )
  }

  renderWidgetButton() {
    return (
      <TouchableOpacity style={[styles.content, this.widgetStyle('content')]} onPress={() => this.toggleCalendar()}>
        {this.state.dateSelected ?
          <Text style={[styles.dropText, this.widgetStyle('dropText')]} >{this.state.dateSelected}</Text> :
          <Text style={[styles.dropText, this.widgetStyle('placeholderdropText')]} >{this.props.schema.placeHolder}</Text>
        }
        <Image
          source={require('../../images/dark.png')}
        />
      </TouchableOpacity>
    )
  }

  renderCalander() {
    this.props.schema
    return (
      <View style={[styles.container, this.widgetStyle('container')]} >
        <Calendar
          theme={this.state.theme}
          onDayPress={(date) => this.onPressDay(date)}
          minDate={this.state.startDay}
          maxDate={this.state.endDate}
          markedDates={{ ...this.state.possibleDates }}
          renderArrow={direction => this.renderArrow(direction)}
          hideExtraDays={true}
        />
        {this.renderCalanderButton()}
      </View>
    )
  }


  renderCalanderButton() {
    return (
      <TouchableOpacity onPress={() => this.getDate()} style={styles.button} >
        <Text style={[styles.buttonText, this.widgetStyle('buttonText')]}>{this.props.schema.ChooseButtonText || "Select"}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <React.Fragment>
        <ReactModal
          isVisible={this.state.calander}
          animationIn="zoomIn"
          animationOut="zoomOut"
          onBackdropPress={() => { this.toggleCalendar() }}
          onBackButtonPress={() => { this.toggleCalendar() }}>
          {this.renderCalander()}
        </ReactModal>
        {this.renderWidgetButton()}
      </React.Fragment>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  content: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "rgba(255,255,255,0.9)",
    marginTop: 5,
    marginBottom: 5
  },
  button: {
    backgroundColor: 'rgb(247, 144, 35)',
    height: 50,
    width: '90%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
})

export default DateWidget;
