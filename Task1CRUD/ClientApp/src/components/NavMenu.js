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


//import React, { Component } from 'react';
//import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
//import { Link } from 'react-router-dom';
//import './NavMenu.css';

//export class NavMenu extends Component {
//  static displayName = NavMenu.name;

//  constructor (props) {
//    super(props);

//    this.toggleNavbar = this.toggleNavbar.bind(this);
//    this.state = {
//      collapsed: true
//    };
//  }

//  toggleNavbar () {
//    this.setState({
//      collapsed: !this.state.collapsed
//    });
//  }

//  render () {
//    return (
//      <header>
//        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
//          <Container>
//            <NavbarBrand tag={Link} to="/">Task1CRUD</NavbarBrand>
//            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//              <ul className="navbar-nav flex-grow">
//                <NavItem>
//                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
//                </NavItem>
//                <NavItem>
//                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
//                </NavItem>
//                <NavItem>
//                  <NavLink tag={Link} className="text-dark" to="/customers">Customers</NavLink>
//                </NavItem>
//                <NavItem>
//                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
//                </NavItem>
//              </ul>
//            </Collapse>
//          </Container>
//        </Navbar>
//      </header>
//    );
//  }
//}
