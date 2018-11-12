import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/layouts/Main'
import EmptyLayout from '@/components/layouts/Empty'
import Homepage from '@/components/homepage/Homepage'
import Category from '@/components/category/Category'
import Dealer from '@/components/dealer/Dealer'
import ProductPage from '@/components/product-page/ProductMain'

import Search from '@/components/search-page/Search'
import SearchResult from '@/components/search-page/SearchResult'

import Profile from '@/components/user-info/Profile'
import OrderHistory from '@/components/user-info/OrderHistory'
import AccountSettings from '@/components/user-info/Settings'
import AddressBokk from '@/components/user-info/AddressBook'
import WaitList from '@/components/user-info/WaitList'
import ViewedGoods from '@/components/user-info/ViewedGoods'
import Purchases from '@/components/user-info/Purchases'
import Billing from '@/components/user-info/Billing'

import ResetPassword from '@/components/reset-password/ResetPassword'
import EmailRecovery from '@/components/email-recovery/EmailRecovery'

import Section from '@/components/section/Section'

import Cart from '@/components/shopping-cart/Cart'
import ShippingMethod from '@/components/checkout/ShippingMethod'
import PaymentMethod from '@/components/checkout/payment-method/PaymentMethod'
import OrderReview from '@/components/checkout/order-review/OrderReview'

import SingleOrder from '@/components/user-info/SingleOrder'

import ContactUs from '@/components/contact-us/ContactUs'
import TermsOfUse from '@/components/technical-pages/TermsOfUse'
import PrivacyPolicy from '@/components/technical-pages/PrivacyPolicy'
import LoginAs from '@/components/login-as/LoginAs'
import EmailVerification from '@/components/email-verification/EmailVerification'

import Location from '@/components/location/Location'

import notFound from '../components/404/notFound'

Vue.use(Router)

export default new Router({
  mode: 'history',

  scrollBehavior (to, from, savedPosition) {
    let catalog = to.name === 'catalog' && from.name === 'catalog'
    let dealer = to.name === 'dealer' && from.name === 'dealer'
    let searchResult = to.name === 'searchResult' && from.name === 'searchResult'

    if (!catalog && !searchResult && !dealer) {
      return { x: 0, y: 0 }
    }
  },

  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Homepage
        },
        {
          path: '/contact-us',
          name: 'contactUs',
          component: ContactUs
        },
        {
          path: '/terms-of-service',
          name: 'termsOfUse',
          component: TermsOfUse
        },
        {
          path: '/privacy-policy',
          name: 'privacyPolicy',
          component: PrivacyPolicy
        },
        {
          name: 'cartPage',
          path: '/shopping-cart',
          component: Cart
        },
        {
          name: 'catalog',
          path: '/category/:slug',
          component: Category,
          beforeEnter: (to, from, next) => {
            if (to.params.slug) {
              next()
            } else {
              next('/')
            }
          }
        },
        {
          name: 'section',
          path: '/section/:slug',
          component: Section
        },
        {
          name: 'product-page',
          path: '/product/:slug',
          component: ProductPage,
          beforeEnter: (to, from, next) => {
            if (to.params.slug) {
              next()
            } else {
              next('/')
            }
          }
        },
        {
          name: 'searchPage',
          path: '/vehicle/:slug',
          component: Search
        },
        {
          name: 'searchResult',
          path: '/search',
          component: SearchResult
        },
        {
          name: 'dealer',
          path: '/dealer/:slug',
          component: Dealer,
          beforeEnter: (to, from, next) => {
            if (to.params.slug) {
              next()
            } else {
              next('/')
            }
          }
        },
        {
          path: '/profile',
          meta: { auth: true },
          component: Profile,
          children: [
            {
              path: 'order-history',
              name: 'orderHistory',
              component: OrderHistory
            },
            {
              path: 'address-book',
              name: 'addressBook',
              component: AddressBokk
            },
            {
              path: 'settings',
              name: 'settings',
              component: AccountSettings
            },
            {
              path: 'wait-list',
              name: 'waitList',
              component: WaitList
            },
            {
              path: 'purchases',
              name: 'purchases',
              component: Purchases
            },
            {
              path: 'viewed',
              name: 'viewed',
              component: ViewedGoods
            },
            {
              path: 'billing',
              name: 'billing',
              component: Billing
            }
          ]
        },
        {
          path: 'order/:id',
          meta: { auth: true },
          name: 'singleOrder',
          component: SingleOrder
        },
        {
          path: 'inpersonate',
          name: 'loginAs',
          component: LoginAs
        },
        {
          path: '/email-confirmation',
          name: 'emailVerification',
          component: EmailVerification
        },
        {
          path: '/location/:id',
          name: 'location',
          component: Location
        }
      ]
    },
    {
      path: '/checkout',
      component: EmptyLayout,
      children: [
        {
          name: 'shipping-method',
          path: '/checkout/shipping-method',
          meta: { auth: true },
          component: ShippingMethod,
          beforeEnter: (to, from, next) => {
            if (from.name === 'cartPage') {
              next()
            } else if (from.name === 'payment-method') {
              next('/profile/order-history')
            } else {
              next('/shopping-cart')
            }
          }
        },
        {
          name: 'payment-method',
          path: '/checkout/payment',
          meta: { auth: true },
          component: PaymentMethod
        },
        {
          name: 'order-review',
          path: '/checkout/order-review',
          meta: { auth: true },
          component: OrderReview
        }
      ]
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword
    },
    {
      path: '/email-recovery',
      name: 'emailRecovery',
      component: EmailRecovery
    },
    {
      path: '/404',
      name: 'not-found',
      component: notFound
    },
    {
      path: '*',
      name: '404',
      component: notFound
    }
  ]

})
