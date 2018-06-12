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
            endYear: 0,
            totalCost: [0]
        }
    }

    //grab the changed values from startdate-input and modify state with the values
    startChange = (e) => {
        this.setState({
            startMonth: parseInt(e.target.value.slice(0, 2)),
            startDay: parseInt(e.target.value.slice(3, 5)),
            startYear: parseInt(e.target.value.slice(6))
        })
    }
    //grab the changed values from enddate-input and modify state with the values
    endChange = (e) => {
        this.setState({
            endMonth: parseInt(e.target.value.slice(0, 2)),
            endDay: parseInt(e.target.value.slice(3, 5)),
            endYear: parseInt(e.target.value.slice(6))
        })
    }
    //this method will get invoked when user clicks submit button. 
    submit = () => {

        //checks if startyear is bigger than endyear
        if (this.state.startYear > this.state.endYear) {
            alert('start year value has to be less than end year')
            //if it fails the test, reset state and enddate input
            this.setState({
                endYear: 0,
                endDay: 0,
                endMonth: 0
            })
            this.refs.endInput.value = ''
            return;
        }
        //check if startmonth is bigger than endmonth (startyear has to be equal or smaller)
        if (this.state.startMonth > this.state.endMonth && this.state.startYear >= this.state.endYear) {
            alert('start month value has to be less than end month')
            //if it fails the test, reset state and enddate input

            this.setState({
                endYear: 0,
                endDay: 0,
                endMonth: 0
            })
            this.refs.endInput.value = ''
            return;
        }
        //check if startday is equal or smaller (also check year and month)
        if (this.state.startDay >= this.state.endDay && this.state.startYear >= this.state.endYear && this.state.startMonth >= this.state.endMonth) {
            alert('start day value has to be less than end day')
            //if it fails the test, reset state and enddate input

            this.setState({
                endYear: 0,
                endDay: 0,
                endMonth: 0
            })
            this.refs.endInput.value = ''
            return;
        }
        const startDate = new Date(this.state.startYear, this.state.startMonth-1, this.state.startDay)
        const endDate = new Date(this.state.endYear, this.state.endMonth-1, this.state.endDay)
        const diffDay = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
        //used http get method because the data doesn't need to be secure (passed variables as params)

        return axios.get(`/calculate/${this.state.startMonth}/${this.state.startDay}/${this.state.startYear}/${diffDay}`)
            .then((response) => {
                //update state with the value from the server
                this.setState({
                    totalCost: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <div className='container'>
                <h1>Bob's <span className='banana'>Banana</span> Budget</h1>
                <p>Start Date (MM/DD/YYYY)</p>
                {/* used regex to receive data with correct format */}
                <input className='date-input' minLength='10' maxLength='10'
                    required='required' type="text" name="input" placeholder="MM/DD/YYYY"
                    onChange={(e) => this.startChange(e)} required pattern="(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d" />

                <p>End Date (MM/DD/YYYY)</p>
                {/* used regex to receive data with correct format */}
                <input className='date-input' minLength='10' maxLength='10'
                    required='required' ref='endInput' type="text" name="input" placeholder="MM/DD/YYYY"
                    onChange={(e) => this.endChange(e)} required pattern="(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d" />

                <button className='app-button' onClick={this.submit}>submit</button>
                {this.state.totalCost.map((item, i) => {
                    if (item > 0) {
                        return <div className='app-totalcost' key={i}>${item}</div>
                    }
                    return <div className='app-totalcost' key={i}></div>
                })}
            </div>
        )
    }
}


export default App;