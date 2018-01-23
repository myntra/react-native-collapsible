import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  View,
  TouchableHighlight,
  ViewPropTypes,
} from 'react-native';

import Collapsible from './Collapsible';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(ViewPropTypes);

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
    parent:PropTypes.string /* if there is nested level of section and rows, we should maintain the parent child relationship.if the parent is undefined , then node is in root level hierarchy.*/
  };

  static defaultProps = {
    underlayColor: 'black',
  };

  constructor(props) {
    super(props);
    // if activeSection not specified, default to initiallyActiveSection
    this.state = {
      activeSections: [],
      activeSectionsDict:{},
      activeSection: props.activeSection !== undefined ? props.activeSection : props.initiallyActiveSection,
    };
  }

  _toggleSection(index) {
    const activeSectionsDict=this.state.activeSectionsDict
    var currentlySelectedSection=""
    if(this.props.parent === undefined){
      currentlySelectedSection=index.toString()
    }else{
      currentlySelectedSection=this.props.parent+'-'+index.toString()
    }
    if (activeSectionsDict[currentlySelectedSection]===undefined) {
        activeSectionsDict[currentlySelectedSection]=currentlySelectedSection
    }else{
        delete activeSectionsDict[currentlySelectedSection]
    }
    this.setState({activeSectionsDict})
    if (this.props.onChange) {
      this.props.onChange(currentlySelectedSection);
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
            {this.props.renderHeader(section, key, this.state.activeSectionsDict[this.props.parent===undefined ? key.toString():this.props.parent+'-'+key.toString()]!==undefined)}
          </TouchableHighlight>
          <Collapsible collapsed={this.state.activeSectionsDict[this.props.parent===undefined ? key.toString():this.props.parent+'-'+key.toString()]===undefined} {...collapsibleProps}>
            {this.props.renderContent(section, key, this.props.parent===undefined ? key : this.props.parent+'-'+key.toString())}
          </Collapsible>
        </View>
      ))}
      </View>
    );
  }
}

module.exports = Accordion;
