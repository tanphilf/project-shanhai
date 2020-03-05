<template>
    <div class="loading-home-page">
        <img src="../assets/loading_bg.png" class="loading-page-bg">
        <div class="loading-cover">
            <img src="../assets/loading_logo.png" class="home-logo" alt="">
            <div class="loading-progress" :style="{opacity: progress>=100?0:1}">
                <img src="../assets/loading-progress-bar.gif" class="loading-bar" alt="">
                <div class="loading-progress-value">
                    <img src="../assets/loading_progress_value.png" class="loading-value-bg" alt="">
                    <span class="loading-value">{{progress}}%</span>
                </div>
            </div>
            <img @click="onEnter" src="" class="enter-btn" :style="{opacity: progress<100?0:1}" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                progress: 0,
                display_btn: false
            }
        },
        created() {
            this.startLoading()
        },
        methods: {
            startLoading() {
                let p_timer = setInterval(() => {
                    let dt = Math.floor(Math.random() * Math.floor(Math.random() * 30))
                    this.progress = this.progress + dt > 100 ? 100 : this.progress + dt
                    if (this.progress >= 100) {
                        clearInterval(p_timer)
                        this.onLoadingEnd()
                    }
                }, 500)
            },

            onLoadingEnd() {
                this.$emit('loadingEnd')
            },

            onEnter() {
                this.$emit('enter')
            }
        }
    }
</script>

<style lang='scss'>
    .loading-home-page {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .loading-page-bg {
            width: 100%;
            height: 100%;
        }

        .loading-cover {
            display: flex;
            flex-direction: column;
            align-items: center;
            /* justify-content: center; */
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding-top: 2rem;
            background-color: rgba(0, 0, 0, 0.5);

            .home-logo {
                width: 4rem;
                height: 4rem;
            }

            @keyframes enterBtn {

                0%,
                100% {
                    transform: scale(0.9);
                }

                50% {
                    transform: scale(1);
                }
            }

            .enter-btn {
                width: 3.8rem;
                height: 1.42rem;
                top: 3rem;
                background-color: rgba($color: white, $alpha: 0.56);
                /* position: absolute; */
                transition: opacity ease-in-out 1.2s 1.6s;
                animation: enterBtn 2s infinite;
            }

            .loading-progress {
                width: 3.2rem;
                margin-top: 3.2rem;
                position: relative;
                transition: opacity ease-in-out 1.2s;

                .loading-bar {
                    width: 3.2rem;
                    height: .86rem;
                    position: absolute;
                    z-index: 10;
                }

                .loading-progress-value {
                    position: absolute;
                    z-index: 8;
                    top: -1.1rem;
                    right: -0.5rem;

                    .loading-value-bg {
                        width: 1.4rem;
                        height: 1.78rem;
                    }

                    .loading-value {
                        position: absolute;
                        width: 1rem;
                        text-align: center;
                        top: 19px;
                        right: 8px;
                        color: white;
                        font-size: .3rem;
                    }
                }
            }
        }
    }
</style>