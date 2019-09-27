import React, { Component } from 'react';
import { Icon, Menu, Table, Button, Modal, Input, Form, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

class Sales extends Component {

    state = {
        open: false,
        dateSold: new Date(),  
        customer: '',
        product: '',
        store: '',
        sales: []
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    componentDidMount = () => {     
        axios.get("http://localhost:54397/api/sales")
            .then(response => {
                const sales = response.data;
                this.setState({
                    sales
                })
                console.log("sales", this.state.sales);   
                console.log("sales", this.state.sales[0].store);   
                //console.log("saledsfdsfdss", this.state.sales.map(sale => { return (sale.customer.name) }));                 
            })
            .catch(err => console.log(err))       
    };

    handleChange = (e, { value }) => this.setState({ value })

    handleSubmit = e => {
        axios.post('http://localhost:54397/api/sales', this.state.value)
            .catch(err => console.log(err))
        this.setState({ open: false })
        window.location.reload()
    };

    show = (size) => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open, sales, customers } = this.state
        
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
                            value={new Intl.DateTimeFormat('en-US').format(this.state.dateSold)}                            
                            onChange={this.handleChange}
                        />
                        <p>Customer</p> 
                        <Dropdown
                            placeholder='Select Customer'
                            fluid
                            name="customer"
                            onChange={this.handleChange}
                            selection
                            options={this.state.sales.map(sale => {
                                return ({
                                    key: sale.customer.id,
                                    text: sale.customer.name,
                                    value: sale.customer.name
                                })})}
                            value={this.state.customer}
                        />
                      
                        <p>Product</p>
                        <Dropdown
                            placeholder='Select Product'
                            fluid
                            name="product"
                            onChange={this.handleChange}
                            selection
                            options={this.state.sales.map(sale => {
                                return ({
                                    key: sale.product.id,
                                    text: sale.product.name,
                                    value: sale.product.name
                                })
                            })}
                            value={this.state.product}

                        />

                        <p>Store</p>
                        <Dropdown
                            placeholder='Select Store'
                            fluid
                            name="store"
                            onChange={this.handleChange}
                            selection
                            options={this.state.sales.map(sale => {
                                return ({
                                    key: sale.store.id,
                                    text: sale.store.name,
                                    value: sale.store.name
                                })
                            })}                
                            value={this.state.store}
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
                        {sales.map(sale => {                           
                            return (
                                <Table.Row key={sale.id}>
                                    <Table.Cell>{sale.customer.name}</Table.Cell>
                                    <Table.Cell>{sale.product.name}</Table.Cell>
                                    <Table.Cell>{sale.store.name}</Table.Cell>         
                                    <Table.Cell>{new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(sale.dateSold))}</Table.Cell>
                                    <Table.Cell>
                                        <EditModal sale={sale} />
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
        axios.delete(`http://localhost:54397/api/sales/${value}`)
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
        id: this.props.saleId,       
        customerId: '',
        productId: '',
        storeId: '',
        customer: this.props.sale.customer.name,
        product: this.props.sale.product.name,
        store: this.props.sale.store.name
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })


    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleEdit = value => e => {
        e.preventDefault()
        const sale = {
            id: this.state.saleId,
            customerId: this.state.customer,
            productId: this.state.product,
            storeId: this.state.store
        }
        const url = `http://localhost:54397/api/sales/${value}`
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
                    <p>CUSTOMER NAME</p>
                    <Input
                        fluid
                        id="customer"
                        name="customer"
                        required
                        value={this.state.customer}
                        onChange={this.handleChange}
                    />
                   


                    <p>PRODUCT NAME</p>
                    <Input
                        fluid
                        id="product"
                        name="product"
                        required
                        value={this.state.product}
                        onChange={this.handleChange}
                    />

                    <p>STORE NAME</p>
                    <Input
                        fluid
                        id="store"
                        name="store"
                        required
                        value={this.state.store}
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
                        onClick={this.handleEdit(this.props.saleId)}
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