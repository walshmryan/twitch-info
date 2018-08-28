import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {

	state = {
    	posts: []
  	}

	componentDidMount() {
		axios.get('/bot/rmwalshy')
		.then(res => {
			console.log(res);
			// const posts = res.data.data.children.map(obj => obj.data);
			// this.setState({ posts });
		});
	}

	render() {
		return (
		<div className="App">
			<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<h1 className="App-title">Welcome to React</h1>
			</header>
			<p className="App-intro">
				Yo
			</p>
		</div>
		);
	}
}

export default App;
