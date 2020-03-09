<template>
    <div class="car-wrapper" :style="{zIndex: showBox?1000:-200, opacity: showBox?1: 0}">
        <div :class="['car-inside', showBox?'car-bg-in':'']">
            <img src="../assets/main/car_inside.png" :class="['car-bg']" alt="">
            <img src="../assets/main/car_inside_empty.png" style="opacity: 0;"
                :class="['car-bg', startStory||storyEnded||submitEnded||showCode?'car-bg-show':'']" alt="">
            <!-- 不同屏幕下浮层位置调整 -->
            <div class="cover-adapter" :style="{left: adapterX, top: adapterY}">
                <img @click="toggleBook" src="../assets/main/book.png" class="car-book" alt="">
                <img @click="tapJars" src="../assets/main/jars.png" class="car-jars" alt="">
                <img @click="tapScroll" src="../assets/main/scroll.png" class="car-scroll" alt="">
                <img @click="tapWorm" src="../assets/main/worm.png" class="car-worm" alt="">
                <img @click="toggleTip" src="../assets/main/horn.png" class="car-horn" alt="">
            </div>
        </div>

        <div :class="['car-door', showDoor?'door-show':'door-hide']">
            <img src="../assets/main/door2.png" :class="doorOpen?'door-2-in':'door-2-out'"
                @transitionend="onDoor2TransEnd" class="door door-2" alt="">
            <img src="../assets/main/door1.png" :class="doorOpen?'door-1-in':'door-1-out'"
                @transitionend="onDoor1TransEnd" class="door door-1" alt="">
        </div>

        <step-cover :show="showTip" opacity="0">
            <dialog-box height="180px" bottom="10px" @ended="toggleTip" :human="dg_humans" :list="dg_ls">
            </dialog-box>
        </step-cover>

        <step-cover :show="showBook" opacity="0.5">
            <img @click="toOpenBook" :class="['book-close', showBook?'book-show':'']"
                src="../assets/main/book_close.png" alt="">
            <img :class="['book-open', openBook?'book-show':'']" src="../assets/main/book_open.png" alt="">
        </step-cover>

        <step-cover :show="startStory" opacity="0">
            <dialog-box :step="step" :human="dg_humans" :dialogues="dialogues" bottom="14%" @stepChange="onStepChange"
                @ended="onDialogEnded" :autoChange="startStory"></dialog-box>
        </step-cover>

        <step-cover :show="storyEnded" opacity="0.32" :center="true">
            <div class="submit-box">
                <div class="platform-line">
                    <img src="../assets/main/sub_platform_ios.png" class="platform-btn" alt="">
                    <img src="../assets/main/sub_platform_ad.png" class="platform-btn" alt="">
                </div>

                <div class="submit-input-area">
                    <input @input="onInputPhoneNumber" maxlength="11" class="input-item" placeholder="手机号">
                    <input @input="onInputPhoneCode" class="input-item" placeholder="验证码">
                </div>

                <div class="submit-ops-btn">
                    <img @click="getCode" src="../assets/main/sub_getcode_btn.png" class="getcode-btn" alt="">
                    <img @click="onSubmit" src="../assets/main/submit_btn.png" class="submit-btn" alt="">
                </div>

            </div>
        </step-cover>

        <step-cover @hide="onToastHide" @click="hideTotast" :show="!!totast" center opacity="0" autoHide>
            <div class="totast-body">
                <div class="totast-content">{{totast}}</div>
            </div>
        </step-cover>

        <step-cover :show="submitEnded" opacity="0.64" center @click="toSummaryInfo">
            <div class="fall-curtain-view">
                <div @transitionend="onIntroTransEnd" class="fall-curtain-body" :class="submitEnded?'curtain-show':''">
                    <p>世间所有故事，都始于【遇见】</p>
                    <p>一辆蜥蜴列车，一趟异世之旅</p>
                    <p>白泽、黄龙、三曜、仲灵......还有你</p>
                    <p>被命运牵引，【遇见】彼此，牵绊一生</p>

                    <p>手握车票的你，还会在列车上【遇见】谁</p>
                    <p>你又会邀请谁，共赴这瑰丽奇美又波诡云谲的</p>
                    <p>山海世界......</p>
                </div>
            </div>
        </step-cover>

        <!-- 推广码 -->
        <step-cover :show="showCode" center opacity="0.84">
            <div class="invite-code-wrapper">
                <img src="../assets/main/invite_title.png" class="invite-head" alt="">
                <div class="invite-code-box">
                    <img src="../assets/main/invite_code_bg.png" class="invite-code-bg" alt="">
                    <!-- <img src="" class="invite-code" alt=""> -->
                </div>
                <div class="invite-des-box">
                    <p style="font-size: 0.32rem;color: white;">成功邀请好友预约，达到对应人数领取预约礼包</p>
                    <img src="../assets/main/invite_des_line1.png" class="invite-des-line" alt="">
                    <img src="../assets/main/invite_des_line2.png" class="invite-des-line" alt="">
                    <img src="../assets/main/invite_des_line3.png" class="invite-des-line" alt="">
                </div>
            </div>
        </step-cover>
        <audio id="bgMusic" ref="bgMusic" :src="bgMusicUrl" loop autoplay preload="auto"></audio>
    </div>

</template>

<script>
    import stepCover from '@/components/stepCover.vue'
    import dialogBox from '@/components/dialog.vue'
    import stories from '../common/stories.js';

    function isIPhoneX(fn) {
        let {
            clientWidth,
            clientHeight
        } = document.documentElement
        var u = navigator.userAgent;

        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return (isIOS && clientHeight == 812 && clientWidth == 375)
    }

    function isPhoneNumer(p) {
        return /^1[3456789]\d{9}$/.test(String(p).trim())
    }

    export default {
        name: 'car',
        components: {
            stepCover,
            dialogBox
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
        },

        watch: {
            show(nv) {
                if (nv) {
                    this.init()
                }
            }
        },

        data() {
            return {
                showBox: false,
                adapterX: 0,
                adapterY: 0,
                step: 0,
                dg_humans: [],
                dg_ls: [],
                showTip: false,
                showBook: false,
                openBook: false,
                startStory: false,
                storyEnded: false,
                submitEnded: false,
                showCode: false,
                introEnded: false,
                doorOpen: false,
                showDoor: false,
                totast: '',
                dialogues: [],
                phoneNumber: '',
                code: '',
                bgMusic: null,
                bgMusicUrl: ''
            }
        },

        created() {
            this.showBox = !!this.show
            this.apdaterCover()
            window.addEventListener('resize', this.apdaterCover);
        },

        methods: {
            init() {
                this.openDoor()
                this.initMusic()
            },

            initMusic() {
                // 背景音乐浏览器兼容(移动端微信和safari无法自动播放)
                if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    return
                }
                this.bgMusic = this.$refs.bgMusic
            },

            playBgMusic() {
                console.log('播放音乐')
                this.bgMusicUrl = require('../assets/audio/bg_music.wav')
                this.bgMusic && this.bgMusic.play()
            },

            pauseBgMusic() {
                console.log('暂停播放音乐')
                this.bgMusic && this.bgMusic.pause()
            },

            stopBgMusic() {
                console.log('停止播放音乐')
                this.bgMusic && this.bgMusic.stop()
            },

            onIntroTransEnd() {
                this.introEnded = true
            },

            onDoor1TransEnd() {
                // if (this.doorOpen) {
                //     this.doorOpen = false
                // }
            },

            onDoor2TransEnd() {
                if (this.doorOpen) {
                    this.doorOpen = false
                    setTimeout(() => {
                        this.showDoor = false
                        this.playBgMusic()
                    }, 4600);
                }
            },

            toSummaryInfo() {
                if (this.introEnded) {
                    this.submitEnded = false
                    this.showCode = true
                }
            },

            openDoor() {
                this.showBox = true
                this.showDoor = true
                setTimeout(() => {
                    this.doorOpen = true
                }, 300);
            },

            onStepChange(s) {
                this.step = s
            },

            onDialogEnded() {
                this.step = 0
                this.openBook = false
                this.startStory = false
                this.storyEnded = true
                this.$emit('storyEnded')
            },

            nextStep() {
                this.step++
            },

            toggleTip() {
                if (!this.showTip) {
                    this.dg_ls = [require('../assets/main/d3.png')]
                    this.dg_humans = [require('../assets/main/captain.png')]
                }
                this.showTip = !this.showTip
            },

            startRole1() {
                this.dialogues = stories.getAll(1)
                this.dg_humans = [require('../assets/main/story/role1.png')]
                this.startStory = true
            },

            startRole2() {
                this.dialogues = stories.getAll(2)
                this.dg_humans = [require('../assets/main/story/role2.png')]
                this.startStory = true
            },

            startRole3() {
                this.dialogues = stories.getAll(3)
                this.dg_humans = [require('../assets/main/story/role3.png')]
                this.startStory = true
            },

            startRole4() {
                this.dialogues = stories.getAll(4)
                this.dg_humans = [require('../assets/main/story/role4.png')]
                this.startStory = true
            },

            toggleBook() {
                this.showBook = !this.showBook
                if (this.showBook) {
                    this.toOpenBook()
                }
            },

            toOpenBook() {
                setTimeout(() => {
                    this.openBook = true
                    setTimeout(() => {
                        this.toggleBook()
                        this.startRole1()
                    }, 1000);
                }, 1000)
            },

            tapWorm() {
                this.startRole2()
            },

            tapScroll() {
                this.startRole3()
            },

            tapJars() {
                this.startRole4()
            },

            getCode() {
                if (!this.phoneNumber) {
                    return this.totast = '请输入电话号码'
                }

                if (!isPhoneNumer(this.phoneNumber)) {
                    return this.totast = '电话号码格式不对'
                }
                this.totast = '验证码已发送'
            },

            onSubmit() {
                if (!this.phoneNumber || !this.code) {
                    return this.totast = !this.phoneNumber ? '请输入电话号码' : !this.code ? '请输入验证码' : ''
                }

                if (!isPhoneNumer(this.phoneNumber)) {
                    return this.totast = '电话号码格式不对'
                }
                this.submitEnded = true
                this.storyEnded = false
            },

            openBookDown() {
                this.openBook = false
            },

            hideTotast() {
                this.totast = ''
            },

            onToastHide() {
                this.totast = ''
            },

            onInputPhoneNumber(e) {
                this.phoneNumber = e.currentTarget.value
            },

            onInputPhoneCode(e) {
                this.code = e.currentTarget.value
            },

            apdaterCover() {
                // 适配浮层物件位置
                let {
                    clientWidth,
                    clientHeight
                } = document.documentElement
                if (clientHeight >= 812) {
                    this.adapterY = (clientHeight * 0.4 + 15) + 'px'

                } else if (clientHeight >= 667) {
                    this.adapterY = clientHeight * 0.4 + 'px'

                } else {
                    this.adapterY = clientHeight * 0.4 - 16 + 'px'
                }
            }
        }
    }
</script>

<style lang='scss'>
    .totast-body {
        background-color: rgba(0, 0, 0, 0.72);
        padding: .2rem;
        border-radius: .16rem;
        color: white;
        font-size: .28rem;
        max-width: 3rem;
    }

    .fall-curtain-view {
        position: relative;
        height: 10rem;
        width: 6.8rem;
        padding: 0 .5rem;
        overflow: hidden;

        .curtain-show {
            bottom: 35% !important;
            transition: bottom 14s ease-in;
        }

        .fall-curtain-body {
            position: absolute;
            left: 0;
            bottom: -56%;
            width: 100%;
            font-size: .32rem;
            color: white;
            text-align: center;
            line-height: .8rem;
        }
    }

    .car-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 500;
        width: 100%;
        height: 100%;

        .cover-adapter {
            position: absolute;
            width: 100%;
            height: 200px;
            top: 50%;
            left: 0;
            /* background-color: yellow; */
        }

        .invite-code-wrapper {
            width: 6.8rem;
            height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .invite-head {
                width: 80%;
                height: .8rem;
            }

            .invite-code-box {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 8rem;
                width: 100%;
                /* background-color: yellow; */

                .invite-code-bg {
                    width: 4.8rem;
                    height: 4.6rem;
                }
            }

            .invite-des-box {
                height: 8.6rem;
                width: 100%;

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;

                .invite-des-line {
                    /* width: 6rem; */
                    max-width: 6.5rem;
                    height: 1.4rem;
                }
            }
        }

        .submit-box {
            background: url('../assets/main/submit_bg.png') no-repeat;
            background-size: 100% 100%;
            width: 6.8rem;
            height: 6.8rem;
            position: relative;

            .platform-line {
                position: absolute;
                top: 2rem;
                left: 1.68rem;
                width: 50%;

                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;

                .platform-btn {
                    width: 1.48rem;
                    height: 0.48rem;
                }
            }

            .submit-input-area {
                position: absolute;
                top: 2.62rem;
                left: 1.68rem;
                width: 48.5%;
                height: 1.5rem;
                padding: .12rem .1rem;

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;

                .input-item {
                    font-size: .28rem;
                    width: 100%;
                    height: .5rem;
                    padding: 0 .1rem;
                    background-color: transparent;
                }
            }

            .submit-ops-btn {
                position: absolute;
                top: 4.22rem;
                left: 1.68rem;
                width: 48.5%;
                padding-left: .06rem;

                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                .getcode-btn {
                    flex-shrink: 0;
                    width: 1.7rem;
                    height: .6rem;
                }

                .submit-btn {
                    width: 1.4rem;
                    height: .6rem;
                }

            }
        }

        .car-inside {
            position: relative;
            opacity: 0;
        }

        .book-close,
        .book-open {
            position: absolute;
            opacity: 0;
            z-index: 1;
            left: 5%;
            top: 50%;
            transform: translate(0, -50%);
            width: 95%;
            height: 54%;
            transition: opacity .8s ease-out;
        }

        .book-close {
            z-index: 1;
        }

        .book-open {
            z-index: 2;
        }

        .book-show {
            z-index: 3;
            opacity: 1 !important;
        }


        .book-hide {
            opacity: 0 !important;
        }

        .car-bg-show {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 1 !important;
            z-index: 99;
            transition: opacity 1s ease-out;
        }

        .car-bg,
        .car-inside {
            width: 100%;
            height: 100%;
        }

        @keyframes object {

            0%,
            100% {
                opacity: 0.68;
            }

            50% {
                opacity: 1;
            }
        }

        .car-book,
        .car-scroll,
        .car-jars,
        .car-worm {
            position: absolute;
            z-index: 10;
            animation: object 2s ease-in-out infinite;
        }

        .car-horn {
            position: absolute;
            width: .5rem;
            height: .5rem;
            right: 95px;
            bottom: 130%;
        }

        .car-book {
            width: .68rem;
            height: .72rem;
            right: 5px;
            bottom: 48%;
        }

        .car-jars {
            width: .84rem;
            height: .84rem;
            right: 35px;
            bottom: 52%;
        }

        .car-worm {
            width: .72rem;
            height: .72rem;
            left: .08rem;
            bottom: 21%;
        }

        .car-scroll {
            width: .74rem;
            height: .84rem;
            right: 1.88rem;
            bottom: 55%;
        }

        .car-bg-in {
            opacity: 1;
            transition: opacity 0.8s ease-out 4s;
        }

        .door-show {
            z-index: 501 !important;
        }

        .door-hide {
            z-index: -100 !important;
        }

        .car-door {
            position: absolute;
            /* left: 100%; */
            left: 0;
            top: 0;
            z-index: 501;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;

            .door {
                position: absolute;
                top: 0;
                left: 100%;
                width: 100%;
                height: 100%;
            }

            @keyframes door1In {
                0% {
                    left: 100%;
                }

                50% {
                    left: 0;
                }

                100% {
                    left: -100%;
                }
            }

            .door-1-in {
                left: 50% !important;
                transition: left 1.32s ease-in-out;
            }

            .door-2-in {
                left: 0 !important;
                transition: left 1.2s ease-in-out 1.32s;
            }

            .door-1-out {
                left: 100% !important;
                transition: left 1.4s ease-in-out 1s;
            }

            .door-2-out {
                left: 100% !important;
                transition: left 1.4s ease-in-out 2s;
            }

            .door-1 {
                z-index: 2;
                left: 100%;
                /* animation: door1In 3s cubic-bezier(0.75, 0.2, 0.25, 0.85); */
            }

            .door-2 {
                z-index: 1;
            }
        }
    }
</style>