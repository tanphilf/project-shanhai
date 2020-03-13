<template>
  <div :class="['home', !isPhone?'not-isPhone':'']" @click="handClick">
    <loading v-if="step<=1" @loadingEnd="onLoadingDown" @enter="onEnterApp"></loading>
    <step-cover :show="step>4&&step<=9">
      <main-scene :startCar="(step>=5&&step<=9?true:false)" @carEnter="onCarEnter"></main-scene>
    </step-cover>

    <video-player v-if="step<=4" @click="onClickPlayer" :src="video" :show="!!video" @ended="onVideoPlayEnd">
    </video-player>

    <step-cover v-if="step>=2&&step<4" :show="step==3">
      <div class="dialog" @click="handDialogTap">我：啊呀！</div>
    </step-cover>

    <step-cover v-if="step>=3&&step<5" :show="step==4">
      <dialog-box :list="dg_ls" bottom="20%" @ended="onDialogEnded"></dialog-box>
    </step-cover>

    <step-cover v-if="step>=5&&step<7" :show="step==6" @click="nextStep" opacity="0.5">
      <div class="shake-tip-box">
        <div class="shake-box">
          <img src="../assets/main/hander.png" class="shake-hander" alt="">
          <img src="../assets/main/hander_tip.png" class="shake-hander-tip" alt="">
        </div>
      </div>
    </step-cover>

    <step-cover :show="step==8" opacity="0">
      <dialog-box :human="dg_humans" :list="dg_ls" bottom="20%" @ended="onDialogEnded"></dialog-box>
    </step-cover>

    <car-inside :show="step>=9" @storyEnded="onStoryEnded"></car-inside>

  </div>
</template>

<script>
  import Vconsole from 'vconsole';
  import loading from "@/components/loading.vue";
  import videoPlayer from "@/components/videoPlayer.vue";
  import stepCover from "@/components/stepCover.vue";
  import mainScene from "@/components/mainScene.vue"
  import dialogBox from "@/components/dialog.vue"
  import carInside from '@/components/car.vue'
  import videoUtil from "@/utils/video.js";

  // require('@/utils/check.js');

  var videoBuffer = '';

  export default {
    name: "Home",

    components: {
      loading,
      videoPlayer,
      stepCover,
      mainScene,
      dialogBox,
      carInside
    },

    data() {
      return {
        video: '',
        step: 0,
        videoPlayEnd: false,
        dg_humans: [],
        dg_ls: [require('../assets/main/d1.png')],
        audio: null,
        isPhone: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      }
    },

    created() {
      this.init()
    },

    beforeDestroy() {
      this.pauseMusic()
    },

    methods: {
      init() {
        videoUtil.parseVideoUrl('https://v.qq.com/x/page/y3077b8gz8z.html', res => {
          videoBuffer = res[0] || res
        })
      },

      onLoadingDown() {
        console.log('加载完毕')
      },

      onEnterApp() {
        console.log('点击开始')
        this.nextStep()
        this.videoPlayEnd = false
        if (videoBuffer) {
          this.video = videoBuffer
        } else {
          videoUtil.parseVideoUrl('https://v.qq.com/x/page/y3077b8gz8z.html', res => {
            this.video = res[0] || res
          })
        }
      },


      onVideoPlayEnd() {
        this.videoPlayEnd = true
        this.nextStep()
      },

      onClickPlayer() {
        if (this.step === 2 && this.videoPlayEnd) {
          this.video = ''
        }
      },

      handDialogTap() {
        this.video = ''
        this.nextStep()
        console.log('进入主场景', this.step)
      },

      onCarEnter() {
        this.nextStep()
      },

      initAudio(src) {
        this.audio = new Audio()
        this.audio.loop = true
        this.audio.volume = 0
        this.audio.src = (src && require(src)) || '';
        this.audio.load()
      },

      onDialogEnded() {
        this.nextStep()
        console.log('对话完毕', this.step)

        if (this.step == 5) {
          this.audio = new Audio()
          this.audio.loop = true
          this.audio.volume = 0
          this.audio.src = require('../assets/audio/station_bg_music.mp3')
          this.audio.load()
          this.playMusic(0.6)

          let carVolume = new Audio()
          carVolume.volume = 1
          carVolume.src = require('../assets/audio/train_call.mp3')
          carVolume.load()
          carVolume.play()
        }

        // ios背景音乐需要有交互才会播放
        let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

        if (this.step == 9 && isIos) {
          setTimeout(() => {
            this.audio.src = require('../assets/audio/bg_music.mp3')
          }, 2900);

          setTimeout(() => {
            this.playMusic(0.7)
          }, 5800);
        }
      },

      playMusic(vol = 0.9) {
        this.audio.play()
        let v = 0
        let timer = setInterval(() => {
          v += 0.1
          if (v > vol) {
            clearInterval(timer)
          } else {
            this.audio.volume = parseFloat(v).toFixed(1)
          }

        }, 200);
      },

      pauseMusic() {
        // this.audio.pause()
        let v = 1
        let timer = setInterval(() => {
          v -= 0.1
          if (v < 0.1) {
            this.audio.pause();
            this.audio.src = '';
            clearInterval(timer);
          } else {
            this.audio.volume = parseFloat(v).toFixed(1)
          }
        }, 200);
      },

      onStoryEnded() {
        this.pauseMusic();
      },

      handClick() {
        switch (this.step) {
          case 4: {
            this.nextStep()
          }; break;
          case 7: {
            this.dg_humans = [require('../assets/main/captain.png')];
            this.dg_ls = [require('../assets/main/d2.png')];
            this.nextStep()
          }; break;
          default: break;
        }
      },

      nextStep(e) {
        e = e || window.event;
        e && e.stopPropagation();
        this.step++
      }
    },
  }; </script>

<style lang="scss">
  .not-isPhone {}

  .home {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    background-color: black;

    .dialog {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .48rem;
      font-weight: bold;
      color: white;
    }

    .shake-tip-box {
      position: fixed;
      z-index: 200;
      left: 0;
      top: 50%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      transform: translateY(-50%);

      .shake-box {
        position: relative;
        width: 3.2rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        /* background-color: yellow; */

        .shake-hander {
          position: absolute;
          left: 50%;
          top: 12%;
          transform: translate(-55%, 0);
          width: 1.4rem;
          height: 1.4rem;
        }

        .shake-hander-tip {
          width: 100%;
          height: 2rem;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

    }
  }
</style>