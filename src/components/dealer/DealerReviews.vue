<template>
  <div class="container">
    <div class="dealer-reviews">
      <h3 class="dealer-reviews__title">All Reviews</h3>
      <div class="dealer-reviews__rate">
        <div class="item">
          <star
            :position="++i"
            :key="i"
            :readOnly="true"
            :size="13"
            :borderWidth="3"
            :padding="0"
            :rating="globalRate"
            v-for="(star, i) in 5"
          ></star>
        </div>
        <div class="item"><span>Based on 56 reviews</span></div>
        <div class="counter"><span>4.5 out of 5 star</span></div>
      </div>

      <div class="review" v-for="review in 3">
        <div class="review--header">
          <div class="review--header--user">
            <img src="http://via.placeholder.com/350x150" alt="" />
            <span>Perry White</span>
          </div>
          <div class="review--header--rate">
            <star
              :position="++i"
              :key="i"
              :readOnly="true"
              :size="8"
              :borderWidth="2"
              :padding="0"
              :rating="commentRate"
              v-for="(star, i) in 5"
            ></star>
            <span>{{ commentRate }}</span>
          </div>
          <div class="review--header--date"><span>24/06/2017</span></div>
        </div>
        <div class="review--body">
          <div class="review--body--title">
            <h4 class="h4-secondary">Amazing Product</h4>
          </div>
          <div class="review--body--text">
            <span class="text"
              >Received product within normal time frame even with several
              backorder dates from manufacturer. Wheel is great quality and all
              the controls as well as the air back fit perfectly. Cadillac
              dealer did the install within 90 minutes and cost just $120.</span
            >
          </div>
        </div>
      </div>
      <div class="dealer-reviews__more"><span>Load More</span></div>
    </div>
  </div>
</template>

<script>
import Star from '../common-components/Star'
export default {
  name: 'dealer-reviews',
  data () {
    return {
      globalRate: 3.5,
      commentRate: 4
    }
  },
  components: {
    Star
  }
}
</script>

<style scoped lang="scss">
.dealer-reviews {
  margin-top: 64px;
  margin-bottom: 64px;
  &__title {
    margin-bottom: 16px;
    line-height: 1;
  }
  &__rate {
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
      display: flex;
      align-items: center;
      span {
        margin-left: 16px;
        font-family: $sours-sans-p-font;
        font-size: 14px;
        color: $main-color;
        cursor: pointer;
      }
    }
    .counter {
      margin-top: 16px;
      width: 100%;
      span {
        font-family: $montserrat-font;
        font-size: 16px;
        font-weight: 500;
        color: $main-dark;
      }
    }
  }
  &__more {
    margin-top: 60px;
    display: flex;
    justify-content: center;
    span {
      font-family: $montserrat-font;
      font-size: 20px;
      font-weight: 500;
      color: $main-color;
      cursor: pointer;
    }
  }
  .review {
    &--header {
      display: flex;
      align-items: center;
      &--user {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
          border-radius: 100%;
        }
        span {
          margin-left: 16px;
          font-family: $montserrat-font;
          font-size: 12px;
          font-weight: 500;
          color: $main-dark;
        }
      }
      &--rate {
        margin-left: 32px;
        display: flex;
        align-items: center;
        span {
          margin-left: 8px;
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 12px;
          font-weight: 500;
        }
      }
      &--date {
        margin-left: 32px;
        display: flex;
        span {
          color: $paragraph;
          font-family: $sours-sans-p-font;
          font-size: 14px;
        }
      }
    }
    &--body {
      &--title {
        margin-top: 24px;
      }
      &--text {
        .text {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $paragraph;
          line-height: 19px;
        }
        .blurred-text {
          position: relative;
          &:after {
            position: absolute;
            content: '';
            right: 0;
            height: 15px;
            width: 200px;
            bottom: 0;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 1) 100%
            ); /* W3C */
          }
        }
        .more {
          margin-left: 8px;
          z-index: 50;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-color;
          cursor: pointer;
        }
      }
    }
  }
  .review + .review {
    margin-top: 64px;
  }
}
@media (min-width: $sm) and (max-width: $md) {
  .dealer-reviews {
    margin-top: 64px;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .dealer-reviews {
    margin-top: 48px;
    margin-bottom: 48px;
    .review {
      &--header {
        flex-wrap: wrap;
        &--user {
          flex: 0 0 50%;
          order: 1;
        }
        &--date {
          justify-content: flex-end;
          margin-left: 0;
          flex: 0 0 50%;
          order: 2;
        }
        &--rate {
          margin-top: 8px;
          margin-left: 0;
          order: 3;
        }
      }
    }
  }
}
</style>
