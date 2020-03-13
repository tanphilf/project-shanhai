<template>
    <div class="main-scene-wrapper">
        <div class="main-view" :style="{transform: 'translateX('+viewX+')'}">
            <img :src="bgImg" style="z-index: 1;" class="main-bg" alt="">
            <img src="../assets/main/fog1.png" :class="['fog-1', start_car?'fog1-enter':'']" alt="">
            <img src="../assets/main/fog2.png" :class="['fog-2', start_car?'fog2-enter':'']" alt="">
            <img src="../assets/main/scene_car.png" :style="{zIndex: 3, right: start_car?car_x+'%':'', marginTop: carTop}" class="main-car" alt="">
            <img :src="floorImg" style="z-index: 4;" class="main-floor" alt="">
            <img :src="objectsImg" style="z-index: 5;" class="main-objects" alt="">
        </div>

        <!-- <div @click="startTest" style="color: white;position: fixed;top: 20px;right: 50px;background-color: rgba(0,0,0,0.84);">开始测试</div> -->

        <!-- <div class="ops">
            <div @click="onMove(1)" class="ops-btn">左</div>
            <div id="alpha">{{alpha}}</div>
            <div id="beta">{{beta}}</div>
            <div id="gamma">{{gamma}}</div>
            <div @click="onMove(2)" class="ops-btn">右</div>
        </div> -->
    </div>
</template>

<script>
    function isIPhoneX(fn) {
        let {
            clientWidth,
            clientHeight
        } = document.documentElement
        var u = navigator.userAgent;

        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return (isIOS && clientHeight == 812 && clientWidth == 375)
    }

    export default {
        name: '',
        props: {
            startCar: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            startCar(nv) {
                this.start_car = nv
                if (nv) {
                    this.carStart()
                }
            }
        },

        data() {
            return {
                viewX: '-180px',
                car_x: 5,
                start_car: false,
                carTop: '',
                vd: 0,
                alpha: 0,
                beta: 0,
                gamma: 0,
                bgImg: require('../assets/main/scene_bg.jpg'),
                floorImg: require('../assets/main/scene_floor.png'),
                objectsImg: require('../assets/main/scene_objects.png')
            }
        },

        beforeCreate() {
            try {
                if (window.DeviceOrientationEvent) {
                    // console.log('支持罗盘感应')
                    // var a = document.getElementById('alpha'),
                    //     b = document.getElementById('beta'),
                    //     g = document.getElementById('gamma');

                    window.addEventListener('deviceorientation', (event) => {
                        // alert('罗盘感应')
                        let { alpha, beta, gamma } = event;
                        alpha = Math.abs(alpha) > 45 ? (alpha / Math.abs(alpha)) * 45 : alpha
                        this.viewX = -180 - (alpha / 45) * 180 + 'px'

                        this.alpha = alpha
                        this.beta = beta
                        this.gamma = gamma

                    }, false);

                } else {
                    console.log('不支持罗盘感应')
                }
                // if (window.DeviceMotionEvent) {
                //     console.log('支持运动传感器感应')
                //     let x, y, z, lastX, lastY, lastZ, speed = 30;
                //     x = y = z = lastX = lastY = lastZ = 0;
                //     window.addEventListener('devicemotion', (e) => {
                //         alert('运动传感器感应')
                //         let d = e.accelerationIncludingGravity

                //         this.alpha = d.x
                //         this.beta = d.y
                //         this.gamma = d.z
                //         if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed || Math.abs(z - lastZ) > speed) {
                //             alert('触发了重力感应');
                //         }
                //         lastX = d.x;
                //         lastY = d.y;
                //         lastZ = d.z;
                //     })
                // } else {
                //     console.log('不支持运动传感器感应')
                // }
            } catch (e) {
                alert(e)
            }
        },

        created() {
            // this.startTest()

            this.carStart()
            this.adapterPhone()

        },

        methods: {
            adapterPhone() {
                let {
                    clientWidth,
                    clientHeight
                } = document.documentElement
                if (clientHeight >= 812) {
                    this.carTop = '1.4rem'

                } else if (clientHeight >= 667) {
                    this.carTop = '0.2rem'

                } else if (clientHeight >= 568) {
                    this.carTop = '-0.36rem'

                } else {

                }
            },

            startTest() {
                this.start_car = true
                this.carStart()
            },

            carStart() {
                setTimeout(() => {
                    console.log('火车启动')
                    this.car_x = -100
                    setTimeout(() => {
                        this.$emit('carEnter')
                    }, 1000);
                }, 4000);
            },

            onMove(type) {
                let vx = this.viewX
                if (type == 1) {
                    vx = parseInt(this.viewX) - 10
                    this.vd = 0
                    // console.log('视野左移', vx)
                } else if (type == 2) {
                    vx = parseInt(this.viewX) + 10
                    this.vd = 1
                    // console.log('视野右移', vx)
                }

                let max = !this.vd && document.documentElement.clientWidth<=568 ? -300 : -360
                if ((this.vd && vx >=0) || (!this.vd && vx <= max)) {
                    console.log('屏幕溢出',vx)

                } else {
                    this.viewX = vx + 'px'
                }
            }
        }
    }
</script>

<style lang='scss'>
    .ops {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        color: white;

        .ops-btn {
            text-align: center;
            line-height: 72px;
            width: 120px;
            height: 72px;
            background: rgba($color: black, $alpha: 0.64);
            color: white;
        }
    }

    .main-scene-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        /* width: 100%; */
        width: 14.76rem;
        height: 100%;
        overflow: hidden;
        /* overflow-x: scroll; */

        .main-bg,
        .main-floor,
        .main-car,
        .main-objects {
            position: absolute;
        }

        .main-view {
            position: relative;
            width: 7.5rem;
            height: 100%;
            left: 0;

            /* overflow-x: scroll; */
            /* overflow-y: hidden; */
            
            transition: transform .12s ease-out;
        }

        .main-bg {
            width: 14.76rem;
            height: 100%;
            left: 0;
            top: 0;
            /* background-repeat: no-repeat;
            background-size: cover;
            background: url(../assets/main/scene_bg.png); */
        }


        .main-car {
            width: 800px;
            height: 320px;
            right: -300%;
            top: 25%;
            transform: rotateZ(2deg);
            transition: right 3.6s ease-in-out;
        }

        .main-objects {
            width: 14.76rem;
            height: 100%;
            left: 0;
            top: 0;
        }

        .main-floor {
            left: 0;
            width: 14.76rem;
            height: 100%;
        }

        /* @keyframes fog1 {
            0%, 100% {
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
        } */

        .fog1-enter {
            left: 0 !important;
            opacity: 1 !important;
            transition: all 2s ease-in;
        }

        @keyframes fogAnima {

            0%,
            100% {
                /* transform: rotateZ(30deg); */
                opacity: 1;
            }

            50% {
                /* transform: rotateZ(0deg); */
                opacity: 0;
            }
        }

        .fog2-enter {
            left: 0 !important;
            opacity: 1 !important;
            transition: all 2s ease-in;
            /* animation: fogAnima 2.4s ease-in-out infinite; */
        }

        .fog-1,
        .fog-2 {
            opacity: 0;
        }

        .fog-1 {
            position: absolute;
            z-index: 1;
            left: 200px;
            top: -50px;
            width: 130%;
            height: 100%;
            /* animation: fog1 2s ease-in-out infinite; */
        }

        .fog-2 {
            position: absolute;
            z-index: 1;
            left: -100px;
            top: 180px;
            width: 15rem;
            height: 5rem;
        }
    }
</style>