<template>
  <div>
    <div class="col-xl-12 account-info">
      <div class="container">
        <div class="account-info__row row">
          <div v-if="userInfo" class="account-info--item col-xl-9 col-lg-8">
            <div class="image-wrap">
              <img
                class="account-info--item--avatar"
                :src="userImageSrc(userInfo, 80)"
                alt="user-avatar"
              />
            </div>
            <span v-if="fullName(userInfo)" class="account-info--item--name">{{
              fullName(userInfo)
            }}</span>
            <span v-else="" class="account-info--item--name">{{
              userInfo.email
            }}</span>
          </div>

          <div class="account-info--stats-wrap col-xl-3 col-lg-2">
            <div class="account-info--item--stats stats-justify-right">
              <p>{{ userInfo.pending_orders_count }}</p>
              <p>
                Pending <br />
                orders
              </p>
            </div>

            <div class="account-info--item--stats stats-justify-center">
              <p v-if="userWaitList">{{ userWaitList.length }}</p>
              <p>
                Wait <br />
                List
              </p>
            </div>

            <div class="account-info--item--stats stats-justify-content-left">
              <p>{{ userCreatedYear() }}</p>
              <p>
                Customer <br />
                Since
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="row account-info__orders-row">
        <div class="container">
          <div class="col-xl-12 p-0 account-info__links">
            <ul class="account-info__links--list">
              <li class="account-info__links--title">My Account</li>

              <router-link
                :to="{ name: tab.routeTo }"
                tag="li"
                :class="{ active: tab.active }"
                :key="index"
                v-for="(tab, index) in displayedTabs"
              >
                {{ tab.tabName }}
              </router-link>

              <li
                v-if="showMoreButton"
                @click="openResponsiveSidebar"
                class="account-info__responsive-more"
              >
                <span></span><span></span><span></span>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-xl-12 account-info--line"></div>
        <div class="container"><router-view></router-view></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
import utils from '@/mixins/utils'

export default {
  name: 'order-history',
  data () {
    return {
      firstName: '',
      lastName: '',
      email: 'test@gmail.com',
      displayedTabs: [],
      showMoreButton: false,
      tabs: [
        {
          active: false,
          routeTo: 'orderHistory',
          tabName: 'Order History'
        },
        {
          active: false,
          routeTo: 'addressBook',
          tabName: 'Address Book'
        },
        {
          active: false,
          routeTo: 'settings',
          tabName: 'Account Settings'
        },
        {
          active: false,
          routeTo: 'waitList',
          tabName: 'Wait List'
        },
        {
          active: false,
          routeTo: 'purchases',
          tabName: 'My Reviews'
        },
        {
          active: false,
          routeTo: 'viewed',
          tabName: 'Viewed Goods'
        },
        {
          active: false,
          routeTo: 'billing',
          tabName: 'Billing'
        }
      ]
    }
  },
  mixins: [utils],
  methods: {
    checkActiveTab (routeName) {
      this.tabs.forEach(tab => {
        tab.active = tab.routeTo === routeName
      })
    },
    fetchDataUser () {
      this.$store.dispatch('getAuthUser')
    },
    updateUser () {
      this.$store.dispatch('updateUser', {
        firstName: this.firstName,
        lastName: this.lastName
      })
    },
    userCreatedYear () {
      return parseInt(this.userInfo.created_at)
    },
    openResponsiveSidebar () {
      this.$store.dispatch('toggleResponsiveSidebar', {
        isOpen: true,
        isOpenUser: true
      })

      $('html, body').scrollTop(0)
      this.scrollingModalOpen(true)
    },
    calcDisplayedTabs () {
      let current = this.tabs.findIndex(tab => tab.active) + 1
      let vw = window.innerWidth
      let limit

      if (vw <= 960 && vw > 648) limit = 4
      if (vw <= 648) limit = 3

      if (limit) {
        this.displayedTabs =
          current <= limit
            ? this.tabs.slice(0, limit)
            : this.tabs.slice(current - limit, current)

        this.showMoreButton = true
      } else {
        this.displayedTabs = this.tabs
        this.showMoreButton = false
      }
    }
  },
  computed: {
    currentPage () {
      return this.$route.name
    },
    ...mapGetters(['isAuth', 'userInfo', 'userWaitList'])
  },
  beforeRouteUpdate (to, from, next) {
    this.checkActiveTab(to.name)
    this.calcDisplayedTabs()

    next()
  },
  created () {
    this.calcDisplayedTabs()
  },
  mounted () {
    this.checkActiveTab(this.$route.name)
    this.fetchDataUser()
    window.addEventListener('resize', this.calcDisplayedTabs)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcDisplayedTabs)
  }
}
</script>

<style lang="scss" scoped>
.no-pad-hint {
  padding: 0;
}

.account-info {
  padding: 24px 0 32px 0;
  background-color: #f7fafc;
  &__bread {
    span {
      font-family: $sours-sans-p-font;
      font-size: 12px;
      color: #bdbdbd;
      line-height: 1;
      cursor: pointer;
    }
  }
  &--line {
    margin-bottom: 64px;
    display: block;
    width: 100%;
    height: 1px;
    background: #f5f5f5;
  }
  &__row {
    display: flex;
    align-items: center;
    margin-top: 25px;
  }
  &--stats-wrap {
    max-width: 100%;
    width: auto;
    flex: auto;
    display: flex;
    justify-content: space-between;
  }
  &--item {
    display: flex;
    align-items: center;
    &:last-child {
      p {
        margin: 0;
      }
    }
    .image-wrap {
      margin-right: 18px;
    }
    &--avatar {
      width: 80px;
      height: 80px;
      border-radius: 100%;
    }
    &--name {
      font-family: $montserrat-font;
      color: $main-dark;
      font-size: 34px;
      font-weight: 400;
      line-height: 1;
    }
    &--stats {
      text-align: center;
      line-height: 1;
      p:first-child {
        margin: 0;
        font-family: $montserrat-font;
        color: $main-dark;
        font-size: 22px;
        font-weight: 500;
      }
      p:last-child {
        margin-top: 6px;
        margin-bottom: 0;
        font-family: $sours-sans-p-font;
        font-size: 14px;
        line-height: 18px;
        color: #9e9e9e;
      }
    }
  }
  &__orders-row {
    margin-top: 62px;
  }
  &__links {
    &--list {
      padding-left: 0;
      list-style: none;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      li {
        padding: 0 16px;
        margin-bottom: 0;
        font-family: $montserrat-font;
        font-size: 16px;
        font-weight: 300;
        color: $main-dark;
        cursor: pointer;
        line-height: 1;
        &:hover {
          color: $main-color;
        }
        &:first-child {
          margin-top: -2px;
          padding-left: 0;
          font-family: $montserrat-font;
          font-size: 20px;
          font-weight: 500;
          color: $main-dark;
          line-height: 1;
        }
      }
      li + li {
        /* prevent .responsive-more wrap*/
        @media (min-width: 648px) and (max-width: 700px) {
          width: 20%;
        }
      }
      .active {
        position: relative;
        color: $main-color;
        font-weight: normal;
        &:after {
          content: '';
          position: absolute;
          top: 34px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #1565c0;
        }
      }
    }
  }
  &__responsive-more {
    display: flex;
    align-items: center;

    span {
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: $main-grey;
    }
    span + span {
      margin-left: 6px;
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .account-info {
    .stats-justify-right {
      justify-content: right;
    }
    .stats-justify-left {
      justify-content: left;
    }
    .stats-justify-center {
      justify-content: center;
    }
    &__links {
      &--list {
        flex-wrap: wrap;
      }
      &--title {
        margin-bottom: 24px !important;
        width: 100%;
      }
    }
    &--item {
      &:first-child {
        width: 100%;
        justify-content: center;
      }
    }
    &--stats-wrap {
      margin-top: 32px;
      justify-content: center;
      padding: 0 194px;
    }
    .account-info--item--stats + .account-info--item--stats {
      margin-left: 58px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .account-info {
    &__orders-row {
      margin-top: 24px;
    }
    &--line {
      margin-bottom: 32px;
    }
    &__links {
      &--list {
        margin-left: -16px;
        margin-right: -16px;
        margin-bottom: 8px;
        flex-wrap: wrap;
        .active {
          &:after {
            top: 30px;
          }
        }
      }
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
        height: 24px;
        text-align: center;
        font-size: 12px;
        &:hover {
          color: inherit;
        }
      }
      &--title {
        margin-left: 16px;
        display: flex;
        justify-content: flex-start !important;
        margin-bottom: 24px !important;
        width: 100% !important;
      }
    }
    &--item {
      &:first-child {
        width: 100%;
        justify-content: center;
      }
      &--name {
        font-size: 16px;
      }
      .image-wrap {
        img {
          width: 48px;
          height: 48px;
        }
      }
    }
    &--stats-wrap {
      margin-top: 32px;
      justify-content: center;
      padding: 0;
    }
    .account-info--item--stats + .account-info--item--stats {
      margin-left: 58px;
    }
  }
}
</style>
