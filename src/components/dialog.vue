<template>
    <div class="dialog-wrapper" @click="handleNext">
        <div v-if="!dialogues.length" class="single-dialogue">
            <img v-if="human && human.length"
                :src="human"
                :style="{left: humanLeft, bottom: humanBottom, width: humanWidth, height: humanHeight }"
                class="dialog-human" alt="">
            <img :src="list[d_step]" :style="{width, height,left, top, right, bottom }" class="dialog-item"
                :class="center?'center': [['align-x-left', 'align-x-top', 'align-x-right', 'align-x-bottom'][positionX], ['align-y-left', 'align-y-top', 'align-y-right', 'align-y-bottom'][positionY]]"
                alt="">
        </div>

        <div v-if="dialogues.length" class="dialogues" :style="{bottom}">
            <img v-if="human && human.length" :src="human"
                :style="{left: humanLeft, bottom: humanBottom, width: humanWidth, height: humanHeight }"
                class="dialog-human" alt="">
            <div :class="['dialog-foreground', changeStep?'step-change':'step-reset']" :style="{height: dgBgHeight }">
                <!-- <img src="../assets/main/dialog_empty.png" class="dialog-empty-card" alt=""> -->
                <p class="dialogues-words">{{singleWords||dialogues[d_step]||''}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            list: {
                type: Array,
                default: function () {
                    return []
                }
            },

            human: {
                type: [Object, String, Array],
                default: function () {
                    return null
                }
            },

            dialogues: {
                type: [Array],
                default: function () {
                    return []
                }
            },

            autoChange: {
                type: Boolean,
                default: false
            },

            // 单条对话内容
            words: {
                type: String,
                default: ''
            },

            step: {
                type: Number,
                default: 0
            },

            positionX: {
                type: [Number, String],
                default: 0
            },

            positionY: {
                type: [Number, String],
                default: 0
            },

            center: {
                type: Boolean,
                default: false
            },

            humanLeft: {
                type: [Object, String],
                default: function () {
                    return '5%'
                }
            },

            humanBottom: {
                type: [Object, String],
                default: function () {
                    return '12%'
                }
            },

            humanWidth: {
                type: [Object, String],
                default: function () {
                    return '5rem'
                }
            },

            humanHeight: {
                type: [Object, String],
                default: function () {
                    return '5rem'
                }
            },

            left: {
                type: [Object, String],
                default: function () {
                    return '5%'
                }
            },
            top: {
                type: [Object, String],
                default: function () {
                    return ''
                }
            },
            right: {
                type: [Object, String],
                default: function () {
                    return ''
                }
            },
            bottom: {
                type: [Object, String],
                default: function () {
                    return ''
                }
            },

            width: {
                type: [Object, String],
                default: function () {
                    return '90%'
                }
            },
            height: {
                type: [Object, String],
                default: function () {
                    return '80px'
                }
            }
        },

        watch: {
            step(s) {
                this.d_step = s
                this.fitDialogueBgSize()
            },

            words(w) {
                this.singleWords = w
            },
            autoChange(c) {
                if (c) {
                    this.startAutoChange()
                }
            },
        },
        data() {
            return {
                d_step: 0,
                changeStep: false,
                singleWords: '',
                dgBgHeight: '1.4rem',
                autoChanged: false,
                stepEnded: false,
                changeTimer: null
            }
        },

        created() {
            this.d_step = this.step
            this.singleWords = this.words
            this.fitDialogueBgSize()
        },

        methods: {
            startAutoChange() {
                // console.log('自动切换')
                this.changeTimer = setInterval(() => {
                    this.autoChanged = true
                    this.onNext();
                    if (this.stepEnded) {
                        clearInterval(this.changeTimer)
                    }
                }, 3200);
            },

            pauseAutoChange() {
                clearInterval(this.changeTimer)
            },

            fitDialogueBgSize() {
                let ls = this.dialogues.length ? this.dialogues : this.list
                let wlen = ls[this.d_step] ? ls[this.d_step].length : 16
                let line = (parseInt(wlen / 16) + (wlen % 16 > 0 ? 1 : 0))
                line = line > 1 ? line : 1
                this.dgBgHeight = line * 0.5 + 1.4 + 'rem'
            },

            handleNext() {
                // this.pauseAutoChange()
                this.onNext(true)
                // setTimeout(() => {
                //     if (!this.stepEnded) {
                //         this.startAutoChange()
                //     }
                // }, 1200);
            },

            onNext(touched = false) {
                if (touched && this.autoChanged) {
                    console.log('正在自动切换')
                    return
                }

                let ls = this.dialogues.length ? this.dialogues : this.list
                if (this.d_step < ls.length - 1) {
                    this.changeStep = true
                    this.d_step++
                    this.fitDialogueBgSize()
                    this.$emit('stepChange', this.d_step)
                    setTimeout(() => {
                        this.changeStep = false
                    }, 1200);

                } else {
                    this.stepEnded = true
                    this.$emit('ended')
                }
                this.autoChanged = false
                this.touched = false
            }
        }
    }
</script>

<style lang='scss'>
    .dialog-wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 100000;
        /* background-color: rgba($color: black, $alpha: 0.84); */

        .dialogues {
            position: absolute;
            left: 2%;
            bottom: 10% !important;
            min-height: 5rem;
            width: 96%;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            /* background-color: rgba(0,0,0,0.5); */

            .dialog-human {
                position: absolute;
                z-index: 0;
                left: 0 !important;
                width: 7.2rem !important;
                height: 11rem !important;
                bottom: -1.32rem !important;
            }

            @keyframes stepChange {
                0% {
                    opacity: 0;
                }

                100% {
                    opacity: 1;
                }
            }

            .step-change {
                opacity: 1;
                /* transition: opacity 1.2s ease-out; */
                /* animation: stepChange .8s ease-in-out; */
            }

            .step-reset {
                /* opacity: 0;
                transition: opacity .32s ease-in; */
            }

            .dialog-foreground {
                position: absolute;
                z-index: 10;
                width: 100%;
                top: 80%;
                transform: translate(0, -50%);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-image: url("../assets/main/dialog_empty.png");

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .dialog-empty-card {
                    width: 100%;
                    height: 100%;
                }

                .dialogues-words {
                    display: block;
                    /* position: absolute; */
                    padding: 0 0.64rem;
                    /* top: .54rem; */
                    font-size: .34rem;
                    font-weight: bold;
                    width: 100%;
                }
            }

        }

        .single-dialogue {
            .dialog-human {
                position: absolute;
                width: 5rem;
                height: 5rem;
            }

            .dialog-item {
                position: absolute;
            }
        }

        .center {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .align-x-left {
            left: 0;
        }

        .align-x-top {
            top: 0;
        }

        .align-x-right {
            right: 0;
        }

        .align-x-bottom {
            bottom: 0;
        }

        .align-y-left {
            left: 0;
        }

        .align-y-top {
            top: 0;
        }

        .align-y-right {
            right: 0;
        }

        .align-y-bottom {
            bottom: 0;
        }
    }
</style>