import React,{Component} from 'react';
import Aux from '../Auxillary';
import Toolbar from '../../components/Navigation/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

import {connect} from 'react-redux'

class Layout extends Component{
	state={
		showSideDrawer:false
	}
	SideDrawerClosedHandler = ()=>{
		this.setState({showSideDrawer:false})
	}

	DrawerToggleHandler=()=>{
		this.setState((prevState)=>{
			return{showSideDrawer: !prevState.showSideDrawer}
		})
	}
	render () {
		return (
			<Aux>
				<Toolbar toggle = {this.DrawerToggleHandler} isAuth={this.props.isAuthenticated}/>
				<SideDrawer open={this.state.showSideDrawer} isAuth={this.props.isAuthenticated} closed = {this.SideDrawerClosedHandler}/>
				<main>{this.props.children}</main>
			</Aux>
		);
	}
	
}

const mapStateToProps = (state)=>{
	return{
		isAuthenticated: state.auth.idToken !=null
	}
}

	

export default connect(mapStateToProps)(Layout);
