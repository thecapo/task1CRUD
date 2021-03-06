﻿import React, { Component } from 'react';
import { Table, Button, Modal, Input, Form, Pagination } from 'semantic-ui-react';
import axios from 'axios';

class Stores extends Component {

    state = {
        open: false,
        name: '',
        address: '',
        stores: [],
        page: 1,
        itemsPerPage: 10
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentDidMount = () => {
        axios.get('http://crud-task.azurewebsites.net/api/stores/')
            .then(response => {
                const stores = response.data;
                this.setState({
                    stores
                })
                console.log("stores", this.state.stores);
            })
            .catch(err => console.log(err))
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit = e => {
        axios.post('http://crud-task.azurewebsites.net/api/stores', {
            name: this.state.name,
            address: this.state.address
        })
            .then(response => this.setState({ stores: [...this.state.stores, response.data], name: '', address: '' }))
            .catch(err => console.log(err))
        this.setState({ open: false })        
    };

    setPageNum = (event, { activePage }) => {
        this.setState({ page: activePage });
    };

    show = (size) => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open, stores } = this.state
        const itemsPerPage = 10;
        const { page } = this.state;
        const totalPages = stores.length / itemsPerPage;
        const storeItems = stores.slice(
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
                            New Store
                        </Button>
                    }
                >
                    <Modal.Header>Create Store</Modal.Header>
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
                        {storeItems.map(store => {
                            return (
                                <Table.Row key={store.id}>
                                    <Table.Cell>{store.name}</Table.Cell>
                                    <Table.Cell>{store.address}</Table.Cell>
                                    <Table.Cell>
                                        <EditModal store={store} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <DeleteModal storeId={store.id} />
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
        axios.delete(`http://crud-task.azurewebsites.net/api/stores/${value}`)       
        this.setState({ open: false })
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                key="storeDelete"
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
                <Modal.Header>Delete store</Modal.Header>
                <Modal.Content>Are you sure?</Modal.Content>
                <Modal.Actions>
                    <Button
                        secondary
                        onClick={() => this.setState({ open: false })}
                        content='cancel'
                    />
                    <Button
                        onClick={this.handleDelete(this.props.storeId)}
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
        id: this.props.store.id,
        name: this.props.store.name,
        address: this.props.store.address
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })


    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleEdit = value => e => {
        e.preventDefault()
        const store = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address
        }
        const url = `http://crud-task.azurewebsites.net/api/stores/${value}`
        axios.put(url, store)
        this.setState({ open: false })
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                key="storeEdit"
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
                <Modal.Header>Edit store</Modal.Header>
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
                        onClick={this.handleEdit(this.props.store.id)}
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

export default Stores;