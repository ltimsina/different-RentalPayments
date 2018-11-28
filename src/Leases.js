import React, { Component } from "react";
import "./App.css";
import moment from "moment";
import qs from "qs";

class Leases extends Component {
  constructor() {
    super();
    this.state = {
      rentalBreakdown: [],
      leaseData: {}
    };
  }

  componentWillMount() {
    // load data using the url parameter
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    
    //Fetching JSON
    fetch("https://hiring-task-api.herokuapp.com/v1/leases/" + query.leaseId)
      .then(res => res.json())
      .then(res => {
        const rentalContract = res;
        let contractStartDate = moment(rentalContract.start_date);
        let contractEndDate = moment(rentalContract.end_date);

        let paymentDay = rentalContract.payment_day;
        let frequency = rentalContract.frequency;

        // Getting frequency's number
        switch (frequency) {
          case "weekly":
            frequency = 7;
            break;
          case "fortnightly":
            frequency = 14;
            break;
          case "monthly":
            frequency = 30;
            break;
          default:
            console.log("Invalid frequency");
        }

        // Getting payment_day's day
        switch (paymentDay) {
          case "monday":
            paymentDay = 1;
            break;
          case "tuesday":
            paymentDay = 2;
            break;
          case "wednesday":
            paymentDay = 3;
            break;
          case "thursday":
            paymentDay = 4;
            break;
          case "friday":
            paymentDay = 5;
            break;
          case "saturday":
            paymentDay = 6;
            break;
          case "sunday":
            paymentDay = 0;
            break;
          default:
            console.log("Invalid Payment Day.");
        }

        let dates = [];

        const cycleStartDate = contractStartDate.clone();
        const cycleEndDate = contractEndDate.clone();

        let startArrearsDays = 0;
        if (contractStartDate.day() !== paymentDay) {
          while (cycleStartDate.day() - 1 !== paymentDay) {
            startArrearsDays += 1;
            cycleStartDate.add(1, "days");
          }
        }

        dates.push({
          days: startArrearsDays + 1,
          fromDate: contractStartDate.toDate(),
          toDate: cycleStartDate.toDate()
        });
        //Calculating From and To dates in the table
        cycleStartDate.add(1, 'days');
        while (contractEndDate.diff(cycleStartDate, "days") > 1) {
          const diff = cycleEndDate.diff(cycleStartDate, 'days');
          if (diff > frequency) {
            const range = {
              fromDate: cycleStartDate.toDate(),
              toDate: cycleStartDate.add(frequency - 1, "days").toDate()
            };
            range.days = moment(range.toDate).diff(moment(range.fromDate), "days") + 1;
            dates.push(range);
          }
          else {
            break;
          }
          cycleStartDate.add(1, "days");
        }
        //
        dates.push({
          fromDate: cycleStartDate.toDate(),
          toDate: contractEndDate.toDate(),
          days: contractEndDate.diff(cycleStartDate, 'days'),
        });

        const rentPerDay = rentalContract.rent / frequency;
        
        //Table datas
        let data = dates.map(dateRow => {
          return <tr key={Math.random()}>
            <td>{moment(dateRow.fromDate).format('MMMM Do YYYY').toString()}</td>
            <td>{moment(dateRow.toDate).format('MMMM Do YYYY').toString()}</td>
            <td>{dateRow.days}</td>
            <td>${+(rentPerDay * dateRow.days).toFixed(2)}</td>
          </tr>
        });

        this.setState({
          rentalBreakdown: data,
          leaseData: res
        });
      });
  }

  render() {
    return (
      <div>
        <p> Results for lease Id: <strong>{this.state.leaseData.id}</strong></p>
        <p> Paid <strong>{this.state.leaseData.frequency}</strong> on <strong>{this.state.leaseData.payment_day}s</strong></p>
        <table className="table table-bordered">
          <thead>
            <tr>
              {/* <th>Id</th> */}
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{this.state.rentalBreakdown}</tbody>
        </table>
      </div>
    );
  }
}

export default Leases;
