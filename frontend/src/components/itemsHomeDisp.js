import React, { Component } from 'react';
import { Card, Icon, Image,Grid, Button, Modal, Header, Form, Label, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ConnectedSignUp from './signUp.js'
import ConnectedLogIn from './LogIn.js'


class HomeItemDisp extends Component {
    constructor() {
        super();
        this.state = {items:[],randomItems:[], open:false,open2:false}
        this.getItems = this.getItems.bind(this)
    }
    show = size => () => this.setState({ size, open: true })
    show2 = size => () => this.setState({ size, open2: true })
    close = () => this.setState({ open: false })
    getItems() {
        fetch('/getItems')
          .then(response => response.text())
          .then(responseBody => {
            let parsedBody = JSON.parse(responseBody);
            let itemList = parsedBody.items;
            this.props.dispatch({
                type: 'getItems',
                content: itemList
            })

            let itemsFiltred = this.props.items.filter(item => item.state === "TO_AUCTION");
            this.setState({ items:itemList, randomItems: itemsFiltred });     
          })        
    }

    formatItems = () => {
        const { activeItem } = this.state
        const { open, open2, size } = this.state
        let firstList = this.state.randomItems
        let filteredList = firstList.map((i) => {
            
            return (
                <Card>
                    <Image src={'./images/' + i.images} />
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
                        <Modal trigger={<Button>Bid Now</Button>} closeIcon>
                                <Modal.Header>{i.title}</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='medium' src={'./images/' + i.images}/>
                                    <Modal.Description>
                                        <Header>Item ID : {i.itemId}</Header>
                                        <p>{i.description}</p>
                                        <h2>{i.bidFinDate}</h2>
                                        <Form>
                                        <Form.Field inline>
                                            <label>Amount:</label>
                                                <Label as='a' basic>$</Label>
                                                <Input 
                                                    type='number' 
                                                    name='initialPrice' 
                                                    onChange={this.handleChange}
                                                    
                                                />
                                        </Form.Field>
                                        <Modal trigger={<Button secondary
                                        active={activeItem === 'login'}
                                        onClick={this.show('mini')}
                                        position='right'>Login</Button>} size={size} open={open} onClose={this.close}>
                                        <Modal.Content>
                                            <ConnectedLogIn onSubmit={this.close}/>
                                        </Modal.Content>
                                        </Modal>

                                        <Modal trigger={<Button primary
                                        active={activeItem === 'signup'}
                                        onClick={this.show2('mini')}
                                        position='right'>Sign Up</Button>} size={size} open2={open} onClose={this.close}>
                                        <Modal.Content>
                                            <ConnectedSignUp/>
                                        </Modal.Content>
                                        </Modal>
                                        </Form>
                                        
                                    </Modal.Description>
                                </Modal.Content>
                        </Modal>
                        </Card.Content>
                </Card>
                
            )
        })
        let rItems = [];
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * filteredList.length);
            rItems.push(<Grid.Column>{filteredList[index]}</Grid.Column>);
        }
        return rItems;
    }
    componentDidMount() {
        this.getItems();
    }
    render() {
        return(
            <div>
                <Grid relaxed='very' columns={5}>
                {this.formatItems()}
                </Grid>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items
    }
}
export default connect(mapStateToProps)(HomeItemDisp);