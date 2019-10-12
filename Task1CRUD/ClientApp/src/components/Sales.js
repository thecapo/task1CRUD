import React, { Component } from 'react';
import { Table, Button, Modal, Input, Form, Dropdown, Pagination } from 'semantic-ui-react';
import axios from 'axios';

class Sales extends Component {

    state = {
        open: false,
        dateSold: new Intl.DateTimeFormat('en-US').format(new Date()),  
        customerId: 0,
        productId: 0,
        storeId: 0,
        customers: [],
        products: [],
        stores: [],
        sales: [],
        page: 1,
        itemsPerPage: 10
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentDidMount = () => {     
        axios.get("http://crud-task.azurewebsites.net/api/sales")
            .then(response => {
                const sales = response.data;                
                this.setState({
                    sales
                })                
            })
            .catch(err => console.log(err))      

        axios.get("http://crud-task.azurewebsites.net/api/customers")
            .then(response => {
                const customers = response.data;
                this.setState({
                    customers
                })           
            })
            .catch(err => console.log(err)) 

        axios.get("http://crud-task.azurewebsites.net/api/products")
            .then(response => {
                const products = response.data;
                this.setState({
                    products
                })                
            })
            .catch(err => console.log(err)) 

        axios.get("http://crud-task.azurewebsites.net/api/stores")
            .then(response => {
                const stores = response.data;
                this.setState({
                    stores
                })              
            })
            .catch(err => console.log(err)) 
    };

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })        
    };

    setPageNum = (event, { activePage }) => {
        this.setState({ page: activePage });
    };

    handleSubmit = e => {
        e.preventDefault();
        axios.post('http://crud-task.azurewebsites.net/api/sales', {
            dateSold: this.state.dateSold, 
            customerId: this.state.customerId,
            productId: this.state.productId,
            storeId: this.state.storeId
        })
            .catch(err => console.log(err))
        this.setState({ open: false })    
        window.location.reload();
    };

    show = (size) => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open, sales, customers, products, stores } = this.state
        const itemsPerPage = 10;
        const { page } = this.state;
        const totalPages = sales.length / itemsPerPage;
        const salesItems = sales.slice(
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
                            New Sale
                        </Button>
                    }
                >
                    <Modal.Header>Create Sales</Modal.Header>
                    <Modal.Content>
                        <p>Date Sold</p> 
                        <Input
                            fluid
                            id="dateSold"
                            name="dateSold"
                            required
                            value={this.state.dateSold}                         
                            onChange={this.handleChange}
                        />
                        <p>Customer</p> 
                        <Dropdown
                            placeholder='Select Customer'
                            fluid
                            name="customerId"
                            onChange={this.handleChange}
                            selection
                            options={customers.map(customer => {
                                return ({
                                    key: customer.id,
                                    text: customer.name,
                                    value: customer.id
                                })
                            })}                
                        />                       
                                        
                        <p>Product</p>
                        <Dropdown
                            placeholder='Select Product'
                            fluid
                            name="productId"
                            onChange={this.handleChange}
                            selection
                            options={products.map(product => {
                                return ({
                                    key: product.id,
                                    text: product.name,
                                    value: product.id
                                })
                            })}                            
                        />

                        <p>Store</p>
                        <Dropdown
                            placeholder='Select Store'
                            fluid
                            name="storeId"
                            onChange={this.handleChange}
                            selection
                            options={stores.map(store => {
                                return ({
                                    key: store.id,
                                    text: store.name,
                                    value: store.id
                                })
                            })}                                            
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
                            <Table.HeaderCell>Customer</Table.HeaderCell>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Store</Table.HeaderCell>
                            <Table.HeaderCell>Date Sold</Table.HeaderCell>
                            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {salesItems.map(sale => {                           
                            return (
                                <Table.Row key={sale.id}>
                                    <Table.Cell>{sale.customer.name}</Table.Cell>
                                    <Table.Cell>{sale.product.name}</Table.Cell>
                                    <Table.Cell>{sale.store.name}</Table.Cell>   
                                    
                                    <Table.Cell>{sale.dateSold}</Table.Cell>
                                    <Table.Cell>
                                        <EditModal
                                            sale={sale}
                                            customers={customers}
                                            products={products}
                                            stores={stores}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <DeleteModal saleId={sale.id} />
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
        axios.delete(`http://crud-task.azurewebsites.net/api/sales/${value}`)
        this.setState({ open: false })
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (
            <Modal
                key="saleDelete"
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
                <Modal.Header>Delete sale</Modal.Header>
                <Modal.Content>Are you sure?</Modal.Content>
                <Modal.Actions>
                    <Button
                        secondary
                        onClick={() => this.setState({ open: false })}
                        content='cancel'
                    />
                    <Button
                        onClick={this.handleDelete(this.props.saleId)}
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
        customerId: this.props.sale.customer.id,
        productId: this.props.sale.product.id,
        storeId: this.props.sale.store.id,
        dateSold: this.props.sale.dateSold  
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })        
    };

    handleEdit = value => e => {
        e.preventDefault()
        const sale = {
            id: this.props.sale.id,
            customerId: this.state.customerId,
            productId: this.state.productId,
            storeId: this.state.storeId,
            dateSold: this.props.sale.dateSold
        }
        const url = `http://crud-task.azurewebsites.net/api/sales/${value}`
        axios.put(url, sale)
        this.setState({ open: false })        
        window.location.reload()
    }

    render() {
        const { open } = this.state
        return (

            <Modal
                key="saleEdit"
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
                <Modal.Header>Edit sale</Modal.Header>
                <Modal.Content>
                    <p>Date Sold</p>
                    <Input
                        fluid
                        id="dateSold"
                        name="dateSold"
                        required
                        value={this.props.sale.dateSold}
                        onChange={this.handleChange}
                    />

                    <p>Customer</p>
                    <Dropdown
                        placeholder={this.props.sale.customer.name}
                        defaultValue={this.props.sale.customer.id}
                        fluid
                        name="customerId"
                        onChange={this.handleChange}
                        selection                                 
                        options={this.props.customers.map(customer => {
                            return ({
                                key: customer.id,
                                text: customer.name,
                                value: customer.id
                            })
                        })}
                    />

                    <p>Product</p>
                    <Dropdown
                        placeholder={this.props.sale.product.name}
                        defaultValue={this.props.sale.product.id}
                        fluid
                        name="productId"
                        onChange={this.handleChange}
                        selection                        
                        options={this.props.products.map(product => {
                            return ({
                                key: product.id,
                                text: product.name,
                                value: product.id
                            })
                        })}
                    />

                    <p>Store</p>
                    <Dropdown
                        placeholder={this.props.sale.store.name}
                        defaultValue={this.props.sale.store.id}
                        fluid                        
                        name="storeId"
                        onChange={this.handleChange}
                        selection                        
                        options={this.props.stores.map(store => {
                            return ({
                                key: store.id,
                                text: store.name,
                                value: store.id
                            })
                        })}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        secondary
                        onClick={() => this.setState({ open: false })}
                        content='cancel'
                    />
                    <Button
                        onClick={this.handleEdit(this.props.sale.id)}
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

export default Sales;