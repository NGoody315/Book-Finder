import React, { Component } from "react";
import { Switch, Route, Link, Redirect, withRouter } from "react-router-dom";

import Input from "./Input";
import CardList from "./CardList";
import DataService from "./service/dataservice";
import Loader from "react-loader-spinner";
import Error from "./Error";
import LandingPage from "./LandingPage";
import SinglePage from "./SinglePage";
import Header from "./Header";
import {
  saveInBookshelf,
  checkLocalStorage,
  saveInQueries
} from "./service/localStorage";
import { fetchingData } from "./service/fetchingData";

import "./css/App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      cards: [],
      loading: false,
      error: false,
      errorType: "",
      bookshelf: [],
      singlePage: false,
      dropDown: "none",
      queries: []
    };
    this.saveInBookshelf = saveInBookshelf.bind(this);
    this.checkLocalStorage = checkLocalStorage.bind(this);
    this.fetchingData = fetchingData.bind(this);
    this.saveInQueries = saveInQueries.bind(this);
  }

  componentDidMount() {
    this.checkLocalStorage();
  }

  onInputChange = event => {
    this.setState({
      input: event.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    // setting loader
    this.setState({
      loading: true,
      error: false,
      errorType: "",
      dropDown: "none"
    });
    // mistake - empty input
    if (this.state.input.length === 0) {
      this.setState({
        error: true,
        errorType: "empty input"
      });
    } else {
      // fetching
      this.fetchingData();
    }
    this.saveInQueries(this.state.input);
    this.props.history.push("/");
    // console.log("props: ", this.props);
  };
  // making sure that mistake is removed
  onClick = () => {
    this.setState({ error: false, errorType: "" });
  };
  clearInput = () => {
    this.setState({ input: "" });
  };

  showDropDownMenu = () => {
    this.setState({
      dropDown: "block"
    });
  };
  hideDropDownMenu = e => {
    this.setState({
      dropDown: "none"
    });
  };

  chooseFromDropMenu = e => {
    e.stopPropagation();
    this.setState(
      {
        input: e.target.dataset.value,
        dropDown: "none"
      },
      // fetching data after setState updates
      () => {
        this.fetchingData();
      }
    );
  };
  render() {
    // console.log(this.state.bookshelf);
    return (
      <div className="App">
        <div className="wrapper">
          <Header />
          <Input
            chooseFromDropMenu={this.chooseFromDropMenu}
            showDropDownMenu={this.showDropDownMenu}
            hideDropDownMenu={this.hideDropDownMenu}
            dropDown={this.state.dropDown}
            queries={this.state.queries}
            clearInput={this.clearInput}
            inputText={this.state.input}
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
            onClick={this.onClick}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  {/* <Input
                  clearInput={this.clearInput}
                  inputText={this.state.input}
                  onInputChange={this.onInputChange}
                  onSubmit={this.onSubmit}
                  onClick={this.onClick}
                /> */}
                  {// first check is there any error
                  this.state.error ? (
                    <Error error={this.state.errorType} />
                  ) : this.state.loading ? ( // if there is no error check if the page is loading
                    <div style={{ marginTop: "100px" }}>
                      <Loader
                        type="Circles"
                        color="#ff6f00"
                        marginTop="100px"
                        marginTop={100}
                        height={200}
                        width={200}
                        className="loader"
                      />
                    </div>
                  ) : this.state.cards.length > 0 ? ( // if there is no eror and page is not laoding check if you need to show card list or landing page
                    <CardList
                      bookshelf={this.state.bookshelf}
                      saveInBookshelf={this.saveInBookshelf}
                      cards={this.state.cards}
                      loading={this.state.loading}
                    />
                  ) : (
                    <LandingPage />
                  )}
                </div>
              )}
            />
            <Route
              exact
              path="/bookshelf"
              render={() => (
                <CardList
                  bookshelf={this.state.bookshelf}
                  saveInBookshelf={this.saveInBookshelf}
                  cards={this.state.bookshelf}
                  loading={this.state.loading}
                />
              )}
            />
            <Route
              path="/:id"
              render={props => {
                return (
                  <SinglePage
                    id={props.match.params.id}
                    saveInBookshelf={this.saveInBookshelf}
                    bookshelf={this.state.bookshelf}
                  />
                );
              }}
            />
          </Switch>
        </div>
        <footer>Happy Reading! ?????? </footer>
      </div>
    );
  }
}

export default withRouter(App);
