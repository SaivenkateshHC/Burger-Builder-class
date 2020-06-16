import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css'


import * as actions from "../../store/action/index";
import Spinner from '../../components/UI/Spinner/Spinner'
import {updateUtility, checkValidity} from '../../Shared/utility'

class Auth extends Component {

    state={
        control:{
            email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Email Address',
				},
				value: '',
				validation: {
                    required: true,
                    isEmail:true
                    
				},
				valid: false,
				touched:false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                },
                value: '',
                validation: {
                    required: true,
                    minLength:7
                   
                    
                },
                valid: false,
                touched:false
            },
           
        },
        isSignUp:true
       
    }
    componentDidMount(){
        if(!this.props.BuildingBuilder && this.props.authRedirected !== '/'){
            return this.props.onRedirect()

        }
    }
   
    
    inputHandler =(event, controlName)=>{
        const updatedControls =updateUtility(this.state.control,{
            
            [controlName]:updateUtility(this.state.control[controlName],{
                
                value:event.target.value,
                valid:checkValidity(this.state.control[controlName].validation,event.target.value),
                touched:true
                    }
                )
            }
        )
        this.setState({control:updatedControls})
    }

    submitHandler=(event)=>{
        event.preventDefault()
        this.props.onAuth(this.state.control.email.value,this.state.control.password.value,this.state.isSignUp)

    }
    signUpHandler =()=>{
      
        this.setState((prevState)=>{return{isSignUp:!prevState.isSignUp}})
      
    }

    render() {
        const formElement = [];
		for (let key in this.state.control) {
			formElement.push({ id: key, config: this.state.control[key] });
        }
        let form = (
        formElement.map((formEl) => {
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
        })
        )

        if(this.props.loading){
            form=<Spinner />
        }

        let errorMessage = null

        if(this.props.error){
            errorMessage=<p>{this.props.error.message}</p>
        }

        let authRedirected = null
        if(this.props.isAuthenticated){
            authRedirected=<Redirect to={this.props.authRedirected}/>
        }
        return (
            <div className={classes.Auth}>
                {authRedirected}
                <span>LOGIN</span>
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    
                    <Button btnType='Success'> LOGIN</Button>
                </form>
                <Button clicked={this.signUpHandler} btnType = 'Danger'> Switch to {this.state.isSignUp?'SignIN':'SignUP'}</Button>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        loading:state.auth.loading,
        error:state.auth.error,
        isAuthenticated:state.auth.idToken != null,
        BuildingBuilder:state.burgerBuilder.building,
        authRedirected:state.auth.redirecting

    }
}


const mapDispatchToProps = (dispatch)=>{
    return{
        onAuth:(email, password, isSignUp)=>dispatch(actions.auth(email, password, isSignUp)),
        onRedirect:()=>dispatch(actions.set_auth_redirect('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
