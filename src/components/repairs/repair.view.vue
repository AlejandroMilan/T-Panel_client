<template>
  <div>repair</div>
</template>

<script>
export default {
  name: "RepairView",

  mounted() {
    console.log(this.$route.params.repairId);
  },
};
</script>
