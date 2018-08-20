import React, { Component } from 'react';
import { Card, Icon, Image,Grid, Button,Modal, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Chat from './Chat.js'
import BidLog from './bidLog.js'
import Timer from './timer.js'

class OrgHomeItemDisp extends Component {
    constructor() {
        super();
        this.state = {toAuction:[], auctioned:[]}
    }
    filterItemsByOrgId = () => {
        fetch('/getItems')
          .then(response => response.text())
          .then(responseBody => {
            let parsedBody = JSON.parse(responseBody);
            let itemList = parsedBody.items;
            this.props.dispatch({
                type: 'getItems',
                content: itemList
            })
          }) 
        let itemsFiltred = this.props.items.filter(item => item.state === "TO_AUCTION" && item.orgId === this.props.currOrg);
        let itemsAuctioned = this.props.items.filter(item => item.state === "AUCTIONED" && item.orgId === this.props.currOrg)
        this.setState({ toAuction: itemsFiltred, auctioned: itemsAuctioned });  
    }
    
    handleEditClick = (item) => {
        this.props.dispatch({
            type: 'showEditItem',
            content: item
        })
    }

    handleCancelClick = (item) => {
        fetch('/cancelItem', {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'include',
            body: JSON.stringify({'itemId': item.itemId})
        })
        this.props.dispatch({
            type: 'showOrgPage',
            content: this.props.currOrg
        })
    }
    formatItems = (x) => {
        if (x === 1) {
            let firstList = this.state.toAuction
            let filteredList = firstList.map((i) => {
                return (
                    
                    <Card>
                        <Image src={'/images/' + i.images} />
                        <Card.Content>
                        <Card.Header>{i.title}</Card.Header>
                        <Card.Meta>Bid Ends: {i.bidFinDate}</Card.Meta>
                        <Card.Description>{i.description}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='dollar sign' />
                            {i.lastPrice}
                        </Card.Content>
                        <Card.Content extra>
                            <Modal size={'large'} trigger={<Button fluid> SEE DETAILS </Button>} closeIcon>
                                <Modal.Header>{i.title}</Modal.Header>
                                <Modal.Content image scrolling>
                                    <Image wrapped size='medium' src={'/images/' + i.images}/>
                                    <Modal.Description>
                                        <Header>Item ID : {i.itemId}</Header>
                                        <h3>Category : {i.category}</h3>
                                        <p>{i.description}</p>
                                        <h2><Timer endDate={i.bidFinDate}/></h2>
                                        <Button.Group>
                                            <Button onClick={ () => this.handleEditClick(i)}>Edit</Button>
                                            <Button>Close Auction</Button>
                                            <Button onClick={ () => this.handleCancelClick(i)}>Cancel Auction</Button>
                                        </Button.Group>
                                        
                                        <BidLog itemId={i.itemId}/>
                                    </Modal.Description>
                                    <Modal.Description>
                                        <Chat itemId={i.itemId} org={this.props.org} />
                                    </Modal.Description>

                                </Modal.Content>
                            </Modal>
                        </Card.Content>
                    </Card>
                    
                )
            })
            let rItems = [];
            for (let i = 0; i < 4; i++) {
                rItems.push(<Grid.Column>{filteredList[i]}</Grid.Column>);
            }
            return rItems;
        } else if (x===2) {
            let firstList = this.state.auctioned
            let filteredList = firstList.map((i) => {
                return (
                    
                    <Card>
                        <Image src={'/images/' + i.images} />
                        <Card.Content>
                        <Card.Header>{i.title}</Card.Header>
                        <Card.Meta>Bid Ends: {i.bidFinDate}</Card.Meta>
                        <Card.Description>{i.description}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='dollar sign' />
                            {i.lastPrice}
                        </Card.Content>
                        <Card.Content extra>
                            <Modal trigger={<Button fluid> See Details </Button>} closeIcon>
                                <Modal.Header>{i.title}</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='medium' src={'/images/' + i.images}/>
                                    <Modal.Description>
                                        <Header>Item ID : {i.itemId}</Header>
                                        <h3>Category : {i.category}</h3>
                                        <p>{i.description}</p>
                                        <h2>{i.bidFinDate}</h2>
                                        
                                        <BidLog itemId={i.itemId}/>
                                    
                                    </Modal.Description>
                                    <Modal.Description>
                                        <Chat itemId={i.itemId} org={this.props.org}/>
                                    </Modal.Description>

                                </Modal.Content>
                            </Modal>
                        </Card.Content>
                    </Card>
                    
                )
            })
            let rItems = [];
            for (let i = 0; i < 4; i++) {
                rItems.push(<Grid.Column>{filteredList[i]}</Grid.Column>);
            }
            return rItems;
        }
       
    }
    componentDidMount() {
        this.filterItemsByOrgId();
    }
    render() {
        //{this.filterItemsByOrgId}
        return(
        <div>
          <div>
          
          <br/>
          <Header as='h2' icon='stopwatch' content='Products Currently in Auction' />
          <br/>
          <br/>
          </div>
          
            <div>
                <Grid relaxed='very' columns={4}>
                {this.formatItems(1)}
                </Grid>
            </div>
          
          <br/>
          <br/>
          <div>
          
          <br/>
          <Header as='h2' icon='legal' content='Sold Products' />
          <br/>
          <br/>
          </div>
          
            <div>
                <Grid relaxed='very' columns={4}>
                {this.formatItems(2)}
                </Grid>
            </div>
          
          <br/>
          <br/>

        </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items,
        currOrg : state.orgId,
        org: state.currentOrg,
    }
}
export default connect(mapStateToProps)(OrgHomeItemDisp);