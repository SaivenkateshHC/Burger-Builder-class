import React, { Component } from 'react'

import * as action from '../../../store/action/index'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

export class logout extends Component {
    
    componentDidMount(){
        this.props.logout()
    }

    render() {

        return <Redirect to="/"/>
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        logout:()=>dispatch(action.logout())
    }
}
export default connect(null,mapDispatchToProps)(logout)
