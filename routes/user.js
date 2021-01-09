const router = require('express').Router()
const { verifyUser } = require('../verify')

const Product = require('../models/product')
const Cart = require('../models/cart')
const Order = require('../models/order')
const { update } = require('../models/product')


router.get('/check_cart/:userId', async (req, res) => {
    try {
        const result = await Cart.find({ userId: req.params.userId })
        if (result.length > 0) {
            res.status(201).json({ error: false, msg: result })
        } else {
            res.status(201).json({ error: true, msg: "There is no active cart" })
        }
    } catch (err) {
        res.status(201).json({ error: true, msg: "No cart" })
    }
})

router.post('/open_cart', verifyUser, async (req, res) => {
    const { id } = req.body
    if (id) {
        try {
            const newCart = new Cart({ userId: id, products: [], finalPrice: 0 })
            const nc = await newCart.save()
            res.status(201).json({ error: false, msg: "cart open successfully", nc })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

router.put('/delete_cart/:id', async (req, res) => {
    if (req.params.id) {
        // console.log(id)
        try {
            await Cart.deleteOne({ _id: req.params.id })
            res.status(201).json({ error: false, msg: "cart deleted" })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

router.put('/addOrRemoveProductFromCart', verifyUser, async (req, res) => {
    let { cart_id, productId, quantity, priceByProduct } = req.body
    if (cart_id && productId && quantity && priceByProduct) {
        if (quantity == (-1)) {
            quantity = 0
            priceByProduct = 0
        }
        try {
            let answer = await Cart.findById(cart_id)
            let n = answer.products.filter(p => p.productId == productId)
            let tempQuantity
            let tempPriceByProduct
            if (n.length === 0) {
                if (quantity === 0) {
                    res.status(400).json({ error: true, msg: "Product does not exist in the cart" })
                }
                tempQuantity = 0
                tempPriceByProduct = 0
                const product = { productId, quantity, priceByProduct }
                await Cart.updateOne({ _id: cart_id }, { $push: { products: product } })
            } else {
                const index = answer.products.indexOf(n[0])
                tempQuantity = answer.products[index].quantity
                tempPriceByProduct = answer.products[index].priceByProduct
                if (quantity === 0) {
                    let newP = answer.products.filter(p => p.productId != productId)
                    await Cart.updateOne({ _id: cart_id }, { $set: { products: newP } })
                } else {
                    const product = { productId, quantity, priceByProduct }
                    answer.products[index] = product
                    await Cart.updateOne({ _id: cart_id }, { $set: { products: answer.products } })
                }
            }
            if (tempQuantity < quantity) {
                await Cart.updateOne({ _id: cart_id }, { $set: { finalPrice: answer.finalPrice + (priceByProduct - tempPriceByProduct) } })
            }
            if (tempQuantity > quantity) {
                await Cart.updateOne({ _id: cart_id }, { $set: { finalPrice: answer.finalPrice - (tempPriceByProduct - priceByProduct) } })
            }
            if (tempQuantity === quantity) {
                res.status(201).json({ error: false, msg: "No change required" })
            }
            answer = await Cart.findById(cart_id)
            res.status(201).json({ error: false, msg: "cart edit successfully", answer })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


router.put('/deleteProductFromCart', verifyUser, async (req, res) => {
    let { cart_id, productId, priceByProduct } = req.body
    if (cart_id && productId && priceByProduct) {
        try {
            let answer = await Cart.findById(cart_id)
            answer.finalPrice = answer.finalPrice - priceByProduct
            answer.products = answer.products.filter(p => p.productId != productId)
            await answer.save()
            res.status(201).json({ error: false, msg: "cart edit successfully", answer })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

router.put('/deleteProductsFromCart', verifyUser, async (req, res) => {
    let { cart_id } = req.body
    if (cart_id) {
        try {
            let answer = await Cart.findById(cart_id)
            answer.products = []
            answer.finalPrice = 0
            await answer.save()
            res.status(201).json({ error: false, msg: "products deleted successfully", answer })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

router.post('/open_order', verifyUser, async (req, res) => {
    const { userId, cartId, finalPrice, city, street, deliveryDate, last4DigitsOfCredit } = req.body
    if (userId && cartId && finalPrice && city && street && deliveryDate && last4DigitsOfCredit) {
        try {
            const newOrder = new Order({ userId, cartId, finalPrice, city, street, deliveryDate, last4DigitsOfCredit })
            await newOrder.save()
            res.status(201).json({ error: false, msg: "Order successfully completed", newOrder })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

router.get('/allOrders/:userId', async (req, res) => {
    if (req.params.userId) {
        try {
            const result = await Order.find({ userId: req.params.userId })
            res.json(result)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

module.exports = router