import React, {Component}from 'react';
import classes from '../Modal/Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/Auxillary'

class Modal extends Component{
	shouldComponentUpdate(nextProps, nextState){
		return nextProps.show !== this.props.show || nextProps.children !== this.props.children
	}

	render(){
	return (
		<Aux>
			<Backdrop show={this.props.show} close={this.props.closed} />
			<div
				className={classes.Modal}
				style={{
					transform: this.props.show ? 'translateY(0)' : 'translateY(-100)',
					opacity: this.props.show ? '1' : '0',
				}}>
				{this.props.children}
			</div>
		</Aux>
	);}
};

export default Modal;
