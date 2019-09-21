import React, { Component } from 'react';
import { Icon, Menu, Table, Button, Modal, Input, Form } from 'semantic-ui-react';
import axios from 'axios';

class Customers extends Component {

    state = {
        open: false,
        name: '',
        address: '',
        customers: []
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentDidMount = () => {
        axios.get('http://localhost:54397/api/customers/')
            .then(response => {
                const customers = response.data;
                this.setState({
                    customers
                })
                console.log("customers", this.state.customers);
            })
            .catch(err => console.log(err))
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        console.log("name", this.state.name);
        console.log("address", this.state.address);
    };

    handleSubmit = e => {
        axios.post('http://localhost:54397/api/customers', {
            name: this.state.name,
            address: this.state.address
        })
            .catch(err => console.log(err))
        this.setState({ open: false })
        window.location.reload()
    };

    show = (size) => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open, customers } = this.state

        return (
            <div>
                <Modal
                    as={Form}
                    onSubmit={this.handleSubmit}
                    size="tiny"
                    open={open}
                    onOpen={this.open}
                    onClose={this.close}
                    trigger={
                        <Button primary>
                            New Customer
                        </Button>
                    }
                >
                    <Modal.Header>Create Customer</Modal.Header>
                    <Modal.Content>
                        <p>NAME</p>
                        <Input
                            fluid
                            id="name"
                            name="name"
                            required
                            value={this.state.name}
                            onChange={this.handleChange}
                        />

                        <p>ADDRESS</p>
                        <Input
                            fluid
                            id="address"
                            name="address"
                            required
                            value={this.state.address}
                            onChange={this.handleChange}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            secondary
                            onClick={() => this.setState({ open: false })}
                        >
                            cancel
                        </Button>
                        <Button
                            type='submit'
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content='create'
                        />
                    </Modal.Actions>
                </Modal>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>NAME</Table.HeaderCell>
                            <Table.HeaderCell>ADDRESS</Table.HeaderCell>
                            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {customers.map(customer => {
                            return (
                                <Table.Row key={customer.id}>
                                    <Table.Cell>{customer.name}</Table.Cell>
                                    <Table.Cell>{customer.address}</Table.Cell>
                                    <Table.Cell>
                                        <EditModal customer={customer} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <DeleteModal customerId={customer.id}/>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}


                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>
                                <Menu floated='right' pagination>
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron left' />
                                    </Menu.Item>
                                    <Menu.Item as='a'>1</Menu.Item>
                                    <Menu.Item as='a'>2</Menu.Item>
                                    <Menu.Item as='a'>3</Menu.Item>
                                    <Menu.Item as='a'>4</Menu.Item>
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron right' />
                                    </Menu.Item>
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
};

class DeleteModal extends Component {
    state = { open: false }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    handleDelete = value => e => {
        axios.delete(`http://localhost:54397/api/customers/${value}`)
        this.setState({ open: false })
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                size="tiny"
                open={open}
                onOpen={this.open}
                onClose={this.close}
                trigger={
                    <Button
                        icon='trash'
                        color='red'
                        labelPosition='left'
                        content='DELETE'
                    >
                    </Button>
                }
            >
                <Modal.Header>Delete customer</Modal.Header>
                <Modal.Content>Are you sure?</Modal.Content>
                <Modal.Actions>
                    <Button
                        secondary
                        onClick={() => this.setState({ open: false })}
                        content='cancel'
                    />                      
                    <Button                        
                        onClick={this.handleDelete(this.props.customerId)}
                        color='red'
                        icon='times'
                        labelPosition='right'
                        content='delete'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

class EditModal extends Component {
    state = {
        open: false,
        id: this.props.customer.id,
        name: this.props.customer.name,
        address: this.props.customer.address
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })


    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleEdit = value => e => {
        e.preventDefault()
        const customer = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address
        }
        const url = `http://localhost:54397/api/customers/${value}`
        axios.put(url, customer) 
        this.setState({ open: false })
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                size="tiny"
                open={open}
                onOpen={this.open}
                onClose={this.close}
                trigger={
                    <Button
                        icon='edit'
                        color='yellow'
                        labelPosition='left'
                        content='EDIT'
                    >
                    </Button>
                }
            >
                <Modal.Header>Edit customer</Modal.Header>
                <Modal.Content>
                    <p>NAME</p>
                    <Input
                        fluid
                        id="name"
                        name="name"
                        required
                        value={this.state.name}
                        onChange={this.handleChange}
                    />

                    <p>ADDRESS</p>
                    <Input
                        fluid
                        id="address"
                        name="address"
                        required                      
                        value={this.state.address}
                        onChange={this.handleChange}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        secondary
                        onClick={() => this.setState({ open: false })}
                        content='cancel'
                    />
                    <Button
                        onClick={this.handleEdit(this.props.customer.id)}                     
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content='edit'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default Customers;