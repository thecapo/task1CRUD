import React, { Component } from 'react';
import { Table, Button, Modal, Input, Form, Pagination } from 'semantic-ui-react';
import axios from 'axios';

class Products extends Component {

    state = {
        open: false,
        name: '',
        price: '',
        products: [],
        page: 1,
        itemsPerPage: 10
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentDidMount = () => {
        axios.get('http://crud-task.azurewebsites.net/api/products/')
            .then(response => {
                const products = response.data;
                this.setState({
                    products
                })
                console.log("products", this.state.products);
            })
            .catch(err => console.log(err))
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit = e => {
        axios.post('http://crud-task.azurewebsites.net/api/products', {
            name: this.state.name,
            price: this.state.price
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
        const { open, products } = this.state
        const itemsPerPage = 10;
        const { page } = this.state;
        const totalPages = products.length / itemsPerPage;
        const productItems = products.slice(
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
                            New Product
                        </Button>
                    }
                >
                    <Modal.Header>Create Product</Modal.Header>
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

                        <p>PRICE</p>
                        <Input
                            fluid
                            id="price"
                            name="price"
                            required
                            value={this.state.price}
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
                            <Table.HeaderCell>PRICE</Table.HeaderCell>
                            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {productItems.map(product => {
                            return (
                                <Table.Row key={product.id}>
                                    <Table.Cell>{product.name}</Table.Cell>
                                    <Table.Cell>${product.price}</Table.Cell>
                                    <Table.Cell>
                                        <EditModal product={product} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <DeleteModal productId={product.id} />
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
        axios.delete(`http://crud-task.azurewebsites.net/api/products/${value}`)
        alert("Items will not be deleted if they are connected to Sales page...")
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
                <Modal.Header>Delete product</Modal.Header>
                <Modal.Content>Are you sure?</Modal.Content>
                <Modal.Actions>
                    <Button
                        secondary
                        onClick={() => this.setState({ open: false })}
                        content='cancel'
                    />
                    <Button
                        onClick={this.handleDelete(this.props.productId)}
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
        id: this.props.product.id,
        name: this.props.product.name,
        price: this.props.product.price
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })


    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleEdit = value => e => {
        e.preventDefault()
        const product = {
            id: this.state.id,
            name: this.state.name,
            price: this.state.price
        }
        const url = `http://crud-task.azurewebsites.net/api/products/${value}`
        axios.put(url, product)
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
                <Modal.Header>Edit product</Modal.Header>
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

                    <p>PRICE</p>
                    <Input
                        fluid
                        id="price"
                        name="price"
                        required
                        value={this.state.price}
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
                        onClick={this.handleEdit(this.props.product.id)}
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

export default Products;