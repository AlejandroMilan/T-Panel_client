<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="6" v-for="i in 4" :key="i">
        <userCard class="mb-2"></userCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import userCard from "./userCard";

export default {
  name: "usersView",

  components: { userCard },
};
</script>
