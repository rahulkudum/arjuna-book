import Pform from "./components/pform";
import Book from "./components/book";
import { Route, Switch, Redirect } from "react-router-dom";

function App() {
 return (
  <Switch>
   <Route
    exact
    path="/"
    component={() => {
     window.location.href = "https://amalmdas.com/author/";
     return null;
    }}
   />
   <Route exact path="/book/:name">
    <Book />
   </Route>
   <Route path="/booklaunch" render={() => <Redirect to="/book/Parenting Teenagers" />} />
   <Route path="/payment">
    <Pform />
   </Route>
  </Switch>
 );
}

export default App;
