import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react'

export default class NavMenu extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        
        return (
            <Segment inverted>
                <Menu inverted pointing secondary>
                    <Menu.Item as={Link} name='home' to='/'>
                        REACT
                    </Menu.Item> 
                    <Menu.Item as={Link} name='customers' to='customers'>
                        Customers
                    </Menu.Item>    
                    <Menu.Item as={Link} name='products' to='products'>
                        Products
                    </Menu.Item>  
                    <Menu.Item as={Link} name='stores' to='stores'>
                        Stores
                    </Menu.Item>  
                    <Menu.Item as={Link} name='sales' to='sales'>
                        Sales
                    </Menu.Item>  
                </Menu>
            </Segment>
        )
    }
}