import React, { Component } from 'react';
import OrgSignUp from './OrgSignUp.js'
import { connect } from 'react-redux'
import HomePage from './homePage.js'
import LogIn from './LogIn.js'


class MainContainner extends Component {
  render() {
    return (
        <div>
            {this.props.shHomepage ? (<HomePage />) : (<div></div>)}
            {this.props.shOrgSignUp ? (<OrgSignUp />) : (<div></div>)}
            {this.props.shLogIn ? (<LogIn />) : (<div></div>)}
        </div>
    );
  }
}
let mapStatetoProps = function (state) {
  return {
    shOrgSignUp: state.showOrgSignUp,
    shHomepage: state.showHomepage,
    shLogIn: state.showLogIn,
  }
}

let connectedMainContainner = connect(mapStatetoProps)(MainContainner)

export default connectedMainContainner;