<template>
    <div :class="['video-wrapper', fullScreen?'video-fullScreen':'', show?'player-show':'player-hide']">
        <!-- <iframe v-if="isOtherWebview" :src="'/videoPlayer.html?url=' + encodeURIComponent(video_url)" width="100%" height="100%" class="video-frame" frameborder="0"></iframe> -->
        <iframe id="videoInset" ref="videoInset" v-if="isOtherWebview" :src="video_url" width="100%" height="100%"
            class="video-frame" frameborder="0"></iframe>
        <div class="iframe-cover"></div>
        <video v-if="!isOtherWebview" ref="video" class="video-box" :preload="true" width="100%" @click="onClick"
            @ended="onVideoPlayEnd" @canplaythrough="onCanplaythrough" @canplay="onCanplay" @progress="onProgress"
            :src="video_url" :autoplay="autoPlay" :controls="false" :playsinline="true" :x5-playsinline="true"
            :webkit-playsinline="true" x5-video-player-type="h5" x-webkit-airplay="allow"
            :x5-video-player-fullscreen="fullScreen" x5-video-orientation="portraint">
            <source :src="video_url" type="video/mp4">
            <source :src="video_url" type="video/ogg">
            <source :src="video_url" type="video/webm">
            <p>您的浏览器不支持播放视频。</p>
        </video>
    </div>
</template>

<script>
    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
            ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
            ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
            return true;
        } else {
            return false;
        }
    }

    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false
    }

    export default {
        name: '',
        props: {
            fullScreen: {
                type: Boolean,
                default: false
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            src: {
                type: [String, Array],
                default: function () {
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
                this.checkDevice()
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
                showPlayer: false,
                canplaythrough: false,
                isLoading: false,
                isOtherWebview: false
            }
        },

        created() {
            this.video_url = this.src || ''
            this.showPlayer = this.show
        },

        methods: {
            handlerVideoAction(e) {
                e = e || window.event;
                e.stopPropagation();
                e.preventDefault();
            },

            checkDevice() {
                if (!(isWeiXin() || isSafari())) {
                    this.isOtherWebview = true
                    setTimeout(() => {
                        this.$emit('ended')
                    }, 31000);
                    
                    // 调整iframe中video样式
                    // setTimeout(() => {
                    //     // console.log('jquery对象：', $('#videoInset').contents().find('video'))
                    //     try {
                    //         let d = document.getElementById('videoInset').contentWindow.document.getElementsByTagName('video')
                    //         console.log('jquery对象：', d)

                    //     } catch (e) {
                    //         console.log(e)
                    //     }

                    // }, 500);

                }
            },

            onCanplaythrough() {
                this.canplaythrough = true
            },

            onCanplay() { },
            onProgress(e) { },

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
    /* native控制条隐藏 */
    video::-webkit-media-controls {
        display: none !important;
    }

    .iframe-cover {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
    }

    .video-frame {
        width: 100%;
        height: 100%;
    }

    .video-box {
        width: 100%;
        height: 100%;
    }

    .video-cover {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

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
        position: fixed;
        z-index: 999;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: black;
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