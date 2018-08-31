import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

class App extends Component {

	constructor(props) {
		super(props);

		this.maxNodes = 11;

		this.state = {twitchName: '', botID: null, mpm: '', stream: false, chartData: null};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
		this.interval = setInterval(() => this.getData(), 4000);
	}

	componentWillUnmount() {
  		clearInterval(this.interval);
	}


	getData() {
		if(this.state.botID != null) {
			let url = '/bot/status/0';
			console.log(url);
			axios.get(url).then(res => {
				console.log(res.data.test);
				this.updateGraph(res.data.test)
			});
		}

	}

	updateGraph(newValue) {
		if(this.state.chartData == null) {
			newData = [newValue];
		} else {
			let dataset = this.refs.mpmChart.props.data.datasets[0].data;
			var newLabels = this.formLabels(dataset);
			var newData = this.formData(dataset, newValue);
		}

		const data1 = {
			labels: newLabels,
			datasets: [
				{
					label: 'MPM',
					fill: false,
					lineTension: 0.1,
					backgroundColor: '#6441a5',
					borderColor: '#6441a5',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: '#6441a5',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: '#6441a5',
					pointHoverBorderColor: '#6441a5',
					pointHoverBorderWidth: 2,
					pointRadius: 3,
					pointHitRadius: 10,
					data: newData
				}
			]
		};
		this.setState({chartData: data1});
	}

	formLabels(dataset) {
		let ret = []
		for(var i = 1; i < dataset.length; i++) {
			ret.push(i + '');
		}
		return ret
	}

	formData(data, y) {
		let ret = [];
		var i = data.length < this.maxNodes ? 0 : 1;
		for(i; i < data.length; i++) {
			ret.push(data[i]);
		}
		ret.push(y);
		return ret;
	}

	handleChange(event) {
    	this.setState({twitchName: event.target.value});
  	}

  	handleSubmit(event) {
		let url = '/bot/' + this.state.twitchName;
		axios.get(url).then(res => {
			this.setState({botID: res.data});
		});
    	event.preventDefault();
	}

	handleInputChange(event) {
		console.log(event);
		this.setState({stream: event.target.checked});
		console.log(event.target.checked);
	}

	render() {

		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">TwitchInfo</h1>
				</header>
				<div className="row" style={{marginTop: '20px'}}>
					<div className="col"></div>
					<div className="col-md-8 container shadow-lg rounded">
						<form onSubmit={this.handleSubmit}>
							<label>Twitch Name:</label>
							<input className="base-input" type="text" value={this.state.twitchName} onChange={this.handleChange} />
							<input type="submit" className="go-button" value="Go"/>
							<label>Stream</label>
							<input name="showStream" type="checkbox" checked={this.state.stream} onChange={this.handleInputChange} />
						</form>
						  {this.state.stream && this.state.botID != null &&<iframe
							src={"https://player.twitch.tv/?channel=" + this.state.twitchName + "&muted=true"}
							height="270"
							width="480"
							frameborder="0"
							scrolling="no"
							allowfullscreen="true">
						</iframe> }
						<div className="row">
							<div className="col"></div>
							<div className="col-md-6">
								{this.state.chartData != null && <Line data={this.state.chartData} width={100} height={40} ref="mpmChart"/>}
							</div>
							<div className="col"></div>
						</div>
					</div>
					<div className="col"></div>
				</div>
			</div>
		);
	}
}

export default App;
