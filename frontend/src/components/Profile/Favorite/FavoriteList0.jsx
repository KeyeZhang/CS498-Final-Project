import _ from 'lodash'
import React, { Component } from 'react'
import { Button, Divider, Card, Grid, Image, Icon, Header, Modal} from 'semantic-ui-react'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchFavoriteCards, cancelFavorite} from '../../../actions';

import axios from 'axios'
import NavBar from '../../Navbar/Navbar.jsx'
import ProfileBar from '../Profile_bar.jsx'

import styles from './styles.scss'

class FavoriteList extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.renderCards = this.renderCards.bind(this);
  }

  componentDidMount() {
    this.props.fetchFavoriteCards();
  }

  renderCards(){
    return this.props.cards.map(card => {
        return <Card key = {card._id}>
        <Image src = {card.picture} />
          <Card.Content>
            <Card.Header>
              {card.city_name}
            </Card.Header>
            <Card.Meta>
              <span className='date'>
                Joined in 2015
              </span>
            </Card.Meta>
            <Card.Description>
              Expense: {card.money} <br />
              Days: {card.day}  <br />
              Description: {card.post_txt} <br />
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              22 Friends
            </a>
          </Card.Content>
          <Card.Content extra>

            <Button onClick={() => this.props.cancelFavorite(card._id, this.props.history)} content='Unlike' />
          </Card.Content>
        </Card>;
      });
  }

    render() {
      return(
        <div className = 'cardlist'>
          {this.renderCards()}

        </div>
      );
    }
  }


  function mapStateToProps(state) {
    console.log(state);
    return { cards: state.profile, iffavorite: state.iffavorite };
  }

  export default connect(mapStateToProps, { fetchFavoriteCards, cancelFavorite})(FavoriteList);
