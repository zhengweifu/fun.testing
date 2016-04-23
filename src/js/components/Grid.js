/**
 * Grid component by fun.zheng
 */

import React from 'react';

export default class Grid extends React.Component {
	constructor(props) {

		super(props);

		this.state = {};
	} 

	render() {
		return (
			<div className={this.props.className}>
				{this.props.children}
			</div>
		);
	}

}