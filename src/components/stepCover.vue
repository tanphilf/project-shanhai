<template>
    <div @click="onClick" :style="{backgroundColor: 'rgba(0,0,0,'+box_opacity+')'}"
        :class="['step-cover-wrapper', showBox?'cover-show':'cover-hide', center?'step-cover-center':'']">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            show: {
                type: Boolean,
                default: false
            },
            opacity: {
                type: [String, Number],
                default: function () {
                    return 0.84
                }
            },
            autoHide: {
                type: Boolean,
                default: false
            },
            center: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            show(nv) {
                this.onChange(nv)
            },
            opacity(o) {
                this.box_opacity = o
            }
        },
        data() {
            return {
                showBox: false,
                hideBox: false,
                box_opacity: 0.84
            }
        },

        created() {
            this.box_opacity = this.opacity
        },

        methods: {
            onClick(e) {
                this.$emit('click', e)
            },

            onChange(ifShow) {
                this.showBox = ifShow
                
                if (!ifShow) {
                    setTimeout(() => {
                        this.hideBox = true
                    }, 1000);
                }

                if (this.autoHide && ifShow) {
                    setTimeout(() => {
                        this.showBox = false
                        this.$emit('hide')

                    }, 1800);
                }
            }
        }
    }
</script>

<style lang='scss'>
    .step-cover-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        background-color: rgba($color: black, $alpha: 0.86);
        transition: opacity ease-in-out .8s;
    }

    .cover-show {
        z-index: 999;
        opacity: 1;
    }

    .cover-hide {
        opacity: 0;
        z-index: -100;
    }

    .step-cover-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

</style>