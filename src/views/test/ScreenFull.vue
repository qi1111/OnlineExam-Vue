<template>
    <div class="container">
        111
    </div>
</template>

<script>
    import screenfull from 'screenfull'
    export default {
        name: "ScreenFull",
        data(){
            return{
                isFullscreen: false
            }
        },
        mounted() {
            this.screenFull()
            window.onresize = ()=> {
                this.checkFull()
            }
        },
        methods:{
            screenFull(){
                if (!screenfull.isEnabled) {
                    this.$message({
                        message: '不支持全屏',
                        type: 'warning'
                    })
                    return false
                }
                screenfull.toggle().catch((e) => {})
                this.isFullscreen = true
            },
            checkFull(){
                //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
                //火狐浏览器
                let isFull = document.mozFullScreen ||
                    document.fullScreen ||
                    //谷歌浏览器及Webkit内核浏览器
                    document.webkitIsFullScreen ||
                    document.webkitRequestFullScreen ||
                    document.mozRequestFullScreen ||
                    document.msFullscreenEnabled;
                if(!isFull) {
                    this.$confirm('是否要退出全屏模式，退出后将无法继续考试?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.isFullscreen=false
                    }).catch(() => {
                        screenfull.toggle()
                    });
                }
            },
        }
    }
</script>

<style scoped>

</style>
