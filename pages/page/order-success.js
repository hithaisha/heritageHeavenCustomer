import React, { useContext } from 'react'
import CommonLayout from '../../components/shop/common-layout'
import { Container, Row, Col, Media } from 'reactstrap'
import CartContext from '../../helpers/cart'
import { CurrencyContext } from '../../helpers/Currency/CurrencyContext'

// Function to generate a random string of specified length
const generateRandomID = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Function to get a date 5 days ahead from today's date
const getFutureDate = (days) => {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today.toLocaleDateString()
}

const OrderSuccess = () => {
  const cartContext = useContext(CartContext)
  const cartItems = cartContext.state
  const cartTotal = cartContext.cartTotal
  const curContext = useContext(CurrencyContext)
  const symbol = curContext.state.symbol

  // Generate random Transaction ID and Order ID
  const transactionID = generateRandomID(12)
  const orderID = generateRandomID(12)
  // Get Order Date and Expected Delivery Date
  const orderDate = new Date().toLocaleDateString()
  const deliveryDate = getFutureDate(5)

  return (
    <CommonLayout parent="home" title="order success">
      <section className="section-b-space light-layout white-1">
        <Container>
          <Row>
            <Col md="12">
              <div className="success-text">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                <h2>thank you</h2>
                <p>
                  Payment is successfully processed and your order is on the
                  way
                </p>
                <p>Transaction ID: {transactionID}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-b-space">
        <Container>
          <Row>
            <Col lg="6">
              <div className="product-order">
                <h3>your order details</h3>

                {cartItems.map((item, i) => (
                  <Row className="product-order-detail" key={i}>
                    <Col xs="3">
                      <Media
                        src={item?.itemImageUrl}
                        alt=""
                        className="img-fluid blur-up lazyload"
                      />
                    </Col>
                    <Col xs="3" className="order_detail">
                      <div>
                        <h6>{item?.itemName}</h6>
                        <h5>{item.title}</h5>
                      </div>
                    </Col>
                    <Col xs="3" className="order_detail">
                      <div>
                        <h4>quantity</h4>
                        <h5>{item.qty}</h5>
                      </div>
                    </Col>
                    <Col xs="3" className="order_detail">
                      <div>
                        <h4>price</h4>
                        <h5>
                          {symbol}
                          {item.price}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                ))}
                <div className="total-sec">
                  <ul>
                    <li>
                      subtotal{' '}
                      <span>
                        {symbol}
                        {cartTotal}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="final-total">
                  <h3>
                    total{' '}
                    <span>
                      {symbol}
                      {cartTotal}
                    </span>
                  </h3>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <Row className="order-success-sec">
                <Col sm="6">
                  <h4>summary</h4>
                  <ul className="order-detail">
                    <li>order ID: {orderID}</li>
                    <li>Order Date: {orderDate}</li>
                    <li>Order Total: {symbol}{cartTotal}</li>
                  </ul>
                </Col>
                <Col sm="6"></Col>
                <Col sm="12" className="payment-mode">
                  <h4>payment method</h4>
                  <p>
                    Pay on Delivery (Cash/Card). Cash on delivery (COD)
                    available. Card/Net banking acceptance subject to device
                    availability.
                  </p>
                </Col>
                <Col md="12">
                  <div className="delivery-sec">
                    <h3>expected date of delivery</h3>
                    <h2>{deliveryDate}</h2>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  )
}

export default OrderSuccess
