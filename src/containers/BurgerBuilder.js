import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as BurgerBuilderActions from '../store/action/index'



import Aux from '../hoc/Auxillary';
import Burger from '../components/Burger/Burger';
import BurgerControls from '../components/Burger/BuildControls/BuildControls';
import Modal from '../components/UI/Modal/Modal';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import axios from '../../src/axios-order';
import Spinner from '../components/UI/Spinner/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';




export class BurgerBuilder extends Component {
	// constructor(){
	// 	super(props)
	// 	this.state =
	// }

	state = {
		
		// purchasable: false,
		confrimOrder: false,
		loading: false,
		
	};
	componentDidMount() {
		this.props.onInitIngredients()
	}

	updatePurchase(ingredients) {
		const sum = Object.keys(ingredients)
			.map((ingkey) => {
				return ingredients[ingkey];
			})
			.reduce((sum, ele) => {
				return sum + ele;
			}, 0);
		// this.setState({purchasable: sum > 0 })	
		return( sum > 0);
	}

	// addIngredients = (types) => {
	// 	const oldCount = this.state.ingredients[types];
	// 	const updatedCount = oldCount + 1;
	// 	const updatedIngredients = {
	// 		...this.state.ingredients,
	// 	};
	// 	updatedIngredients[types] = updatedCount;
	// 	const priceValue = INGREDIENTS_PRICE[types];
	// 	const oldPrice = this.state.total_price;
	// 	const priceAddition = oldPrice + priceValue;

	// 	this.setState({
	// 		total_price: priceAddition,
	// 		ingredients: updatedIngredients,
	// 	});
	// 	this.updatePurchase(updatedIngredients);
	// };

	// removeIngredients = (types) => {
	// 	const oldCount = this.state.ingredients[types];
	// 	if (oldCount <= 0) {
	// 		return;
	// 	}
	// 	const updatedCount = oldCount - 1;
	// 	const updatedIngredients = {
	// 		...this.state.ingredients,
	// 	};
	// 	updatedIngredients[types] = updatedCount;
	// 	const priceValue = INGREDIENTS_PRICE[types];
	// 	const oldPrice = this.state.total_price;
	// 	const priceDediction = oldPrice - priceValue;

	// 	this.setState({
	// 		total_price: priceDediction,
	// 		ingredients: updatedIngredients,
	// 	});
	// 	this.updatePurchase(updatedIngredients);
	// };

	orderConformation = () => {

		if(this.props.isAuthenticated){
			
			this.setState({ confrimOrder: true });
		}else{
		
			this.props.onRedirect('/checkout/')
			this.props.history.push('/auth')
		
		}
		
		
	};
	cancelOrder = () => {
		this.setState({ confrimOrder: false });
		
	};
	continueOrder = () => {
		//customer details are hardcoded

		// this.setState({ loading: true, purchasable: false });
		// const order = {
		// 	ingredients: this.state.ingredients,
		// 	price: this.state.total_price,
		// 	customer: {
		// 		name: 'sai',
		// 		address: 'dubai kuruku santhu, dubai',
		// 		email: 'dubakoor@fraudmail.com',
		// 	},
		// 	delivery_type: 'cash',
		// };
		// axios
		// 	.post('order.json', order)
		// 	.then((response) => {
		// 		this.setState({ loading: false, purchasable: true });
		// 	})
		// 	.catch((error) => {
		// 		this.setState({ loading: false, purchasable: true });
		// 	});

		// alert('your order is submitted');

		// using query params

		// const queryParams = []
		// for(let i in this.state.ingredients ){
		// 	queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
		// }
		
		// queryParams.push('price=' + this.state.total_price)
		// const queryString = queryParams.join('&')
		// this.props.history.push({
		// 	pathname:'/checkout/',
		// 	search: '?'+ queryString
			
		// })
		// console.log(queryString)


		//after using redux
		this.props.onPurchaseInit()
		
		this.props.history.push('/checkout/')
	};

	render() {
		const disabledInfo = {
			...this.props.ings,
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		let orderSummary = null;

		let burger = this.props.error ? (
			<p>ingredients failed to load</p>
		) : (
			<Spinner />
		);

		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BurgerControls
						addingIngredient={this.props.onAddIngredients}
						removingIngredient={this.props.onRemoveIngredients}
						disabled={disabledInfo}
						purchasable={this.updatePurchase(this.props.ings)}
						ordering={this.orderConformation}
						auth = {this.props.isAuthenticated}
						price={this.props.price}
					/>
				</Aux>
			);
			orderSummary = (
				<OrderSummary
					price={this.props.price}
					ingredients={this.props.ings}
					cancelling={this.cancelOrder}
					continuing={this.continueOrder}
				/>
			);
		}

		if (this.state.loading) {
			orderSummary = <Spinner />;
		}

		return (
			<Aux>
				<Modal show={this.state.confrimOrder} closed={this.cancelOrder}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps =(state)=> {
	return{
		ings: state.burgerBuilder.ingredients,
		price : state.burgerBuilder.total_price,
		error: state.burgerBuilder.error,
		isAuthenticated : state.auth.idToken != null
	}
}

const mapDispatchToProps = (dispatch)=>{
	return{
		onAddIngredients:(ingi)=>dispatch(BurgerBuilderActions.addIngredients(ingi)),
		onRemoveIngredients:(ingi)=>dispatch(BurgerBuilderActions.removeIngredients(ingi)),
		onInitIngredients:()=>dispatch(BurgerBuilderActions.init_ingredients()),
		onPurchaseInit:()=>dispatch(BurgerBuilderActions.purchase_init()),
		onRedirect:(path)=>dispatch(BurgerBuilderActions.set_auth_redirect(path))
	}
}


export default connect( mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
