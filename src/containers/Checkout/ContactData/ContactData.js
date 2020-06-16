import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from '../ContactData/ContactData.module.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'

import * as actionType from '../../../store/action/index'
import {connect} from 'react-redux'

import {updateUtility,checkValidity} from '../../../Shared/utility'

export class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Name',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched:false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'your email',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched:false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'street',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched:false
			},
			zip: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'zip-code',
				},
				value: '',
				validation: {
                    required: true,
                    minLength: 5,
				    maxlength: 5,
				},
				valid: false,
				touched:false

				
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'country',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched:false
			},
			payment_type: {
				elementType: 'select',
				valid: true,
				value:'cash',
				validation: {
					required: false,
				},
				
				elementConfig: {
					options: [
						{ value: 'cash', display_value: 'Cash' },
						{ value: 'card', display_value: 'Card' },
					],
					
				},
				
			
			},
			delivery_type: {
				elementType: 'select',
				valid: true,
				value:'fastest',
				validation: {
					required: false,
				},
				elementConfig: {
					options: [
						{ value: 'fastest', display_value: 'Fastest' },
						{ value: 'chepest', display_value: 'Chepest' },
					],
					
					
				},
				
			},
		},
		formIsValid :false,
		loading: false,
	};

	orderHandler = (event) => {
		this.setState({ loading: true });

		const formData = {};
		for (let elementIdentifiers in this.state.orderForm) {
			formData[elementIdentifiers] = this.state.orderForm[
				elementIdentifiers
			].value;
		}
		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
			localId: this.props.localId
		};

		this.props.onPurchaseOrder(order, this.props.token)
		// used before using redux advance

		// axios
		// 	.post('order.json', order)
		// 	.then((response) => {
		// 		this.setState({ loading: false });
		// 		this.props.history.push('/');
		// 		console.log('done');
		// 	})
		// 	.catch((error) => {
		// 		this.setState({ loading: false });
		// 	});

		alert('your order is submitted');
		event.preventDefault();
	};

	

	inputHandler = (event, inputIdentifier) => {
			
		let forValidation = this.state.orderForm[inputIdentifier]
		const updatedOrderElement = updateUtility(this.state.orderForm[inputIdentifier],{
			valid:checkValidity(
					forValidation.validation,
					event.target.value
					),
			value:event.target.value,
			touched:true
			
		})
		const updatedOrderForm = updateUtility(this.state.orderForm,{[inputIdentifier]:updatedOrderElement})

		
		
		
		let formValid = true
		for(let inputIdentifier in updatedOrderForm ){
			formValid = updatedOrderForm[inputIdentifier].valid && formValid
		}


		this.setState({ orderForm: updatedOrderForm ,formIsValid:formValid });
	};

	render() {
		const formElement = [];
		for (let key in this.state.orderForm) {
			formElement.push({ id: key, config: this.state.orderForm[key] });
		}

		let form = (
			<form onSubmit={this.orderHandler}>
				{formElement.map((formEl) => {
					return (
						<Input
							key={formEl.id}
							elementType={formEl.config.elementType}
							elementConfig={formEl.config.elementConfig}
							value={formEl.config.value}
							invalid = {!formEl.config.valid}
							shouldValidate={formEl.config.validation}
							touch = {formEl.config.touched}
							change={(event) => this.inputHandler(event, formEl.id)}
							
						/>
					);
				})}
				<Button btnType='Success'
					disable={!this.state.formIsValid}>ORDER</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}
		return <div className={classes.ContactData}>{form}</div>;
	}
}
const mapStateToProps = (state)=>{
	return{
		ings:state.burgerBuilder.ingredients,
		price:state.burgerBuilder.total_price,
		loading:state.order.loading,
		token:state.auth.idToken,
		localId:state.auth.localId
	}
}
const mapDispatchToProps = (dispatch)=>{
	return{
		onPurchaseOrder:(orderData, idToken)=>dispatch(actionType.purchase_order(orderData, idToken))
	}
}
export default connect(mapStateToProps,mapDispatchToProps)( withErrorHandler(ContactData, axios));
