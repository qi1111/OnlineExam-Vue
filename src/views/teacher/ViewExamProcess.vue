<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{path:'/examMange'}">考试管理</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{path:'/examResult?examId='+this.examId}">考试详情</el-breadcrumb-item>
                        <el-breadcrumb-item>考试过程</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="image">
                        <el-image
                                v-for="(item,index) in imageList"
                                style="width: 100px; height: 100px;margin-left: 10px"
                                :src="item.processUrl"
                                :fit="fill"
                                :key="index"></el-image>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    export default {
        name: "ViewExamProcess",
        components: {TchAside, TchHeader},
        data(){
            return{
                userName:'',
                examId:'',
                stuId:'',
                imageList:[]
            }
        },
        created() {
            this.getParams()
            this.getData()
        },
        methods:{
            getParams(){
                this.userName=this.$route.query.userName
                this.examId=this.$route.query.examId
                this.stuId=this.$route.query.stuId
            },
            async getData() {
                const res = await this.$http.get('/getStuExamProcess',{
                    params:{
                        examId:this.examId,
                        stuId:this.stuId
                    }
                })
                if(res.data.code==='200'){
                    this.imageList=res.data.result
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .el-header{
        padding: 0;
    }

    .el-main{
        margin-top: 5px;
    }

    .el-divider{
        width: 100%;
        margin-top: 10px;
    }
</style>
