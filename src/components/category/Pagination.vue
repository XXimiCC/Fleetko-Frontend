<template>
  <ul class="custom-pagination" :class="containerClass" v-if="!noLiSurround">
    <li
      class="custom-pagination--prev"
      :class="[prevClass, { disabled: firstPageSelected() }]"
    >
      <button
        :disabled="firstPageSelected()"
        @click="prevPage()"
        @keyup.enter="prevPage()"
        :class="prevLinkClass"
        tabindex="0"
      >
        <slot name="prevContent"
          ><i class="fa fa-angle-left" aria-hidden="true"></i
        ></slot>
      </button>
    </li>
    <li
      class="custom-pagination--pages"
      v-for="page in pages"
      :class="[
        pageClass,
        page.selected ? activeClass : '',
        { disabled: page.disabled }
      ]"
    >
      <span v-if="page.disabled" :class="pageLinkClass" tabindex="0">{{
        page.content
      }}</span>
      <span
        v-else
        @click="handlePageSelected(page.index)"
        @keyup.enter="handlePageSelected(page.index)"
        :class="pageLinkClass"
        tabindex="0"
        >{{ page.content }}</span
      >
    </li>
    <li
      class="custom-pagination--next"
      :class="[nextClass, { disabled: lastPageSelected() }]"
    >
      <button
        :disabled="lastPageSelected()"
        @click="nextPage()"
        @keyup.enter="nextPage()"
        :class="nextLinkClass"
        tabindex="0"
      >
        <slot name="nextContent"
          ><i class="fa fa-angle-right" aria-hidden="true"></i
        ></slot>
      </button>
    </li>
  </ul>

  <div :class="containerClass" v-else>
    <a
      @click="prevPage()"
      @keyup.enter="prevPage()"
      :class="[prevLinkClass, { disabled: firstPageSelected() }]"
      tabindex="0"
      ><slot name="prevContent">{{ prevText }}</slot></a
    >
    <template v-for="page in pages">
      <a
        v-if="page.disabled"
        :class="[
          pageLinkClass,
          page.selected ? activeClass : '',
          { disabled: page.disabled }
        ]"
        tabindex="0"
        >{{ page.content }}</a
      >
      <a
        v-else
        @click="handlePageSelected(page.index)"
        @keyup.enter="handlePageSelected(page.index)"
        :class="[
          pageLinkClass,
          { active: page.selected, disabled: page.disabled }
        ]"
        tabindex="0"
      >
        {{ page.content }}
      </a>
    </template>
    <a
      @click="nextPage()"
      @keyup.enter="nextPage()"
      :class="[nextLinkClass, { disabled: lastPageSelected() }]"
      tabindex="0"
      ><slot name="nextContent">{{ nextText }}</slot></a
    >
  </div>
</template>

<script>
export default {
  props: {
    pageCount: {
      type: Number,
      required: true
    },
    initialPage: {
      type: Number,
      default: 0
    },
    forcePage: {
      type: Number
    },
    clickHandler: {
      type: Function,
      default: () => {}
    },
    pageRange: {
      type: Number,
      default: 3
    },
    marginPages: {
      type: Number,
      default: 1
    },
    prevText: {
      type: String,
      default: 'Prev'
    },
    nextText: {
      type: String,
      default: 'Next'
    },
    containerClass: {
      type: String
    },
    pageClass: {
      type: String
    },
    pageLinkClass: {
      type: String
    },
    prevClass: {
      type: String
    },
    prevLinkClass: {
      type: String
    },
    nextClass: {
      type: String
    },
    nextLinkClass: {
      type: String
    },
    activeClass: {
      type: String,
      default: 'active'
    },
    noLiSurround: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: this.initialPage
    }
  },
  beforeUpdate () {
    if (this.forcePage === undefined) return
    if (this.forcePage !== this.selected) {
      this.selected = this.forcePage
    }
  },
  computed: {
    pages: function () {
      let items = {}
      if (this.pageCount <= this.pageRange) {
        for (let index = 0; index < this.pageCount; index++) {
          let page = {
            index: index,
            content: index + 1,
            selected: index === this.selected
          }
          items[index] = page
        }
      } else {
        let leftPart = this.pageRange / 2
        let rightPart = this.pageRange - leftPart
        if (this.selected < leftPart) {
          leftPart = this.selected
          rightPart = this.pageRange - leftPart
        } else if (this.selected > this.pageCount - this.pageRange / 2) {
          rightPart = this.pageCount - this.selected
          leftPart = this.pageRange - rightPart
        }
        let setPageItem = index => {
          let page = {
            index: index,
            content: index + 1,
            selected: index === this.selected
          }
          items[index] = page
        }
        let setBreakView = index => {
          let breakView = {
            content: '...',
            disabled: true
          }
          items[index] = breakView
        }
        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i)
        }
        // 2nd - loop thru high end of margin pages
        for (
          let i = this.pageCount - 1;
          i >= this.pageCount - this.marginPages;
          i--
        ) {
          setPageItem(i)
        }
        // 3rd - loop thru selected range
        let selectedRangeLow = 0
        if (this.selected - this.pageRange > 0) {
          selectedRangeLow = this.selected - this.pageRange
        }
        let selectedRangeHigh = this.pageCount
        if (this.selected + this.pageRange < this.pageCount) {
          selectedRangeHigh = this.selected + this.pageRange
        }
        for (
          let i = selectedRangeLow;
          i <= selectedRangeHigh && i <= this.pageCount - 1;
          i++
        ) {
          setPageItem(i)
        }
        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1)
        }
        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }
      }
      return items
    }
  },
  methods: {
    handlePageSelected (selected) {
      if (this.selected === selected) return
      this.selected = selected
      this.clickHandler(this.selected + 1)
    },
    prevPage () {
      if (this.selected <= 0) return
      this.selected--
      this.clickHandler(this.selected + 1)
    },
    nextPage () {
      if (this.selected >= this.pageCount - 1) return
      this.selected++
      this.clickHandler(this.selected + 1)
    },
    firstPageSelected () {
      return this.selected === 0
    },
    lastPageSelected () {
      return this.selected === this.pageCount - 1 || this.pageCount === 0
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-pagination {
  margin-left: 53px;
  padding: 0;
  margin-bottom: 0;
  list-style: none;
  display: flex;
  align-items: center;
  &--prev {
    button {
      padding: 0;
      display: flex;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: white;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 16px;
      color: $border-color;
      cursor: pointer;
      &:hover {
        border: 1px solid $main-color;
        color: $main-color;
      }
      &:disabled {
        &:hover {
          border: 1px solid $border-color;
          color: $border-color;
          cursor: not-allowed;
        }
      }
    }
  }
  &--pages {
    margin-left: 15px;
    span {
      font-size: 16px;
      font-family: $sours-sans-p-font;
      color: $caption-text-color;
      cursor: pointer;
      &:hover {
        color: $main-color;
      }
      &:focus {
        outline: none;
      }
    }
  }
  &--next {
    margin-left: 15px;
    cursor: pointer;
    button {
      padding: 0;
      display: flex;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: white;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 16px;
      color: $border-color;
      cursor: pointer;
      &:hover {
        border: 1px solid $main-color;
        color: $main-color;
      }
      &:disabled {
        &:hover {
          border: 1px solid $border-color;
          color: $border-color;
          cursor: not-allowed;
        }
      }
    }
  }
  .active {
    span {
      color: $main-color;
      font-weight: 600;
    }
  }
}
a {
  cursor: pointer;
}
</style>
