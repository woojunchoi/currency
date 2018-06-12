import React, { Component } from 'react';
import style from './App.css'
import axios from 'axios'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startMonth: 0,
            startDay: 0,
            startYear: 0,
            endMonth: 0,
            endDay: 0,
            endYear: 0
        }
    }

    startChange = (e) => {
        this.setState({
            startMonth: parseInt(e.target.value.slice(0, 2)),
            startDay: parseInt(e.target.value.slice(3, 5)),
            startYear: parseInt(e.target.value.slice(6))
        })
        console.log(this.state)
    }

    endChange = (e) => {
        this.setState({
            endMonth: parseInt(e.target.value.slice(0, 2)),
            endDay: parseInt(e.target.value.slice(3, 5)),
            endYear: parseInt(e.target.value.slice(6))
        })
    }

    submit = () => {
        console.log(
            'getting here?'
        )
        if(this.state.startYear > this.state.endYear) {
            alert('start year value has to be less than end year')
            console.log(this.state.endYear, this.state.startYear)
            this.setState({
                endYear:0,
                endDay:0,
                endMonth:0
            })
            this.refs.endInput.value =''
            return;
        }
        if(this.state.startMonth > this.state.endMonth && this.state.startYear >= this.state.endYear) {
            alert('start month value has to be less than end month')
            this.setState({
                endYear:0,
                endDay:0,
                endMonth:0
            })
            this.refs.endInput.value =''
            return;
        }
        if(this.state.startDay >= this.state.endDay && this.state.startYear >= this.state.endYear && this.state.startMonth >= this.state.endMonth) {
            alert('start day value has to be less than end day')
            this.setState({
                endYear:0,
                endDay:0,
                endMonth:0
            })
            this.refs.endInput.value =''
            return;
        }
        return axios.get('/calculate')
        .then((response) => {console.log(response)})
        .catch((error) => {
            console.log(error)})
    }

    render() {
        return (
            <div className='container'>
                <p>start date (form MM/DD/YYYY)</p>
                <input className='date-input' minLength='10' maxLength='10'
                    required='required' type="text" name="input" placeholder="MM-DD-YYYY"
                    onChange={(e) => this.startChange(e)} required pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d" />
                <p>end date (form MM/DD/YYYY)</p>
                <input className='date-input' minLength='10' maxLength='10'
                    required='required' ref='endInput' type="text" name="input" placeholder="MM-DD-YYYY"
                    onChange={(e) => this.endChange(e)} required pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d" />
                <button onClick={this.submit}>submit</button>
            </div>
        )
    }
}


export default App;