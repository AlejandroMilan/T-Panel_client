<template>
  <div>
    <products-list></products-list>
  </div>
</template>

<script>
import productsList from "./productList.vue";

export default {
  components: {
    "products-list": productsList,
  },
};
</script>
