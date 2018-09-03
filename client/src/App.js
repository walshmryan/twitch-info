import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import ReactLoading from 'react-loading';

class App extends Component {

	constructor(props) {
		super(props);

		this.maxNodes = 11;
		this.state = {twitchName: '', botID: null, mpm: '', stream: true, chartData: null, working: false};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
		this.interval = setInterval(() => this.getData(), 2000);
	}

	componentWillUnmount() {
  		clearInterval(this.interval);
	}

	/*

	Inputs functions

	*/
	handleChange(event) {
    	this.setState({twitchName: event.target.value});
  	}

  	handleSubmit(event) {
		this.setState({working: true});
		let url = '/bot/' + this.state.twitchName;
		axios.get(url).then(res => {
			this.setState({botID: res.data});
		});
    	event.preventDefault();
	}

	handleInputChange(event) {
		this.setState({stream: event.target.checked});
	}

	/*

	Graph functions

	*/
	getData() {
		if(this.state.botID != null) {
			let url = '/bot/status/' + this.state.botID;
			axios.get(url).then(res => {
				this.setState({working: false});
				console.log(res.data.mpm);
				this.updateGraph(res.data.mpm)
			}).catch(error => {
				console.log(error);
				clearInterval(this.interval);
				this.setState({botID: null, mpm: '', chartData: null});
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
			ret.push('');
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

	render() {

		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">TwitchInfo</h1>
				</header>
				<div className="row">
					<div className="col"></div>
					<div className="col-md-8">
						<form onSubmit={this.handleSubmit} style={{marginTop: '20px'}}>
							<label>Twitch Name:</label>
							<input className="base-input" name="twitchName" type="text" value={this.state.twitchName} onChange={this.handleChange} />
							<input type="submit" className="go-button" value="Go"/>
							<label>Stream</label>
							<input name="showStream" type="checkbox" checked={this.state.stream} onChange={this.handleInputChange} />
						</form>
					</div>
					<div className="col"></div>
				</div>
				{this.state.working && <div style={{paddingTop: '100px', height: '64px', width:'100%'}}>
  					<div style={{marginLeft:'auto', marginRight:'auto', width:'64px', height:'64px'}}>
						  <ReactLoading type='bubbles' color='#6441a5'/>
					  </div>
				</div>}
				{this.state.chartData != null && <div className="row" style={{marginTop: '10px'}}>
					<div className="col"></div>
					<div className="col-md-4 shadow-container" style={{marginRight:'20px'}}>
						<Line style={{marginTop: '10px'}} data={this.state.chartData} width={480} height={270} ref="mpmChart"/>
					</div>
					{this.state.stream && <div className="col-md-4 shadow-container" style={{marginLeft:'20px', paddingLeft: '0px'}}>
						<iframe
							src={"https://player.twitch.tv/?channel=" + this.state.twitchName + "&muted=true"}
							height="270"
							width="480"
							frameborder="0"
							scrolling="no"
							allowfullscreen="true">
						</iframe>
					</div>}
					<div className="col"></div>
				</div>}
				{/* {this.state.chartData != null && <div className="row" style={{marginTop: '20px'}}>
					<div className="col"></div>
					<div className="col-md-8 shadow">
						Analytics
					</div>
					<div className="col"></div>
				</div>} */}
			</div>
		);
	}
}

export default App;
