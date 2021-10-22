<template>
  <v-card v-if="comment" outlined class="mb-2" color="secondary" dark>
    <div>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{
            comment.author ? comment.author.name : "Usuario eliminado"
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            fullDate(comment.date)
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </div>
    <v-card-text style="white-space: pre-wrap">
      <span>{{ comment.content }}</span>
      <v-img
        v-if="comment.files.length"
        :src="comment.files[0]"
        class="mt-3"
        :max-width="
          showFullImage || !$vuetify.breakpoint.mdAndUp ? '100%' : '300px'
        "
      ></v-img>
    </v-card-text>
  </v-card>
</template>

<script>
import { getFullDateWithHour } from "@/helpers/date.helper";

export default {
  name: "CommentCard",

  props: {
    comment: { type: Object, defualt: null },
    showFullImage: { type: Boolean, default: false },
  },

  methods: {
    fullDate(isoDate) {
      return getFullDateWithHour(isoDate);
    },
  },
};
</script>
