import React, { Component } from 'react';
import { Table, Button, Modal, Input, Form, Pagination } from 'semantic-ui-react';
import axios from 'axios';

class Customers extends Component {

    state = {
        open: false,
        name: '',
        address: '',
        customers: [],
        page: 1,
        itemsPerPage: 10
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentDidMount = () => {
        axios.get('http://crud-task.azurewebsites.net/api/customers/')
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
    };

    handleSubmit = e => {
        axios.post('http://crud-task.azurewebsites.net/api/customers', {
            name: this.state.name,
            address: this.state.address
        })
            .catch(err => console.log(err))
        this.setState({ open: false })
        window.location.reload()
    };

    setPageNum = (event, { activePage }) => {
        this.setState({ page: activePage });
    };

    show = (size) => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open, customers } = this.state
        const itemsPerPage = 10;
        const { page } = this.state;
        const totalPages = customers.length / itemsPerPage;
        const customerItems = customers.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
        );

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
                        {customerItems.map(customer => {
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
                                <Pagination
                                    activePage={page}
                                    totalPages={totalPages}
                                    siblingRange={1}
                                    onPageChange={this.setPageNum}
                                />
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
        axios.delete(`http://crud-task.azurewebsites.net/api/customers/${value}`)       
        alert("Items will not be deleted if they are connected to Sales page...")
        this.setState({ open: false })         
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                key="customerDelete"
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
        const url = `http://crud-task.azurewebsites.net/api/customers/${value}`
        axios.put(url, customer) 
        this.setState({ open: false })
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                key="customerEdit"
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