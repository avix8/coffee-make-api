const Category = require('../models/Category.js')

module.exports.get = async (req, res) => {
    let { parentPath, parentId } = req.body
    
    if (parentId) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res.status(400).send({ message: 'неверный идентификатор категории' })
        parentPath = parent.category
    }
    let categories = await Category.find({
        parent: new RegExp('^' + parentPath),
    })
    return res.send({ categories })
}

module.exports.create = async (req, res) => {
    let { name, parentId } = req.body
    if (!name) return res.status(400).send({ message: 'имя обязательно' })
    let parentPath = ''
    if (parentId) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res.status(400).send({ message: 'неверный идентификатор категории' })
        parentPath = parent.category
    }
    let category = parentPath + '/' + name
    let cat = new Category({ name, parent: parentPath, category })
    cat.save()
        .then((item) => {
            res.send(item)
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ message: 'не удалось создать категорию', err })
        })
}

module.exports.update = (req, res) => {
    console.log(req.body)
    res.send('update')
}
