import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder';

import logout from './containers/Auth/Logout/logout';

import asyncComponent from './hoc/asyncComponent/asyncComponent'

import * as action from './store/action/index';



const asyncCheckout = asyncComponent(()=>{
	return import ('./containers/Checkout/Checkout')
})

const asyncOrder= asyncComponent(()=>{
	return import ('./containers/Orders/Orders')
})

const asyncAuth = asyncComponent(()=>{
	return import ('./containers/Auth/Auth')
})

class App extends Component {
	componentDidMount() {
		return this.props.onAuthTry();
	}
	render() {
		let routes = (
			<Switch>
				<Route path='/' exact component={BurgerBuilder} />
				<Route path='/auth' component={asyncAuth} />
				<Redirect to='/'/>
			</Switch>
		);

		if (this.props.isAuthenticated) {
			routes = (
				<Switch>
					<Route path='/orders' exact component={asyncOrder} />
					<Route path='/checkout' component={asyncCheckout} />
					<Route path='/auth' component={asyncAuth} />

					<Route path='/logout' component={logout} />

					<Route path='/' exact component={BurgerBuilder} />
					<Redirect to='/'/>
				</Switch>
			);
		}
		return (
			<div>
				<Layout>{routes}</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.idToken != null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuthTry: () => dispatch(action.auth_check_state()),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
