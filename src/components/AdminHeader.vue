<template>
    <div class="headers">
        <el-row :gutter="20">
            <el-col :span="16"><div class="grid-content bg-purple" style="padding: 0">
                <div class="logo"></div>
                <span class="tips">在线考试系统</span>
            </div></el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple" style="padding: 0">
                    <img src="../assets/images/teacher_man.png" class="avatar">
                    <span class="welcome">{{name}}</span>
                    <el-button icon="el-icon-switch-button" size="mini" class="switch" @click="exit">退出</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "AdminHeader",
        data() {
            return {
                name: sessionStorage.getItem("name")
            }
        },
        methods:{
            async exit() {
                let res = await this.$http.get('/logout')
                if(res.data.code==='200'){
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .el-row{
        width: 100%;
    }
    .headers{
        background-color: #330000
    }
    .bg-purple {
        background:#330000
    }
    .grid-content {
        min-height: 55px;
        line-height: 55px;
    }

    .tips{
        font-size: 20px;
        color: lightskyblue;
        font-family: 华文楷体;
        font-weight: bolder;
    }

    .logo{
        height: 55px;
        width: 50px;
        background: url("../assets/images/tch_logo.png");
        background-size: 100% 100%;
        margin-left: 20px;
        float: left;
    }
    .welcome{
        color: white;
        font-size: 12px;
        margin-left: 10px;
    }
    .switch{
        background-color:#330000;
        border:#330000;
        color: #dd6161;
        margin-left: 10px;
        margin-top: 5px;
    }

    .avatar{
        width: 35px;
        height: 35px;
        margin-top: 12px;
        margin-left: 240px;
        float: left;
    }

</style>
