
<template>
  <!-- eslint-disable vue/require-component-is-->
  <component v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>
import { validateURL } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    query: {
      type: Object,
      required: false
    }
  },
  methods: {
    isExternalLink(routePath) {
      return validateURL(routePath);
    },
    linkProps(url) {
      if (this.isExternalLink(url)) {
        return {
          is: "a",
          href: url,
          target: "_blank",
          rel: "noopener"
        };
      }
      let to = { path: url };
      if (this.query) {
        to.query = this.query;
      }
      return {
        is: "router-link",
        to: to
      };
    }
  }
};
</script>
