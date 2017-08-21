import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  View,
  TouchableHighlight,
} from 'react-native';

import Collapsible from './Collapsible';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(View.propTypes);

class Accordion extends Component {
  static propTypes = {
    sections: PropTypes.array.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    duration: PropTypes.number,
    easing: PropTypes.string,
    initiallyActiveSection: PropTypes.number,
    activeSection: PropTypes.oneOfType([
      PropTypes.bool, // if false, closes all sections
      PropTypes.number, // sets index of section to open
    ]),
    activeSections: PropTypes.array.isRequired,
    underlayColor: PropTypes.string,
  };

  static defaultProps = {
    underlayColor: 'black',
  };

  constructor(props) {
    super(props);
    // if activeSection not specified, default to initiallyActiveSection
    this.state = {
      activeSections: [],
      activeSection: props.activeSection !== undefined ? props.activeSection : props.initiallyActiveSection,
    };
  }

  _toggleSection(section) {
    const activeSections = this.state.activeSections;
    const index = activeSections.indexOf(section);
    let activeSection = section;
    if (index > -1) {
      activeSection = false;
      activeSections.splice(index, 1);
    } else {
      activeSections.push(section);
    }
    this.setState({ activeSections });
    this.setState({ activeSection });

    if (this.props.onChange) {
      this.props.onChange(activeSection);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeSections !== undefined) {
      this.setState({
        activeSections: nextProps.activeSections,
      });
    }
  }

  render() {
    let viewProps = {};
    let collapsibleProps = {};
    Object.keys(this.props).forEach((key) => {
      if (COLLAPSIBLE_PROPS.indexOf(key) !== -1) {
        collapsibleProps[key] = this.props[key];
      } else if (VIEW_PROPS.indexOf(key) !== -1) {
        viewProps[key] = this.props[key];
      }
    });

    return (
      <View {...viewProps}>
      {this.props.sections.map((section, key) => (
        <View key={key}>
          <TouchableHighlight onPress={() => this._toggleSection(key)} underlayColor={this.props.underlayColor}>
            {this.props.renderHeader(section, key, this.state.activeSections.indexOf(key) !== -1)}
          </TouchableHighlight>
          <Collapsible collapsed={this.state.activeSections.indexOf(key) === -1} {...collapsibleProps}>
            {this.props.renderContent(section, key, this.state.activeSection === key)}
          </Collapsible>
        </View>
      ))}
      </View>
    );
  }
}

module.exports = Accordion;
