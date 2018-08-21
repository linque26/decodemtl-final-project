import React, { Component } from 'react'
import socketIO from 'socket.io-client';
import { Segment, Grid, Menu, Card, Button, Modal, Header, Image, Icon, Divider, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Chat from './Chat.js'
import BidLog from './bidLog.js'
import Timer from './timer.js'

class BuyerHomeDisplay extends Component {

    constructor() {
        super();
        this.state = {
            activeItem: '',
            orgNames: [],
            currBid:0
        }

        this.socket = socketIO("http://10.65.110.209:5000");
        this.sendBid = (itemId,username) => {
            this.socket.emit('sendLastPrice', {
                itemId: itemId,
                room: 'bid_'+itemId,
                username: username
            })
        }
    }
    handleBid = (amount,itemId,username) => {
        fetch('/bidItem', 
            {
                method:'POST',
                mode:'same-origin',
                credentials:'include',
                body: JSON.stringify({
                    username:username,
                    itemId:itemId,
                    userId:this.props.usr.userId,
                    bid:amount
                }
                )
                
            })
            .then(console.log(JSON.stringify({
                username:username,
                itemId:itemId,
                userId:this.props.usr.userId,
                bid:amount
            }
            )))
            .then(response => response.text())
            .then(response => {
                console.log(response)
                this.sendBid(itemId, username);
            })
            .catch(err => {
                console.log(err)
                alert('there was an error, try again')
            })
    }
    handleChange = (evt) => {
        this.setState({ currBid: evt.target.value})
        console.log(this.state.currBid)
    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleOrgClick = (id) => {
        this.setState({ activeItem: id})
    }

    formatItems = (name) => {
        if (name === '') {
            let filteredList = this.props.myItems.filter(item => item.state === 'TO_AUCTION').map((i) => {
                    return (
                        <Card>
                            <Image src={'/images/' + i.images} />
                            <Card.Content>
                                <Card.Header>{i.title}</Card.Header>
                                <Card.Meta>{i.description}</Card.Meta>
                                <Card.Description><Timer endDate={i.bidFinDate}/></Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name='dollar sign' />
                                {i.lastPrice}
                            </Card.Content>
                            <Card.Content extra>
                                <Modal size={'large'} trigger={<Button fluid> SEE DETAILS </Button>} closeIcon>
                                    <Modal.Header>{i.title}</Modal.Header>
                                    <Modal.Content image scrolling>
                                        <Image wrapped size='medium' src={'/images/' + i.images} />
                                        <Modal.Description>
                                            <Header>Item ID : {i.itemId}</Header>
                                            <h3>Category : {i.category}</h3>
                                            <p>{i.description}</p>
                                            <h2><Timer endDate={i.bidFinDate}/></h2>
                                            <Input type='number' onChange={this.handleChange}/>
                                            <Button.Group>
                                                <Button onClick={() => this.handleBid(this.state.currBid,i.itemId,this.props.usr.username)}>Bid</Button>
                                            </Button.Group>

                                            <BidLog itemId={i.itemId} userBid={this.props.usr.username}/>
                                        </Modal.Description>
                                        <Modal.Description padded>
                                        </Modal.Description >
                                        <Modal.Description>
                                        <Segment.Group padded>
                                        <Segment color='green' align='center'><Header>Chat</Header></Segment>
    
                                            <Chat itemId={i.itemId} buyer={this.props.usr} />
                                        </Segment.Group>
                                        </Modal.Description>
        
                                    </Modal.Content>
                                </Modal>
                            </Card.Content>
                        </Card>
                    )
            })
            let rItems = [];
            for (let i = 0; i < this.props.myItems.length; i++) {
                rItems.push(<Grid.Column> {filteredList[i]}</Grid.Column>);
            }
            return this.state.activeItem ? rItems.filter(item => item.category === this.state.activeItem) : rItems;
    
        } else {
            let category = this.state.activeItem;
            let filteredList = this.props.myItems.filter( item => 
                (item.state === 'TO_AUCTION' && item.category === category) ||
                    (item.state === 'TO_AUCTION' && item.orgId === category)).map((i) => {
                
                    return (
    
                        <Card>
                            <Image src={'/images/' + i.images} />
                            <Card.Content>
                                <Card.Header>{i.title}</Card.Header>
                                <Card.Meta>{i.description}</Card.Meta>
                                <Card.Description><Timer endDate={i.bidFinDate}/></Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name='dollar sign' />
                                {i.lastPrice}
                            </Card.Content>
                            <Card.Content extra>
                                <Modal size={'large'} trigger={<Button fluid> SEE DETAILS </Button>} closeIcon>
                                    <Modal.Header>{i.title}</Modal.Header>
                                    <Modal.Content image scrolling>
                                        <Image wrapped size='medium' src={'/images/' + i.images} />
                                        <Modal.Description>
                                            <Header>Item ID : {i.itemId}</Header>
                                            <h3>Category : {i.category}</h3>
                                            <p>{i.description}</p>
                                            <h2><Timer endDate={i.bidFinDate}/></h2>
                                            <Input type='number' onChange={this.handleChange}/>
                                            <Button.Group>
                                            <Button onClick={() => this.handleBid(this.state.currBid,i.itemId,this.props.usr.username)}>Bid</Button>
                                            </Button.Group>

                                            <BidLog itemId={i.itemId} userBid={this.props.usr.username}/>
                                        </Modal.Description>
                                        <Modal.Description padded>
                                        </Modal.Description >
                                        <Modal.Description padded>
                                        <Segment.Group padded >
                                        <Segment color='green' align='center'><Header>Chat</Header></Segment>
    
                                            <Chat itemId={i.itemId} buyer={this.props.usr} />
                                        </Segment.Group>
                                        </Modal.Description>
        
                                    </Modal.Content>
                                </Modal>
                            </Card.Content>
                        </Card>
        
                    )
            })
            let rItems = [];
            for (let i = 0; i < this.props.myItems.length  ; i++) {
                rItems.push(<Grid.Column> {filteredList[i]}</Grid.Column>);
            }
            return rItems;
        }
    }

    getOrgNames = () => {
        fetch('/getOrgs')
            .then(response => response.text())
            .then(responseBody => {
                let body = JSON.parse(responseBody);
                let names = body.orgs.map(org => {
                    return {
                        orgName: org.orgName,
                        orgId: org.orgId
                    }
                })
                this.setState({ orgNames: names})
            })
    }
    
    componentDidMount () {
        this.getOrgNames();
    }

    render() {
        
        return (
            <Grid>
                <Grid.Column width={2}>
                    <Menu fluid vertical tabular>
                        <Menu.Item
                            name='Electronics'
                            active={this.state.activeItem === 'Electronics'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Furniture'
                            active={this.state.activeItem === 'Furniture'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Clothing'
                            active={this.state.activeItem === 'Clothing'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Handmade'
                            active={this.state.activeItem === 'Handmade'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Sport'
                            active={this.state.activeItem === 'Sport'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Other'
                            active={this.state.activeItem === 'Other'}
                            onClick={this.handleItemClick}
                        />
                        <Divider />
                        <Header as='h4' style={{paddingLeft: '15px'}}> Non-Profits</Header>
                        {this.state.orgNames.map(oName => {
                            return <Menu.Item
                                name={oName.orgName}
                                active={this.state.activeItem === oName.orgId}
                                onClick={() => this.handleOrgClick(oName.orgId)}
                            />
                        })}
                    </Menu>
                    
                </Grid.Column>

                <Grid.Column stretched width={12}>
                    <Grid columns={4}>
                        {this.formatItems(this.state.activeItem)}
                    </Grid>
                </Grid.Column>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        myItems: state.items,
        usr: state.currentBuyer
    }
}
export default connect(mapStateToProps)(BuyerHomeDisplay);