/**
 * Col component by fun.zheng
 */

import React from 'react';

import classNames from 'classnames';

export default class Col extends React.Component {
	constructor(props) {

		super(props);

		this.state = {};
	} 

	render() {
		let Component = this.props.component;
		let classSet = {};
		let props = this.props;
		['xs', 'sm', 'md', 'lg'].forEach(function(size) {
			if(props[size]) {
				classSet[`col-${size}-${props[size]}`] = true;
			}
		});

		return (
			<Component 
			{...props}
			className={classNames(this.props.className, classSet)}>
				{this.props.children}
			</Component>
		);
	}

}

Col.propTypes = {
	xs: React.PropTypes.number,
	sm: React.PropTypes.number,
	md: React.PropTypes.number,
	lg: React.PropTypes.number,
	component: React.PropTypes.node
};

Col.defaultProps = {
	component: 'div'
};