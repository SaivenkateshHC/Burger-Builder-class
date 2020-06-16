import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';

import {connect} from 'react-redux'
// import * as actionType from '../../store/action/index'

export class Checkout extends Component {

	// before using redux

	// state = {
    //     ingredients: null,
    //     price:null
	// };
	// UNSAFE_componentWillMount(){
	// 	const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let prices=0;
	// 	for (let param of query.entries()) {
    //         if(param[0]==='price'){
    //             prices = +param[1]
    //         } 
    //         else{
    //             ingredients[param[0]] = +param[1];
    //         }
			
	// 	}
	// 	this.setState({ ingredients: ingredients , price: prices });
	// 	console.log('object')
	// }


	CancelHandler = () => {
		this.props.history.goBack();
	};
	ContinueHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	};
	render() {

		let summary = <Redirect to='/'/>
		if(this.props.ings){
			const purchase=this.props.purchased?<Redirect to='/' />:null
			summary=(
				<div>
					{purchase}
					<CheckoutSummary
					ingredients={this.props.ings}
					CheckoutCancel={this.CancelHandler}
					CheckoutContinue={this.ContinueHandler}
					/>
					<Route path={this.props.match.path +'/contact-data'} 
				
				// before redux
                // render={(props)=>(
                //     <ContactData ingredients={this.state.ingredients} price={this.state.price} {...props} />

				// )
				
				// after redux
				component={ContactData}

                

                 /> {/*end of router*/}
					
				</div>
			)
		}
		return summary
	}
}

const mapStateToProps=(state)=>{
	return{
		ings: state.burgerBuilder.ingredients,
		purchased:state.order.purchased

	}
}

export default connect(mapStateToProps)(Checkout);
