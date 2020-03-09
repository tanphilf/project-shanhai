<template>
  <div class="home" @click="handClick">
    <loading v-if="step<=1" @loadingEnd="onLoadingDown" @enter="onEnterApp"></loading>

    <step-cover :show="step>4&&step<=9">
      <main-scene :startCar="(step>=5&&step<=9?true:false)" @carEnter="onCarEnter"></main-scene>
    </step-cover>

    <video-player @click="onClickPlayer" :src="video" :show="!!video" @ended="onVideoPlayEnd"></video-player>

    <step-cover :show="step==3">
      <div class="dialog" @click="handDialogTap">我：啊呀！</div>
    </step-cover>

    <step-cover :show="step==4">
      <dialog-box :list="dg_ls" bottom="20%" @ended="onDialogEnded"></dialog-box>
    </step-cover>

    <step-cover :show="step==6" @click="nextStep" opacity="0.5">
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
  import loading from "@/components/loading.vue";
  import videoPlayer from "@/components/videoPlayer.vue";
  import stepCover from "@/components/stepCover.vue";
  import mainScene from "@/components/mainScene.vue"
  import dialogBox from "@/components/dialog.vue"
  import carInside from '@/components/car.vue'
  import videoUtil from "@/utils/video.js";

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
        audio: null
      }
    },

    created() {
      // this.test()
    },

    beforeDestroy() {
      this.pauseMusic()
    },

    methods: {
      test() {
        this.step = 7
      },
      onLoadingDown() {
        console.log('加载完毕')
      },

      onEnterApp() {
        console.log('进入游戏')
        this.nextStep()
        this.videoPlayEnd = false
        // this.video = require('../assets/video/v1.mp4')
        videoUtil.parseVideoUrl('https://v.qq.com/x/page/y3077b8gz8z.html', res => {
          this.video = res[0] || res
        })
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

      onDialogEnded() {
        this.nextStep()
        console.log('对话完毕', this.step)

        // ios背景音乐需要有交互才会播放
        let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (this.step == 9 && isIos) {
          this.audio = new Audio()
          this.audio.loop = true
          this.audio.volume = 0
          this.audio.src = require('../assets/audio/bg_music.wav')
          this.audio.load()
          setTimeout(() => {
            this.playMusic()
          }, 6800);
        }
      },

      playMusic() {
        this.audio.play()
        let v = 0
        let timer = setInterval(() => {
          v += 0.1
          if (v > 0.9) {
            clearInterval(timer)
          } else {
            this.audio.volume = parseFloat(v).toFixed(1)
          }

        }, 200);
      },

      pauseMusic() {
        let v = 1
        let timer = setInterval(() => {
          v -= 0.1
          if (v < 0.1) {
            this.audio.pause()
            clearInterval(timer)
          } else {
            this.audio.volume = parseFloat(v).toFixed(1)
          }
        }, 200);
      },

      onStoryEnded() {
        this.pauseMusic()
      },

      handClick() {
        switch (this.step) {
          case 4: {
            this.nextStep()
          }; break;
          case 7: {
            this.dg_humans = [require('../assets/main/captain.png')]
            this.dg_ls = [require('../assets/main/d2.png')]
            this.nextStep()
          }; break;
          default: break;
        }
      },

      nextStep(e) {
        e = e || window.event
        e && e.stopPropagation();
        this.step++
      }

    },
  };
</script>

<style lang="scss">
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