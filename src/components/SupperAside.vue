<template>
    <div class="menu">
        <el-menu
                :style="contentHeight"
                class="el-menu-vertical-demo"
                background-color="#000033"
                text-color="#fff"
                active-text-color="#FFCC00"
                :default-active="this.$route.path"
                router>
            <el-menu-item index="/adminManage">
                <i class="el-icon-s-custom"></i>
                <span slot="title">管理员信息</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>系统备份</span>
                </template>
                <el-menu-item>
                    <el-button type="text" @click="backup" style="color: white">系统备份</el-button>
                </el-menu-item>
                <el-menu-item>
                    <el-button type="text" @click="restore" style="color: white">系统恢复</el-button>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import {dateFunction} from "../utils/dateUtil";

    export default {
        name: "SupperAside",
        data(){
            return{
                contentHeight:{
                    height:document.body.clientHeight-65+'px'
                }
            }
        },
        methods:{
            async backup() {
                const res = await this.$http.get('/backup')
                if(res.data.code==='200'){
                    let time=dateFunction(res.data.result)
                    this.$alert(time+' 系统备份成功', '系统备份', {
                        confirmButtonText: '确定'
                    });
                }
            },
            async restore() {
                const res = await this.$http.get('/restore')
                if(res.data.code==='200'){
                    let time=dateFunction(res.data.result)
                    this.$alert('系统恢复至 '+time, '系统恢复', {
                        confirmButtonText: '确定'
                    });
                }
            }
        }
    }
</script>

<style scoped lang="less">

    .el-menu{
        padding-top: 10px;
        width: 240px
    }

    /deep/
    .el-submenu__icon-arrow{
        display: none;
    }
</style>
