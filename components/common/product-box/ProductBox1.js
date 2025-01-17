import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Row, Col, Media, Modal, ModalBody } from 'reactstrap'
import CartContext from '../../../helpers/cart'
import { CurrencyContext } from '../../../helpers/Currency/CurrencyContext'
import MasterProductDetail from './MasterProductDetail'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

const ProductItem = ({
  product,
  addCart,
  backImage,
  des,
  addWishlist,
  cartClass,
  productDetail,
  addCompare,
  title,
}) => {
  // eslint-disable-next-line
  const router = useRouter()
  const cartContext = useContext(CartContext)
  const curContext = useContext(CurrencyContext)
  const currency = curContext.state
  const plusQty = cartContext.plusQty
  const minusQty = cartContext.minusQty
  const quantity = cartContext.quantity
  const setQuantity = cartContext.setQuantity

  const [image, setImage] = useState('')
  const [modal, setModal] = useState(false)
  const [modalCompare, setModalCompare] = useState(false)
  const toggleCompare = () => setModalCompare(!modalCompare)
  const toggle = () => setModal(!modal)
  const uniqueTags = []

  const onClickHandle = (img) => {
    setImage(img)
  }

  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value))
  }

  const clickProductDetail = () => {
    const titleProps = product.itemName.split(' ').join('')
    const url = `/product-details/${product.id}-${titleProps}`
    router.push(url)
  }

  const variantChangeByColor = (imgId, product_images) => {
    product_images.map((data) => {
      if (data.image_id == imgId) {
        setImage(data.src)
      }
    })
  }
  return (
    <div className="product-box product-wrap">
      <div className="img-wrapper">
        <div className="lable-block">
          {product.new === true ? <span className="lable3">new</span> : ''}
          {product.sale === true ? <span className="lable4">on sale</span> : ''}
        </div>
        <div className="front" onClick={clickProductDetail}>
          <Media
            src={`${image ? image : product?.itemImageUrl}`}
            className="img-fluid"
            alt=""
          />
        </div>
        {backImage ? (
          product?.itemImageUrl === 'undefined' ? (
            'false'
          ) : (
            <div className="back" onClick={clickProductDetail}>
              <Media
                src={`${image ? image : product?.itemImageUrl}`}
                className="img-fluid m-auto"
                alt=""
              />
            </div>
          )
        ) : (
          ''
        )}

        <div className={cartClass}>
          {product?.quantity > 0 && (
            <button title="Add to cart" onClick={addCart}>
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
            </button>
          )}
          <a href={null} title="Add to Wishlist" onClick={addWishlist}>
            <i className="fa fa-heart" aria-hidden="true"></i>
          </a>
          <a href={null} title="Quick View" onClick={toggle}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </a>
          <a href={null} title="Compare" onClick={toggleCompare}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </a>
          <Modal
            isOpen={modalCompare}
            toggle={toggleCompare}
            size="lg"
            centered
          >
            <ModalBody>
              <Row className="compare-modal">
                <Col lg="12">
                  <div className="media">
                    <Media
                      src={product?.itemImageUrl}
                      alt=""
                      className="img-fluid"
                    />
                    <div className="media-body align-self-center text-center">
                      <h5>
                        <i className="fa fa-check"></i>Item{' '}
                        <span>{product?.itemName} </span>
                        <span> successfully added to your Compare list</span>
                      </h5>
                      <div className="buttons d-flex justify-content-center">
                        <Link href="/page/compare">
                          <a
                            href={null}
                            className="btn-sm btn-solid"
                            onClick={addCompare}
                          >
                            View Compare list
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
        {/* {product.images ? (
          <ul className="product-thumb-list">
            {product.images.map((img, i) => (
              <li
                className={`grid_thumb_img ${
                  img.src === image ? "active" : ""
                }`}
                key={i}
              >
                <a href={null} title="Add to Wishlist">
                  <Media
                    src={`${img.src}`}
                    alt="wishlist"
                    onClick={() => onClickHandle(img.src)}
                  />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )} */}
      </div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className="modal-lg quickview-modal"
        centered
      >
        <ModalBody>
          <Row>
            <Col lg="6" xs="12">
              <div className="quick-view-img">
                <Media
                  src={product?.itemImageUrl}
                  alt=""
                  className="img-fluid"
                />
              </div>
            </Col>
            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <h2> {product?.itemName} </h2>
                <div className="border-product">
                  <h6 className="product-title">product details</h6>
                  <p>{product.shortDescription}</p>
                </div>
                <div className="product-description border-product">
                  {product.size ? (
                    <div className="size-box">
                      <ul></ul>
                    </div>
                  ) : (
                    ''
                  )}
                  <h6 className="product-title">quantity</h6>
                  {product?.quantity > 0 ? (
                    <div className="qty-box">
                      <div className="input-group">
                        <span className="input-group-prepend">
                          <button
                            type="button"
                            className="btn quantity-left-minus"
                            onClick={minusQty}
                            data-type="minus"
                            data-field=""
                          >
                            <i className="fa fa-angle-left"></i>
                          </button>
                        </span>
                        <input
                          type="text"
                          name="quantity"
                          value={quantity}
                          onChange={changeQty}
                          className="form-control input-number"
                        />
                        <span className="input-group-prepend">
                          <button
                            type="button"
                            className="btn quantity-right-plus"
                            onClick={() => plusQty(product)}
                            data-type="plus"
                            data-field=""
                          >
                            <i className="fa fa-angle-right"></i>
                          </button>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <h6 className="product-title" style={{ color: 'red' }}>
                      Out of Stock
                    </h6>
                  )}
                </div>
                <div className="product-buttons">
                  {product?.quantity > 0 && (
                    <button
                      className="btn btn-solid"
                      onClick={() => addCart(product)}
                    >
                      add to cart
                    </button>
                  )}

                  <button
                    className="btn btn-solid"
                    onClick={clickProductDetail}
                  >
                    View detail
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ProductItem
