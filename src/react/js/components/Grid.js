/**
 * Grid component by fun.zheng
 */

import React from 'react';
import classNames from 'classNames';

export default class Grid extends React.Component {
	constructor(props) {

		super(props);

		this.state = {};
	} 

	render() {
		let Component = this.props.component;
		return (
			<Component className={classNames(this.props.className)}>
				{this.props.children}
			</Component>
		);
	}

}


Grid.propTypes = {
	component: React.PropTypes.node
};

Grid.defaultProps = {
	component: 'div'
};