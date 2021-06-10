<template>
  <v-card v-if="comment" outlined class="mb-2">
    <div>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ comment.author.name }}</v-list-item-title>
          <v-list-item-subtitle>{{
            fullDate(comment.date)
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </div>
    <v-card-text>{{ comment.content }}</v-card-text>
  </v-card>
</template>

<script>
import { getFullDateWithHour } from "@/helpers/date.helper";

export default {
  name: "CommentCard",

  props: {
    comment: { type: Object, defualt: null },
  },

  methods: {
    fullDate(isoDate) {
      return getFullDateWithHour(isoDate);
    },
  },
};
</script>
