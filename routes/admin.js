const router = require('express').Router()
const { verifyAdmin } = require('../verify')


const Category = require('../models/category')
const Product = require('../models/product')

router.post('/add_category',verifyAdmin, async (req, res) => {
    const { name } = req.body
    if (name) {
        try {
            const newCategory = new Category({ name })
            await newCategory.save()
            res.status(201).json({ error: false, msg: "category added successfully" })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


router.post('/add_product',verifyAdmin, async (req, res) => {
    const { name, categoryId, price, imagePath } = req.body
    if (name && categoryId && price  && imagePath) {
        try {
            const newProduct = new Product({ name, categoryId, price, imagePath })
            await newProduct.save()
            res.status(201).json({ error: false, msg: "product added successfully", newProduct })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

router.put('/edit_product/:id',verifyAdmin, async (req, res) => {
    const _id = req.params.id
    const { name, categoryId, price, imagePath } = req.body
    if (name && categoryId && price  && imagePath) {
        try {
            const product = { name, categoryId, price, imagePath }
            await Product.updateOne({ _id }, product)
            res.status(201).json({ error: false, msg: "product edited successfully", product, _id })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})









module.exports = router