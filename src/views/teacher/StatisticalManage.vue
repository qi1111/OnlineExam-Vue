<template>
    <div class="container">
        <el-container>
            <el-header style="height: 55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                    <el-breadcrumb-item>统计管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="baseInfo">
                        <el-card class="paper">
                            <div slot="header" class="clearfix">
                                <span>试卷统计</span>
                            </div>
                            <el-avatar icon="el-icon-document" style="background-color: #a0cfff;width: 40px;height: 40px;float: left"></el-avatar>
                            <div class="num">
                                <p style="font-size: 20px;color: cornflowerblue">{{info.paper}}</p>
                                <el-divider style="width: 200px;color: #8c939d;padding: 0"></el-divider>
                                <p style="font-size: 10px;margin-top: -20px;color: #333333">试卷份数</p>
                            </div>
                        </el-card>
                        <el-card class="exam">
                            <div slot="header" class="clearfix">
                                <span>考试统计</span>
                            </div>
                            <el-avatar icon="el-icon-tickets" style="background-color: #330000;width: 40px;height: 40px;float: left"></el-avatar>
                            <div class="num">
                                <p style="font-size: 20px;color: #a4da89">{{info.exam}}</p>
                                <el-divider style="width: 200px;color: #8c939d;padding: 0"></el-divider>
                                <p style="font-size: 10px;margin-top: -20px;color: #333333">考试次数</p>
                            </div>
                        </el-card>
                        <el-card class="classes">
                            <div slot="header" class="clearfix">
                                <span>班级统计</span>
                            </div>
                            <el-avatar icon="el-icon-s-home" style="background-color: #8c939d;width: 40px;height: 40px;float: left"></el-avatar>
                            <div class="num">
                                <p style="font-size: 20px;color: #cf9236">{{info.classes}}</p>
                                <el-divider style="width: 200px;color: #8c939d;padding: 0"></el-divider>
                                <p style="font-size: 10px;margin-top: -20px;color: #333333">班级人数</p>
                            </div>
                        </el-card>
                        <el-card class="student">
                            <div slot="header" class="clearfix">
                                <span>学生统计</span>
                            </div>
                            <el-avatar icon="el-icon-user" style="background-color: slateblue;width: 40px;height: 40px;float: left"></el-avatar>
                            <div class="num">
                                <p style="font-size: 20px;color: crimson">{{info.student}}</p>
                                <el-divider style="width: 200px;color: #8c939d;padding: 0"></el-divider>
                                <p style="font-size: 10px;margin-top: -20px;color: #333333">学生人数</p>
                            </div>
                        </el-card>
                    </div>
                    <div class="charts" id="echarts"></div>
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    import * as echarts from 'echarts';
    export default {
        name: "StatisticalManage",
        components: {TchAside, TchHeader},
        data(){
            return{
                info:{
                    paper:0,
                    exam:0,
                    classes:0,
                    student:0
                },
                echartsInfo:{
                    xAxisName:[],
                    seriesNum:[]
                }
            }
        },
        mounted() {
            this.getDataInfo()
        },
        methods:{
            async getDataInfo() {
                const res = await this.$http.get('/teacher/getStatisticsData')
                if(res.data.code==='200'){
                    for(var i=0;i<res.data.result.classInfo.length;i++){
                        this.echartsInfo.xAxisName[i]=res.data.result.classInfo[i].className
                        this.echartsInfo.seriesNum[i]=res.data.result.classInfo[i].classSize
                    }
                    this.info.paper=res.data.result.paperNum
                    this.info.exam=res.data.result.examNum
                    this.info.classes=res.data.result.classNum
                    this.info.student=res.data.result.studentNum

                    this.initChart()
                }
            },
            initChart() {
                const color1=new echarts.graphic.LinearGradient(
                    0,0,0,1,[
                        {offset:0,color:'#83bff6'},
                        {offset:0.5,color:'#83bff6'},
                        {offset:1,color:'#188df0'}
                    ]
                )
                const color2=new echarts.graphic.LinearGradient(
                    0,0,0,1,[
                        {offset:0,color:'yellow'},
                        {offset:0.5,color:'#188df0'},
                        {offset:1,color:'#83bff6'}
                    ]
                )
                var myeChart = echarts.init(document.getElementById("echarts"))
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '各班人数统计'
                    },
                    tooltip: {},
                    legend: {
                        data: ['班级人数']
                    },
                    xAxis: {
                        data: this.echartsInfo.xAxisName
                    },
                    yAxis: {},
                    series: [{
                        name: '班级人数',
                        type: 'bar',
                        data: this.echartsInfo.seriesNum,
                        itemStyle:{
                            normal:{
                                color:function (params) {
                                    if(params.value>10){
                                        return color1
                                    }else {
                                        return  color2
                                    }
                                }
                            }
                        }
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myeChart.setOption(option);
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
    .baseInfo{
        margin-left: 20px;
    }

    .clearfix{
        font-size: 14px;
    }
    /deep/
    .el-card__header{
        padding: 8px 10px;
    }
    .paper{
        width: 200px;
        height: 120px;
        background: beige -webkit-linear-gradient(bottom, hsla(0%, 20%, 50%, .15), hsla(0, 0%, 59%, 0), white) no-repeat;
        float: left;
    }
    .exam{
        margin-left: 70px;
        width: 200px;
        height: 120px;
        background: khaki -webkit-linear-gradient(bottom, hsla(0%, 20%, 50%, .15), hsla(0, 0%, 59%, 0), white) no-repeat;
        float: left;
    }
    .classes{
        margin-left: 70px;
        width: 200px;
        height: 120px;
        background: #e1f3d8 -webkit-linear-gradient(bottom, hsla(0%, 20%, 50%, .15), hsla(0, 0%, 59%, 0), white) no-repeat;
        float: left;
    }
    .student{
        margin-left: 70px;
        width: 200px;
        height: 120px;
        background: #faecd8 -webkit-linear-gradient(bottom, hsla(0%, 20%, 50%, .15), hsla(0, 0%, 59%, 0), white) no-repeat;
        float: left;
    }
    .num{
        float: left;
        margin-left: 30px;
        margin-top: -25px;

        .el-divider--horizontal{
            margin-top: -18px;
        }
    }
    .charts{
        bottom: -150px;
        width: 1200px;
        height: 400px;
    }
</style>
