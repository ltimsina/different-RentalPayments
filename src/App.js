import React from "react";
import "./App.css";
import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom'
import Leases from "./Leases";

function NavLinks() {
  return (
    <div className="links">
      <NavLink to="/" className="link">Home</NavLink>
    </div>
  );
}

//Creating array of 4 random nos.
const Home = () => {
const rand = () => Math.floor(Math.random() * 1000);
const rands = [rand(), rand(), rand(), rand()];

  return (
    <div>
      <p>Click on any of the following to look at some data.<br /><br />
        <strong>Click on the home button above to refresh the ids</strong>
      </p>
      <hr />
      <p><NavLink to={"/leases.html?leaseId=" + rands[0]} >Click here to see lease detail for LeaseId: <strong>{rands[0]}</strong></NavLink></p>
      <p><NavLink to={"/leases.html?leaseId=" + rands[1]} >Click here to see lease detail for LeaseId: <strong>{rands[1]}</strong></NavLink></p>
      <p><NavLink to={"/leases.html?leaseId=" + rands[2]} >Click here to see lease detail for LeaseId: <strong>{rands[2]}</strong></NavLink></p>
      <p><NavLink to={"/leases.html?leaseId=" + rands[3]} >Click here to see lease detail for LeaseId: <strong>{rands[3]}</strong></NavLink></p>
    </div>
  );
}
class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <NavLinks />
          <hr />
          <div className="views">
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route path="/leases.html" component={Leases} />
              <Route render={() => <h1>404 Error</h1>} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
