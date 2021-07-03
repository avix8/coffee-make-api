const { describe, it } = require('mocha')
const { agent } = require('./init')
const { getAdminData } = require('./helpers/admin')

const correctUserData = {
    email: 'CategoryQwe1234@gmail.com',
    password: 'qweasdzxc1234',
}

const FRESH_COFFEE_1 = {
    title: 'FRESH COFFEE 1',
    slug: 'FRESH-COFFEE-1',
    descr: 'Кофе из респ. Гондурас это классический представитель арабики из Центральной Америки. регион: Копан, Окотепеке. Высота произрастания: 1300 - 1500 м. Обладает приятным шоколадным оттенком и сильным телом, хорошей насыщенностью и балансом, идеально подходит для сбалансированного эспрессо.',
    category: '/кофе/моносорта',
    brand: '',
    // imgs: [
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_967112812",
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945877912"
    // ],

    properties: {
        кислотность: {
            maxValue: 5,
            value: 3,
        },
        плотность: {
            maxValue: 5,
            value: 2,
        },
    },

    choiceProperty: {
        name: 'Масса (гр)',
        variants: [
            {
                price: 260.0,
                option: 250,
            },
            {
                price: 940.0,
                option: 1000,
            },
        ],
    },
}

const FRESH_COFFEE_2 = {
    title: 'FRESH COFFEE 2',
    slug: 'FRESH-COFFEE-2',
    descr: 'Зерно из Бразилии натуральной (сухой) обработки, регионы: Сан-Паулу (Сантос) и Минас-Жерайс (Минас) растет на высоте 600 - 1300 метров над уровнем моря. Богатый букет, имеющий полный насыщенный вкус, легкий характерный аромат бурбона и долгое послевкусие ореха.',
    category: '/кофе/моносорта',
    brand: '',
    // imgs: [
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_967112812",
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945877912"
    // ],

    properties: {
        кислотность: {
            maxValue: 5,
            value: 3,
        },
        плотность: {
            maxValue: 5,
            value: 2,
        },
    },

    choiceProperty: {
        name: 'Масса (гр)',
        variants: [
            {
                price: 320,
                option: 250,
            },
            {
                price: 1150,
                option: 1000,
            },
        ],
    },
}

const createCategory = async (data) => {
    const adminData = await getAdminData()
    let { body: category } = await agent
        .post('/api/categories/create')
        .set('Authorization', `Bearer ${ adminData.accessToken }`)
        .send(data)
        .expect((res) => {
            res.body //?
        })
    return category
}

const createProduct = async (data) => {
    const adminData = await getAdminData()
    let { body: product } = await agent
        .post('/api/products/create')
        .set('Authorization', `Bearer ${adminData.accessToken}`)
        .send(data)
        .expect((res) => {
            res.body //?
        })
    return product
}

describe('Categories', () => {
    
    describe('POST /api/categories/create', () => {
        it('User can not create category witout permission', async () => {
            let accessToken

            await agent.post('/api/auth/register').send(correctUserData)
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    accessToken = res.body.accessToken
                })
                .expect(200)

            await agent
                .post('/api/categories/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('У вас нет доступа')
                })
                .expect(403)
        })

        it('Admin can create category', async () => {
            const adminData = await getAdminData()

            await agent
                .post('/api/categories/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send({
                    title: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('title')
                    res.body.should.have.property('parent')
                    res.body.should.have.property('category')
                })
                .expect(200)
        })

        it('Admin can create subcategory by parentId', async () => {
            const adminData = await getAdminData()

            let category1 = await createCategory({
                title: 'категория 1',
            })
            category1 //?

            await agent
                .post('/api/categories/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send({
                    title: 'категория 2',
                    parentId: category1._id,
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('title')
                    res.body.should.have.property('parent')
                    res.body.should.have.property('category')
                })
                .expect(200)
        })
    })

    describe('POST /api/categories', () => {
        it('User can get subcategories by parentPath', async () => {
            let { _id } = await createCategory({ title: 'lolar' })
            await createCategory({ title: 'q', parentId: _id })
            await createCategory({ title: 'w', parentId: _id })
            await createCategory({ title: 'e', parentId: _id })
            
            await agent
                .post('/api/categories')
                .send({ parentPath: '/lolar' })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(3)
                })
                .expect(200)
        })

        it('User can get categories by parentId', async () => {
            let { _id } = await createCategory({ title: 'Кофе' })
            await createCategory({ title: 'Эспрессо смеси',parentId: _id })
            await createCategory({ title: 'Моносорта',parentId: _id })

            await agent
                .post('/api/categories')
                .set('Authorization', '')
                .send({ parentId: _id })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.should.have.length(2)
                })
                .expect(200)
        })

        it('Failed to get categories by invalid parentId', async () => {
            await agent
                .post('/api/categories')
                .send({ parentId: '5ff323a40db1542dc0e4c793' })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'неверный идентификатор категории'
                    )
                })
                .expect(400)
        })
    })

    describe('POST /api/categories/getProducts', () => {
        it('User get 404 for non-existent category', async () => {
            const category = '/non/existent/category'

            await agent
                .post('/api/categories/getProducts')
                .send({ category })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('Не удалось найти товары')
                })
                .expect(404)
        })

        it('User can get products by category', async () => {
            let { _id } = await createCategory({title: 'parentCategory' })
            let { category } = await createCategory({title: 'subCategory', parentId: _id })
            
            category //?

            await createProduct({...FRESH_COFFEE_1, category}) //?
            await createProduct({...FRESH_COFFEE_2, category}) //?

            await agent
                .post('/api/categories/getProducts')
                .send({ category })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(2)
                })
                .expect(200)
        })

        // it('User can get all products in category subtree', async  () => {

        // })
    })
})
