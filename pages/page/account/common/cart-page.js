import React, { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import emailjs from '@emailjs/browser'
import CartContext from '../../../../helpers/cart'
import {
  Container,
  Row,
  Col,
  Media,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap'
import { CurrencyContext } from '../../../../helpers/Currency/CurrencyContext'
import cart from '../../../../public/assets/images/icon-empty-cart.png'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const CartPage = () => {
  const router = useRouter()
  const context = useContext(CartContext)
  const cartItems = context.state
  const curContext = useContext(CurrencyContext)
  const symbol = curContext.state.symbol
  const total = context.cartTotal
  const removeFromCart = context.removeFromCart
  const [quantityError, setQuantityError] = useState(false)
  const updateQty = context.updateQty
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [auth, setAuth] = useState(Boolean(JSON.parse(localStorage.getItem('authToken'))))
  const [orderPayload, setOrderPayload] = useState(null)

  const supermarketDetails = {
    name: 'Heritage Heaven',
    address: '6A Moratuwa',
    contact: '0778899556'
  }

  const handleQtyUpdate = (item, quantity) => {
    if (quantity >= 1) {
      setQuantityError(false)
      updateQty(item, quantity)
    } else {
      setQuantityError(true)
    }
  }

  const saveOrder = async () => {
    if (!auth) {
      toast.info('You must login first')
    } else {
      try {
        const payload = {
          invoiceNumber: `INV${Math.floor(100000 + Math.random() * 900000)}`, // Generate random invoice number
          orderId: Math.floor(Math.random() * 10000),
          totalPrice: cartItems.reduce((total, item) => total + item.total, 0),
          orderItems: cartItems.map((item) => ({
            productId: item.id,
            quantity: Number(item.qty),
            price: item.price,
            totalPrice: item.total,
            itemName: item.itemName,
          })),
        }
        setOrderPayload(payload) // Set payload in state to access in handleEmailSend
        toast.success('Order placed successfully!')
        localStorage.removeItem('cartList')

        // Generate and download the PDF invoice
        const pdf = generateInvoicePDF(payload, supermarketDetails)
        pdf.save('invoice.pdf')

        // Open email prompt modal
        setEmailModalOpen(true)
        setModalIsOpen(false)
      } catch (e) {
        console.log(e)
        toast.error('Error, try again')
      }
    }
  }

  const generateInvoicePDF = (orderData, supermarketDetails) => {
    const doc = new jsPDF()

    // Add Supermarket Details
    doc.setFontSize(14)
    doc.text(supermarketDetails.name, 20, 20)
    doc.setFontSize(10)
    doc.text(supermarketDetails.address, 20, 26)
    doc.text(`Contact: ${supermarketDetails.contact}`, 20, 32)

    // Invoice Title and Metadata
    doc.setFontSize(16)
    doc.text("Invoice", 20, 50)
    const orderDate = new Date().toLocaleDateString()
    doc.setFontSize(12)
    doc.text(`Invoice Number: ${orderData.invoiceNumber}`, 20, 60)
    doc.text(`Order Date: ${orderDate}`, 20, 66)

    // Product Table
    const tableBody = orderData.orderItems.map((item) => [
      item.itemName,
      item.quantity,
      `${symbol}${parseFloat(item.price).toFixed(2)}`,
      `${symbol}${parseFloat(item.totalPrice).toFixed(2)}`
    ])

    doc.autoTable({
      head: [['Product', 'Quantity', 'Unit Price', 'Total Price']],
      body: tableBody,
      startY: 80,
      theme: 'grid',
      styles: { halign: 'center', valign: 'middle' },
    })

    // Display Total Only
    const subtotal = orderData.totalPrice
    doc.setFontSize(12)
    const finalY = doc.previousAutoTable.finalY + 10
    doc.text(`Total: ${symbol}${subtotal.toFixed(2)}`, 20, finalY)

    // Footer
    doc.setFontSize(10)
    doc.text("Thank you for shopping with us!", 20, finalY + 20)

    return doc // Return the PDF document object for download
  }

  const handleEmailSend = (e) => {
    e.preventDefault()
    if (!orderPayload) {
      toast.error("No order data available.")
      return
    }

    const emailData = {
      email: customerEmail,
      message: `
        Thank you for your purchase from ${supermarketDetails.name}!\n\n
        Invoice Number: ${orderPayload.invoiceNumber}\n
        Order Date: ${new Date().toLocaleDateString()}\n
        Total Price: ${symbol}${orderPayload.totalPrice.toFixed(2)}\n\n
        Order Details:\n
        ${orderPayload.orderItems.map(item => ` - ${item.itemName} x ${item.quantity} : ${symbol}${item.totalPrice.toFixed(2)}`).join("\n")}\n\n
        We appreciate your business!
      `,
      supermarket_name: supermarketDetails.name,
      invoice_number: orderPayload.invoiceNumber,
    }

    emailjs.send('service_5t0bt18', 'template_zyb6x02', emailData, 'L1ntqiB-hFY3DGBb8')
      .then((response) => {
        toast.success('Invoice sent successfully!')
        setEmailModalOpen(false)
        router.push('/')
      })
      .catch((error) => {
        console.error('Error sending email:', error)
        toast.error('Failed to send invoice.')
      })
  }

  return (
    <div>
      <Modal isOpen={modalIsOpen} toggle={() => setModalIsOpen(!modalIsOpen)} size="lg">
        <ModalHeader>Enter Payment Details</ModalHeader>
        <ModalBody style={{ padding: '10px' }}>
          <center>
            <h5>Enter your card details to complete the purchase</h5>
            <Input type="text" placeholder="Card Number" className="mt-4" />
            <Input type="text" placeholder="Card Holder Name" className="mt-3" />
            <Input type="text" placeholder="Expiry Date (MM/YY)" className="mt-3" />
            <Input type="text" placeholder="CVV" className="mt-3" />
          </center>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveOrder}>
            Pay and Generate Invoice
          </Button>
          <Button color="secondary" onClick={() => setModalIsOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Email Prompt Modal with Form */}
      <Modal isOpen={emailModalOpen} toggle={() => setEmailModalOpen(!emailModalOpen)} size="lg">
        <ModalHeader>Enter Your Email Address</ModalHeader>
        <ModalBody>
          <form onSubmit={handleEmailSend}>
            <Input
              type="email"
              placeholder="Enter email address"
              name="user_email" 
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
            <Button color="primary" type="submit">
              Send Invoice
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setEmailModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Cart and Checkout UI */}
      {cartItems && cartItems.length > 0 ? (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">image</th>
                      <th scope="col">product name</th>
                      <th scope="col">price</th>
                      <th scope="col">quantity</th>
                      <th scope="col">action</th>
                      <th scope="col">total</th>
                    </tr>
                  </thead>
                  {cartItems.map((item, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>
                          <Link href={`/product-details/` + item.id}>
                            <a>
                              <Media
                                src={item.itemImageUrl}
                                alt={item.itemName}
                              />
                            </a>
                          </Link>
                        </td>
                        <td>
                          <Link href={`/left-sidebar/product/` + item.id}>
                            <a>{item.itemName}</a>
                          </Link>
                        </td>
                        <td>{symbol}{parseFloat(item.price).toFixed(2)}</td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            onChange={(e) => handleQtyUpdate(item, e.target.value)}
                            defaultValue={item.qty}
                            className="form-control input-number"
                            style={{ borderColor: quantityError && 'red' }}
                          />
                        </td>
                        <td><i className="fa fa-times" onClick={() => removeFromCart(item)}></i></td>
                        <td>{symbol}{parseFloat(item.total).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  ))}
                </table>
                <table className="table cart-table table-responsive-md">
                  <tfoot>
                    <tr>
                      <td>Total Price :</td>
                      <td>{symbol} {parseFloat(total).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
            <Row className="cart-buttons">
              <Col xs="12">
                <Button color="primary" onClick={() => setModalIsOpen(true)}>
                  Buy Now
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div className="text-center">
                  <Media src={cart} className="img-fluid mb-4 mx-auto" alt="" />
                  <h3><strong>Your Cart is Empty</strong></h3>
                  <h4>Explore more to shortlist some items.</h4>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  )
}

export default CartPage
