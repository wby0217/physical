import React, { Component } from 'react'
import { Text, View, Image, TouchableWithoutFeedback, Animated ,StyleSheet,TouchableOpacity} from 'react-native'

// external libs
import Icon from 'react-native-vector-icons/MaterialIcons'

class ToggleBox extends Component {

  static defaultProps = {
    arrowColor: 'rgb(178, 178, 178)',
    arrowSize: 30,
    arrowDownType: 'keyboard-arrow-down',
    arrowUpType: 'keyboard-arrow-up',
    expanded: false,
    style: {},
    value: null,
  }

  constructor(props) {
    super(props)

    this.icons = {
      'up': this.props.arrowUpType,
      'down': this.props.arrowDownType,
    }

    this.state = {
      expanded: this.props.expanded,
    }
  }

  toggle = () => {
    let initialValue = this.state.expanded ? (this.state.maxHeight + this.state.minHeight) : this.state.minHeight
    let finalValue = this.state.expanded ? this.state.minHeight : (this.state.minHeight + this.state.maxHeight)

    this.setState({
      expanded: !this.state.expanded
    })

    this.state.animation.setValue(initialValue)
    Animated.spring(
      this.state.animation,
      {
        toValue: finalValue,
        bounciness: 0,
      }
    ).start()
  }

  setMaxHeight = (event) => {
    if (!this.state.maxHeight) {
      this.setState({
        maxHeight: event.nativeEvent.layout.height
      })
    }
  }

  setMinHeight = (event) => {
    if (!this.state.animation) {
      this.setState({animation:
        this.state.expanded ?
          new Animated.Value() :
          new Animated.Value(parseInt(event.nativeEvent.layout.height))
      })
    }
    this.setState({
      minHeight: event.nativeEvent.layout.height
    })
  }

  render() {
    const icon = this.icons[this.state.expanded ? 'up' : 'down']

    return (
      <Animated.View style={[styles.box, this.props.style, {height: this.state.animation}]}>
        <TouchableOpacity
          onPress={this.toggle}
          onLayout={this.setMinHeight}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.label}>{this.props.label}</Text>
            {this.props.value ? <Text style={styles.value}>{this.props.value}</Text> : null}
            <Icon
              name={icon}
              color={this.props.arrowColor}
              style={styles.buttonImage}
              size={this.props.arrowSize}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.bodyView} onLayout={this.setMaxHeight}>
          {this.props.children}
        </View>
      </Animated.View>
    )
  }
}
export default ToggleBox


const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical:5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#fff',
    borderBottomColor:'#D5D5D5',
    borderBottomWidth:StyleSheet.hairlineWidth
  },
  label: {
    flex: 5,
    fontSize: 14,
    color: '#666'
  },
  value: {
    flex: 5,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonImage: {
    flex: 1,
    textAlign: 'right',
  },
  bodyView: {
    padding: 0,
  }
})