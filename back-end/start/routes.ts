/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const ReviewsController = () => import('#controllers/reviews_controller')

router.on('/').render('pages/home')

router.post('/login', [UsersController, 'login'])
router.post('/register', [UsersController, 'register'])

router.get('/products', [ProductsController, 'getAll']).use([middleware.auth()])
router.post('/products', [ProductsController, 'create']).use([middleware.auth()])
router.get('/products/:id', [ProductsController, 'getById']).use([middleware.auth()])
router.put('/products/:id', [ProductsController, 'update']).use([middleware.auth()])
router.delete('/products/:id', [ProductsController, 'delete']).use([middleware.auth()])

router.post('/products/:id/reviews', [ReviewsController, 'create']).use([middleware.auth()])
router.get('/products/:id/reviews', [ReviewsController, 'getByProduct']).use([middleware.auth()])
