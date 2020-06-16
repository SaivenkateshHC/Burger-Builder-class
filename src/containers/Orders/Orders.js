import React, { Component } from 'react'
import Order from '../../components/Order/Order/Order'
import axios from '../../axios-order'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/action/index'
import { connect } from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'

export class Orders extends Component {
    
    componentDidMount=()=>{
        this.props.onFetchOrder(this.props.idToken,this.props.localId)
    }
   
    render() {
     
        const orders=!this.props.loading ?
            (this.props.order.map(or=>(
                <Order
                    key={or.id}
                    ingredients={or.ingredients}
                    price={or.price}
                />

            ))):<Spinner/>
        
        return (
            <div>
            
               
                    {orders}
               
                
            </div>
        )
    }
}

const mapStateToProps =(state)=>{
    return{
        order:state.order.order,
        loading:state.order.loading,
        idToken:state.auth.idToken,
        localId:state.auth.localId
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        onFetchOrder:(idToken,localId)=>dispatch(actions.fetch_order(idToken,localId))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)( withErrorHandler(Orders, axios))
