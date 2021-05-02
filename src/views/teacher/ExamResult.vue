<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{path:'/examMange'}">考试管理</el-breadcrumb-item>
                        <el-breadcrumb-item>考试详情</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="detail">
                        <span>班级人数：{{detail.classSize}}</span>
                        <span>已考：{{detail.already}}</span>
                        <span>未考：{{detail.notyet}}</span>
                    </div>
                    <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="searchExamResult"></el-button>
                    </div>
                    <div class="table">
                        <el-table
                                @sort-change="sortChange"
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                size="mini"
                                highlight-current-row
                                @selection-change="handleSelectionChange"
                                :default-sort = "{prop: 'stuUsername', order: 'ascending'}">
                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>
                            <el-table-column
                                    prop="stuId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="stuUsername"
                                    label="学号"
                                    sortable="custom"
                                    width="180">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    prop="stuName"
                                    label="学生姓名"
                                    show-overflow-tooltip
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="majorName"
                                    label="专业名称"
                                    sortable="custom"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="finishTime"
                                    label="完成时间"
                                    sortable="custom"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="examScore"
                                    label="分数"
                                    sortable="custom"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="examResult"
                                    label="是否通过"
                                    width="120">
                                <template slot-scope="scope">
                                    <el-tag type="success" v-if="scope.row.examResult" size="mini" align="center">通过</el-tag>
                                    <el-tag type="danger" v-if="!scope.row.examResult" size="mini" align="center">未通过</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="考试记录"
                                    width="120">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="examProcess(scope.row)">查看详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="Page">
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :hide-on-single-page="true"
                                @current-change="handleCurrentChange"
                                :total="page.total"
                                :page-size="page.pageSize"
                                :current-page="page.currentPage">
                        </el-pagination>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "ExamResult",
        components: {TchAside, TchHeader},
        data(){
            return{
                examId:'',
                detail: {
                    classSize: 0,
                    already: 0,//已考人数
                    notyet: 0//未考人数
                },
                search:'',
                tableData: [],
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                sort:{
                    prop:"stuUsername",
                    order:"ascending"
                },
                issearch:false,
                multipleSelection: [],

            }
        },
        mounted() {
            this.getParam()
            this.getData()
        },
        methods:{
            getParam(){
                this.examId=this.$route.query.examId
            },
            async getData() {
                const res = await this.$http.get('/getExamDetail?examId='+this.examId)
                if(res.data.code==='200'){
                    this.detail=res.data.result
                }
                const data=await this.$http.get('/viewGrade',{
                    params:{
                        examId:this.examId,
                        prop: this.sort.prop,
                        order: this.sort.order
                    }
                })
                if(data.data.code==='200'){
                    if (data.data.result && data.data.result.list.length > 0){
                        for(var i=0;i<data.data.result.list.length;i++){
                            data.data.result.list[i].finishTime=dateFunction(data.data.result.list[i].finishTime)
                        }
                        this.tableData = data.data.result.list
                        this.page.pageSize = data.data.result.list.length
                        this.page.total = data.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let data=null
                if(!this.issearch) {
                    data = await this.$http.get('/viewGrade', {
                        params: {
                            examId: this.examId,
                            currentPage: val,
                            prop: this.sort.prop,
                            order: this.sort.order
                        }
                    })
                }
                if(this.issearch){
                    data = await this.$http.get('/tchSearchExamResult', {
                        params: {
                            examId: this.examId,
                            content:this.search,
                            currentPage: val
                        }
                    })
                }
                if(data.data.code==='200'){
                    if (data.data.result){
                        for(var i=0;i<data.data.result.list.length;i++){
                            data.data.result.list[i].finishTime=dateFunction(data.data.result.list[i].finishTime)
                        }
                        this.tableData = data.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            async searchExamResult() {
                this.issearch = true
                const res = await this.$http.get('/tchSearchExamResult',{
                    params:{
                        examId:this.examId,
                        content:this.search
                    }
                })
                if(data.data.code==='200'){
                    if (data.data.result){
                        for(var i=0;i<data.data.result.list.length;i++){
                            data.data.result.list[i].finishTime=dateFunction(data.data.result.list[i].finishTime)
                        }
                        this.tableData = data.data.result.list
                        this.page.pageSize = data.data.result.list.length
                        this.page.total = data.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async sortChange(val) {
                this.issearch = false
                this.search = ''
                this.sort.prop = val.prop
                this.sort.order = val.order

                const data = await this.$http.get('/viewGrade', {
                    params: {
                        examId: this.examId,
                        prop: this.sort.prop,
                        order: this.sort.order
                    }
                })
                if (data.data.code === '200') {
                    if (data.data.result) {
                        for (var i = 0; i < data.data.result.list.length; i++) {
                            data.data.result.list[i].finishTime = dateFunction(data.data.result.list[i].finishTime)
                        }
                        this.tableData = data.data.result.list
                        this.page.pageSize = data.data.result.list.length
                        this.page.total = data.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            examProcess(row){
                this.$router.push({
                    path:'/viewExamProcess',
                    query:{
                        userName:row.stuUsername,
                        examId:this.examId,
                        stuId:row.stuId
                    }
                })
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

    .detail{
        font-size: 15px;
        margin-top: -20px;
        float: left;
        span{
            margin-left: 80px;
        }
    }

    .filter{
        float: left;
        margin-top: -20px;
        margin-left: 600px;
    }
    .table{
        margin-top: 10px;
        margin-left: 30px;
    }

</style>
