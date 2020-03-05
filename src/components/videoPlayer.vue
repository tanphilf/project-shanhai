<template>
    <div :class="['video-wrapper', fullScreen?'video-fullScreen':'', show?'player-show':'player-hide']">
        <video 
            @click="onClick" 
            @ended="onVideoPlayEnd" 
            ref="video" 
            class="video-box" 
            :src="video_url"
            :autoplay="autoPlay" 
            :controls="false" 
            width="100%" 
            height="100%" 
            preload="auto" 
            x5-video-player-type="h5"
            :x5-playsinline="true"
            :playsinline="true"
            :webkit-playsinline="true"
            :x5-video-player-fullscreen="fullScreen" 
            x5-video-orientation="portraint">
        </video>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            fullScreen: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            src: {
                type: [String, Array],
                default: function() {
                    return ''
                }
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            src(nv) {
                this.video_url = nv
                console.log('更新视频链接：', this.video_url)
            },
            show(nv) {
                this.showPlayer = nv
            }
        },
        data() {
            return {
                video_url: '',
                showPlayer: false
            }
        },

        created() {
            this.video_url = this.src || ''
            this.showPlayer = this.show
        },

        mounted() {
            try {
                if (this.autoPlay&&this.$refs.video) {
                    // console.log('自动播放视频：', this.$refs.video)
                    this.$refs.video.play()
                }
            } catch (e) {
                console.log(e)
            }
        },

        methods: {
            onVideoPlayEnd() {
                this.$emit('ended')
            },
            onClick(e) {
                this.$emit('click', e)
            }
        }
    }
</script>

<style lang='scss'>
    .video-fullScreen {
        position: fixed;
        z-index: 999;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: black;
    }

    .video-wrapper {
        opacity: 0;
        transition: opacity ease-in-out 1.2s;
    }

    .player-show {
        z-index: 999;
        opacity: 1;
    }

    .player-hide {
        opacity: 0;
        z-index: -100;
    }
</style>