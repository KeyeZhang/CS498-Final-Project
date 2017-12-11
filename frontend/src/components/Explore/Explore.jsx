import React, { Component } from 'react'
import { Button, Card, Image, Dropdown, Input, Item, Grid, Rating, Icon, Feed, Statistic, Header} from 'semantic-ui-react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link, Switch, withRouter} from 'react-router-dom'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import Navbar from '../Navbar/Navbar.jsx'
import ExploreCard from './ExploreCard.jsx'

import styles from './styles.scss'

const options_sort = [
  { key: 1, text: 'Sort By Expenses', value: "by_expenses"},
  { key: 2, text: 'Sort By Days', value: "by_days"}
]
const options_order = [
  { key: 1, text: 'Sort In Descending Order', value: "dsc"},
  { key: 2, text: 'Sort In Ascending Order', value: "asc"}
]

const options1 = [
  {
    key: '1',
    text: 'By Expenses',
    value: 'by_expenses',
    content: 'By Expenses',
  },
  {
    key: '2',
    text: 'By Days',
    value: 'by_days',
    content: 'By Days',
  }
]

const options2 = [
  {
    key: '3',
    text: 'Descending Order',
    value: 'Descending',
    content: 'Descending Order',
  },
  {
    key: '4',
    text: 'Ascending Order',
    value: 'Ascending',
    content: 'Ascending Order',
  }
]

class Explore extends Component {

  constructor(props) {
      super(props);
      this.state = {
        content: [],
        new_content: [],
        model_content: [],
        marker_con: [],
        rand: [],
        info: false,
        model: false,
        showingInfoWindow: false,
        activeMarker: {},
      }
      this.minm = 0;
      this.maxm = 999999999;
      this.mind = 0;
      this.maxd = 999999999;
      this.sort_1 = this.sort_1.bind(this);
      this.lat = 31.8566;
      this.lng = -88.3522;
      this.onMarkerClick = this.onMarkerClick.bind(this);
      this.onMapClicked = this.onMapClicked.bind(this);
      this.search = this.search.bind(this);
      this.money_c1 = this.money_c1.bind(this);
      this.money_c2 = this.money_c2.bind(this);
      this.day_c1 = this.day_c1.bind(this);
      this.day_c2 = this.day_c2.bind(this);
      this.getmore = this.getmore.bind(this);
      this.close = this.close.bind(this);
      this.onClickChange = this.onClickChange.bind(this);
  }

  componentDidMount() {
      console.log("Did");
      axios.get('/api/collections')
        .then((res) => {
            console.log(Math.ceil(Math.random() * res.data.data.length));
            console.log(this.state.content);
            this.setState({
              //lifecycle trigger
              content: res.data.data,
              new_content: res.data.data,
              rand: res.data.data[Math.ceil(Math.random() * res.data.data.length)]
            });
        })
        .catch((error) => {
            console.log(error);
        });
  }


  onMarkerClick(props, marker, e) {
    console.log("click");
    this.setState({
      marker_con: props.m,
      info: true,
      model: false,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked() {
    console.log("clicked");
    this.setState({
      info: false,
      showingInfoWindow: false,
      activeMarker: null
    });
  }

  search() {
    console.log("change money");
    let temp_content = [];
    if (this.maxm == '') this.maxm = 999999999;
    if (this.minm == '') this.minm = 0;
    if (this.maxd == '') this.maxd = 999999999;
    if (this.mind == '') this.mind = 0;
    for (let i = 0; i < this.state.content.length; i++) {
      if (this.state.content[i].money <= this.maxm && this.state.content[i].money >= this.minm
      && this.state.content[i].day <= this.maxd && this.state.content[i].day >= this.mind) {
        temp_content.push(this.state.content[i]);
      }
    }
    console.log(this.maxm);
    console.log(temp_content);
    this.setState({
      info: false,
      model: false,
      new_content: temp_content,
      showingInfoWindow: false,
      rand: temp_content[Math.ceil(Math.random() * temp_content.length)]
    });
  }

  money_c1(e) {
    this.minm = e.target.value;
  }
  money_c2(e) {
    this.maxm = e.target.value;
  }
  day_c1(e) {
    this.mind = e.target.value;
  }
  day_c2(e) {
    this.maxd = e.target.value;
  }

  sort_1(e){
    console.log(e);
    this.sort_1 = e;
    this.setState({});
  }

  sort_2(e){
    console.log(e);
    this.sort_2 = e;
    this.setState({});
  }

  close() {
    this.setState({
      model: false
    });
  }

  getmore() {
    console.log("more");
    let temp_content = [];
    for (let i = 0; i < this.state.new_content.length; i++) {
      if (this.state.new_content[i].Latitude == this.state.marker_con.Latitude &&
      this.state.new_content[i].Longitude == this.state.marker_con.Longitude) {
        temp_content.push(this.state.new_content[i]);
      }
    }
    console.log(temp_content);
    temp_content.sort(function(a,b) {
      return a.card_name.toLowerCase() > b.card_name.toLowerCase();
    });
    this.lat = this.state.marker_con.Latitude;
    this.lng = this.state.marker_con.Longitude;
    this.setState({
      model_content: temp_content,
      model: true
    });
  }

  onClickChange(){
    this.setState({});
  }

  render() {
      console.log("render");

      const map1 = {
        position: 'absolute',
        top: '20%',
        left: '3%',
        height: '75%',
        width: '67%'
      };

      const money1 = {
        position: 'absolute',
        top: '11%',
        left: '3%',
        width: '10%',
        zIndex: '100'
      };
      const money2 = {
        position: 'absolute',
        top: '11%',
        left: '23%',
        width: '10%',
        zIndex: '100'
      };
      const day1 = {
        position: 'absolute',
        top: '11%',
        left: '40%',
        width: '10%',
        zIndex: '100'
      };
      const day2 = {
        position: 'absolute',
        top: '11%',
        left: '60%',
        width: '10%',
        zIndex: '100'
      };

      const sub = {
        position: 'absolute',
        top: '11%',
        left: '73%',
        zIndex: '100'
      };
      const choice = {
        position: 'absolute',
        bottom: '3%',
        left: '88%',
        zIndex: '100'
      }

      const dropdown1 = {
        position: 'absolute',
        top: '10%',
        left: '7%',
        zIndex: '100'
      }

      const dropdown2 = {
        position: 'absolute',
        top: '10%',
        left: '37%',
        zIndex: '100'
      }

      const extra = (
        <div>
          <h5 className = "spend">Spend:&nbsp;${this.state.marker_con.money}</h5>
          <h5 className = "day">Time:&nbsp;{this.state.marker_con.day}&nbsp;Days</h5>
        </div>
      )

      if (this.state.model) {
        return(
          <div>
            <Navbar/>
              <Header as='h4' style = {dropdown1} >
                <Icon name='trophy' />
                <Header.Content>
                  Trending repos
                  {' '}
                  <Dropdown options={options1} defaultValue={options1[0].value} onChange = {(event, data) => this.sort_1(data.value)}/>
                </Header.Content>
              </Header>

              <Header as='h4' style = {dropdown2} >
                <Icon name='trophy' />
                <Header.Content>
                  Trending repos
                  {' '}
                  <Dropdown options={options2} defaultValue={options2[0].value} onChange = {(event, data) => this.sort_2(data.value)}/>
                </Header.Content>
              </Header>

            <div className = "bac">
              <Button className = "close" onClick = {this.close}>
                Go Back
              </Button>
              <div className = "model">
                <Grid divided>
                  <Grid.Row>
                      <Card.Group itemsPerRow={1}>

                {this.state.model_content
                  .map((pos) =>
                  {
                    return (
                      <ExploreCard cardinfo = {pos} getmore = {this.getmore}  onClickChange = {this.onClickChange}  isListCard = {true} />);
                  }
                )}
                      </Card.Group>
                  </Grid.Row>
                </Grid>
              </div>
            </div>

            <div className = "art">
                <p className = "city">
                  Paris
                </p>
                <p className = "quote">
                  Fuck every day
                </p>
            </div>

          </div>
        )
      } else {
        if (this.state.info) {
          return(
            <div>
              <Navbar/>
              <Input
                action={{ color: 'teal', labelPosition: 'left', icon: 'dollar', content: 'Expense' }}
                actionPosition='left'
                style = {money1}
                onChange = {this.money_c1}
                placeholder='Min Spend'
              />
              <Input
                style = {money2}
                onChange = {this.money_c2}
                placeholder='Max Spend'
              />
              <Input
                action={{ color: 'teal', labelPosition: 'left', icon: 'calendar', content: 'Duration' }}
                actionPosition='left'
                style = {day1}
                onChange = {this.day_c1}
                placeholder='Min Day'
              />
              <Input
                style = {day2}
                onChange = {this.day_c2}
                placeholder='Max Day'
              />
              <Button style = {sub} onClick = {this.search}>Search</Button>
              <Statistic size = 'huge' style = {choice}>
                <Statistic.Value>{this.state.new_content.length}</Statistic.Value>
                <Statistic.Label>Choices</Statistic.Label>
              </Statistic>



              <Map  style = {map1}
                    google = {this.props.google}
                    onClick = {this.onMapClicked}
                    zoom = {2}
                    initialCenter = {{
                      lat: this.lat,
                      lng: this.lng
                    }}>

                    {this.state.new_content
                      .map((pos) =>
                      {let lat_long = {lat: pos.Latitude, lng: pos.Longitude};
                        return (
                        <Marker key = {pos._id}
                          m = {pos}
                          position = {lat_long}
                          onClick = {this.onMarkerClick}
                        />);
                      }
                    )}

                    <InfoWindow
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}>
                        <div>
                          <h1>Here~~~!</h1>
                        </div>
                    </InfoWindow>

                    <div className = "mar">
                      <div className = "zhidi">
                        <ExploreCard cardinfo = {this.state.marker_con} getmore = {this.getmore} isListCard = {false}/>
                      </div>
                    </div>
              </Map>
            </div>
          )
        } else {
            return(
              <div>
                <Navbar/>
                <Input
                  action={{ color: 'teal', labelPosition: 'left', icon: 'dollar', content: 'Expense' }}
                  actionPosition='left'
                  style = {money1}
                  onChange = {this.money_c1}
                  placeholder='Min Spend'
                />
                <Input
                  style = {money2}
                  onChange = {this.money_c2}
                  placeholder='Max Spend'
                />
                <Input
                  action={{ color: 'teal', labelPosition: 'left', icon: 'calendar', content: 'Duration' }}
                  actionPosition='left'
                  style = {day1}
                  onChange = {this.day_c1}
                  placeholder='Min Day'
                />
                <Input
                  style = {day2}
                  onChange = {this.day_c2}
                  placeholder='Max Day'
                />
                <Button style = {sub} onClick = {this.search}>Search</Button>
                <Statistic size = 'huge' style = {choice}>
                  <Statistic.Value>{this.state.new_content.length}</Statistic.Value>
                  <Statistic.Label>Choices</Statistic.Label>
                </Statistic>

                <Map  style = {map1}
                      google = {this.props.google}
                      onClick = {this.onMapClicked}
                      zoom = {2}
                      initialCenter = {{
                        lat: this.lat,
                        lng: this.lng
                      }}>

                      {this.state.new_content
                        .map((pos) =>
                        {let lat_long = {lat: pos.Latitude, lng: pos.Longitude};
                          return (
                          <Marker key = {pos._id}
                            m = {pos}
                            position = {lat_long}
                            onClick = {this.onMarkerClick}
                          />);
                        }
                      )}

                      <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                          <div>
                            <h1>Here~~~!</h1>
                          </div>
                      </InfoWindow>

                      <div className = "mar1">
                        <div className = "zhidi">
                          <ExploreCard cardinfo = {this.state.rand} getmore = {this.getmore} isListCard = {true}/>
                        </div>
                      </div>
                </Map>
              </div>
            )
        }
      }
  }
}


export default GoogleApiWrapper({
  apiKey: "AIzaSyAJNbOFFGV2FE-yLYI8L-XWK5GG3Gpb-2U"
})(Explore)
