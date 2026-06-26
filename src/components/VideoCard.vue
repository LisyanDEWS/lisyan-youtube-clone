<template>
  <v-card
    class="content-bg card mx-auto"
    :max-width="card.maxWidth"
    flat
    tile
    router
    :to="`/watch/${video.videoId || video._id}`"
  >
    <v-img
      :src="thumbnailUrl"
      :aspect-ratio="16/9"
    ></v-img>
    <v-row no-gutters>
      <v-col cols="2" v-if="card.type !== 'noAvatar'">
        <v-list-item
          class="pl-0 pt-3"
          router
          :to="authorId ? `/channels/${authorId}` : '/'"
          @click.stop
        >
          <v-list-item-avatar>
            <v-avatar color="red">
              <span class="white--text headline">
                {{ authorInitial }}
              </span>
            </v-avatar>
          </v-list-item-avatar>
        </v-list-item>
      </v-col>
      <v-col>
        <v-card-title
          class="pl-2 pt-3 subtitle-1 font-weight-bold"
          style="line-height: 1.2rem"
        >
          {{ video.title }}
        </v-card-title>

        <v-card-subtitle class="pl-2 pb-0">
          {{ video.author }}
        </v-card-subtitle>
        <v-card-subtitle class="pl-2 pt-0">
          {{ video.viewCount || video.views || 0 }} views<v-icon>mdi-circle-small</v-icon
          >{{ dateFormatter(video.published || video.createdAt) }}
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'VideoCard',
  props: {
    video: {
      type: Object,
      required: true
    },
    card: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    thumbnailUrl() {
      if (this.video.videoThumbnails && this.video.videoThumbnails.length) {
        const hq = this.video.videoThumbnails.find(
          (t) => t.quality === 'medium' || t.quality === 'high'
        )
        return hq ? hq.url : this.video.videoThumbnails[0].url
      }
      const id = this.video.videoId || this.video._id
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
    },
    authorId() {
      return this.video.authorId || null
    },
    authorInitial() {
      const name = this.video.author || ''
      return name.charAt(0).toUpperCase() || '?'
    }
  },
  methods: {
    dateFormatter(date) {
      return date ? moment.unix(date).fromNow() : ''
    }
  }
}
</script>

<style></style>
