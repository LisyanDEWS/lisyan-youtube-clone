<template>
  <div id="watch" ref="watch">
    <v-container fluid>
      <v-row>
        <v-alert prominent class="mx-auto" type="error" v-if="errored">
          <v-row align="center">
            <v-col class="grow">
              <div class="title">Error!</div>
              <div>
                Something went wrong, but don’t fret — let’s give it another
                shot.
              </div>
            </v-col>
            <v-col class="shrink">
              <v-btn @click="actions">Take action</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-col v-else cols="11" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="8">
              <v-skeleton-loader
                type="card-avatar, article, actions"
                :loading="videoLoading"
                tile
                large
              >
                <div ref="hello">
                  <v-responsive max-height="450">
                    <video
                      ref="videoPlayer"
                      controls
                      style="height: 100%; width: 100%"
                    >
                      <source :src="videoUrl" type="video/mp4" />
                    </video>
                  </v-responsive>

                  <v-card flat tile class="card">
                    <v-card-title class="pl-0 pb-0">{{
                      video.title
                    }}</v-card-title>
                    <div
                      class="d-flex flex-wrap justify-space-between"
                      id="btns"
                    >
                      <v-card-subtitle
                        class="pl-0 pt-0 pb-0 subtitle-1"
                        style="line-height: 2.4em;"
                      >
                        {{ video.views }} views<v-icon>mdi-circle-small</v-icon
                        >{{ dateFormatter(video.published || video.createdAt) }}
                      </v-card-subtitle>
                    </div>
                  </v-card>

                  <v-row class="justify-space-between">
                    <v-col cols="12" sm="6" md="5" lg="5">
                      <v-card class="transparent" flat>
                        <v-list-item three-line>
                          <v-list-item-avatar v-if="video.author" size="50">
                            <v-avatar color="red">
                              <span class="white--text headline">
                                {{ video.author.charAt(0).toUpperCase() }}
                              </span>
                            </v-avatar>
                          </v-list-item-avatar>
                          <v-list-item-content v-if="video.author" class="align-self-auto">
                            <v-list-item-title class="font-weight-medium mb-1">{{ video.author }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="4">
                      <div class="d-flex justify-end align-center" v-if="video.author">
                        <v-btn
                          v-if="showSubBtn"
                          class="red white--text mt-6"
                          tile
                          large
                          depressed
                          disabled
                          >subscribe</v-btn
                        >
                      </div>
                    </v-col>
                    <v-col class="pl-11" offset="1" cols="11" md="11">
                      <p>
                        {{
                          truncate
                            ? truncateText(video.description || '', 150)
                            : video.description
                        }}
                      </p>
                      <v-btn text @click="show" class="remove-hover-bg"
                        >Show More</v-btn
                      >
                    </v-col>
                  </v-row>
                </div>
              </v-skeleton-loader>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4">
              <hr class="grey--text" />
              <h4 class="mb-3 mt-3">Up next</h4>
              <div
                v-for="(video, i) in loading ? 12 : videos"
                :key="i"
                class="mb-5"
              >
                <v-skeleton-loader
                  class="mx-auto"
                  type="list-item-avatar-three-line"
                  :loading="loading"
                  tile
                  large
                >
                  <v-card class="card" tile flat v-if="!loading" :to="`/watch/${video.videoId || video.id}`">
                    <v-row no-gutters>
                      <v-col class="mx-auto" cols="12" sm="12" md="5" lg="5">
                        <v-img
                          class="align-center"
                          height="110"
                          :src="video.thumbnail || (video.videoId ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg` : '')"
                        />
                      </v-col>
                      <v-col>
                        <div class="ml-2">
                          <v-card-title
                            class="pl-2 pt-0 subtitle-1 font-weight-bold"
                            style="line-height: 1"
                          >
                            {{ video.title }}
                          </v-card-title>

                          <v-card-subtitle
                            class="pl-2 pt-2 pb-0"
                            style="line-height: 1"
                          >
                            {{ video.author }}<br />
                            {{ video.viewCount || video.views || 0 }} views<v-icon
                              >mdi-circle-small</v-icon
                            >
                            {{ dateFormatter(video.published || video.createdAt) }}
                          </v-card-subtitle>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-skeleton-loader>
              </div>
              <infinite-loading :identifier="infiniteId" @infinite="getVideos">
                <div slot="spinner">
                  <v-progress-circular
                    indeterminate
                    color="red"
                  ></v-progress-circular>
                </div>
                <div slot="no-results"></div>
                <span slot="no-more"></span>
                <div slot="error" slot-scope="{ trigger }">
                  <v-alert prominent type="error">
                    <v-row align="center">
                      <v-col class="grow">
                        <div class="title">Error!</div>
                        <div>
                          Something went wrong, but don’t fret — let’s give it
                          another shot.
                        </div>
                      </v-col>
                      <v-col class="shrink">
                        <v-btn @click="trigger">Take action</v-btn>
                      </v-col>
                    </v-row>
                  </v-alert>
                </div>
              </infinite-loading>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'
import InfiniteLoading from 'vue-infinite-loading'

import { invidiousApi } from '@/services/invidious'

export default {
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    videoLoading: true,
    subscribed: false,
    subscribeLoading: false,
    showSubBtn: false,
    feeling: '',
    video: {},
    videoId: '',
    videos: [],
    page: 1,
    infiniteId: +new Date(),
    truncate: true,
    url: process.env.VUE_APP_URL,
    signinDialog: false,
    details: {},
    videoUrl: ''
  }),
  methods: {
    async getVideo(id) {
      this.errored = false
      this.videoLoading = true
      this.video = {}
      try {
        const video = await invidiousApi.getVideo(id)
        if (!video) return this.$router.push('/')
        this.video = video
        this.videoUrl = video.hlsUrl || video.dashUrl || ''
      } catch (err) {
        this.errored = true
        console.log(err)
      } finally {
        this.videoLoading = false
      }
    },
    async getVideos($state) {
      this.errored = false
      if (!this.loaded) {
        this.loading = true
      }
      const videos = await invidiousApi
        .getTrending('US', 'default')
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => (this.loading = false))

      if (!videos) return

      const mapped = Array.isArray(videos) ? videos : videos.videos || []
      if (mapped.length) {
        this.page += 1
        this.videos.push(...mapped)
        if ($state) {
          $state.loaded()
        }
        this.loaded = true
      } else if ($state) {
        $state.complete()
      }
    },
    actions() {
      this.getVideo(this.$route.params.id)
    },
    show(event) {
      if (event.target.innerText === 'SHOW MORE') {
        this.truncate = false
        event.target.innerText = 'SHOW LESS'
      } else {
        this.truncate = true
        event.target.innerText = 'SHOW MORE'
      }
    },
    truncateText(string = '', num) {
      if (string.length <= num) {
        return string
      }
      return string.slice(0, num)
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    }
  },
  components: {
    InfiniteLoading
  },
  mounted() {
    this.getVideo(this.$route.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    this.page = 1
    ;(this.loading = false), (this.loaded = false), (this.videos = [])
    this.infiniteId += 1
    this.getVideo(to.params.id)
    next()
  }
}
</script>

<style lang="scss">
video {
  max-width: 100%;
}

.grey-color {
  color: #7f7f7f !important;
}

#btns {
  border-bottom: 1px solid #e0d8d8;
}

button.v-btn.remove-hover-bg {
  background-color: initial !important;
  &:hover {
    background-color: #f9f9f9;
  }
}
</style>
