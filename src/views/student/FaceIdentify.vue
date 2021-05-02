<template>
    <div class="faceIdentify" v-loading="loading">
        <div class="warn">
            <span v-if="isprompting">{{prompting}}</span>
            <span v-if="iswarning">{{warning}}</span>
        </div>
            <video
                    id="video"
                    :width="videoWidth"
                    :height="videoHeight"
                    preload
                    autoplay
                    loop
                    muted
            ></video>
            <canvas id="canvas" :width="videoWidth" :height="videoHeight"></canvas>
        <div class="buttonDiv">
                <el-button icon="el-icon-camera-solid" type="primary" @click="takePhoto">开始进行人脸验证</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FaceIdentify",
        data(){
            return{
                videoWidth:480,
                videoHeight:320,
                video:'',
                canvas:'',
                context:'',
                loading: false,
                prompting:'请保持人脸正面居中验证',
                warning:'请确保为学生本人验证',
                isprompting:false,
                iswarning:false,
                islogin:true
            }
        },
        created() {
            this.islogin=this.$store.getters.getIsLogin
            this.judge()
            this.getCompetence()
        },
        methods: {
            judge(){
                // 判断有无摄像头,推荐放在created里
                var deviceList = [];
                navigator.mediaDevices
                    .enumerateDevices()
                    .then(devices => {
                        devices.forEach(device => {
                            deviceList.push(device.kind);
                        });
                        if (deviceList.indexOf("videoinput") == "-1") {
                            this.$message.error("请打开摄像头")
                            return false;
                        } else {
                            this.videoinput = true; // 这是我自定义的一个状态，初始值为false
                        }
                    })
                    .catch(function(err) {
                        alert(err.name + ": " + err.message);
                    });
            },
            //初始化摄像头 获取摄像头权限
            getCompetence() {
                let self = this;
                navigator.getUserMedia  = navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia;
                if (navigator.getUserMedia) {
                    //调用用户媒体设备, 访问摄像头
                    navigator.getUserMedia({video : {width: this.videoWidth, height: this.videoHeight}},function(stream) {
                        var video = document.querySelector('video');
                        video.srcObject = stream;
                        self.streamPicture = stream; //关闭摄像头需要用
                        video.onloadedmetadata = function(e) {
                            video.play();
                        };
                    }, function(err) {
                        console.log("访问用户媒体设备失败: " + err.name);
                    })
                } else {
                    self.$message.error('不支持访问用户媒体');
                }
            },

            takePhoto(){
                this.canvas = document.getElementById('canvas');
                this.context = this.canvas.getContext('2d');
                this.video=document.getElementById('video')
                this.context.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

                //停止摄像头
                this.loading=true
                this.handleFaceIdentify()
            },
            handleFaceIdentify() {
                this.canvas.toBlob(async (blob)=> {
                    var formData = new FormData();
                    formData.append('file', blob);
                    const res=await this.$http.post('/faceSearch',formData,{
                        headers: {
                            "content-type": "multipart/form-data",
                            "Authorization": this.$store.state.token
                        }
                    })
                    if(res.data.code==='200'){
                        let result=JSON.parse(res.data.result)
                        let username=sessionStorage.getItem('userName')
                        if(result.result===null){
                            this.closeCompetence()
                            this.loading=false
                            this.iswarning=false
                            this.isprompting=true
                            this.context.clearRect(0, 0, this.videoWidth, this.videoHeight)
                            this.getCompetence()
                        } else if(result.result.user_list[0].score<80 || result.result.user_list[0].user_id!==username){
                            this.loading=false
                            this.isprompting=false
                            this.iswarning=true
                            this.context.clearRect(0, 0, this.videoWidth, this.videoHeight)
                            this.getCompetence()
                        } else if(this.islogin){
                            this.loading=false
                            this.closeCompetence()
                            await this.$router.push('/myExam')
                        }else if(!this.islogin){
                            this.loading=false
                            this.closeCompetence()
                            await this.$router.push('/examination')
                        }
                    }
                })
            },
            closeCompetence(){
                this.video.srcObject.getTracks()[0].stop()
            }
        }

    }
</script>

<style scoped lang="less">

    /*.video{
        text-align: center;
    }*/
    .faceIdentify{
        text-align: center;

        height: 60vh;
        width: 100%;
        position: relative;
        >* {
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
        }
        .warn{
            top:0;
            font-size: 18px;
        }
        video,canvas{
            top:20px;
        }
        .buttonDiv {
            bottom: 10px;
        }
    }

</style>
