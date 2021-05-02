<template>
    <div class="container">
        <el-container>
            <el-header>
                <StuHeader></StuHeader>
            </el-header>
            <el-main>
                <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                    <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="searchExam"></el-button>
                </div>
                <div class="table">
                    <el-table
                            @sort-change="sortChange"
                            :data="tableData"
                            style="width: 100%"
                            stripe
                            size="medium"
                            highlight-current-row
                            :default-sort = "{prop: 'endTime', order: 'ascending'}">
                        <el-table-column
                                prop="examId"
                                v-if="false">
                        </el-table-column>
                        <el-table-column
                                prop="startTime"
                                label="开始时间"
                                sortable="custom"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="endTime"
                                label="结束时间"
                                sortable="custom"
                                width="160">
                        </el-table-column>
                        <!--当内容过长被隐藏时显示 tooltip-->
                        <el-table-column
                                :show-overflow-tooltip="true"
                                prop="examName"
                                label="考试名称"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip="true"
                                prop="className"
                                label="班级"
                                sortable="custom"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="tchName"
                                label="教师姓名"
                                show-overflow-tooltip
                                sortable="custom"
                                width="110">
                        </el-table-column>
                        <el-table-column
                                prop="examTime"
                                label="考试时间"
                                width="100">
                            <template slot-scope="scope">
                                {{scope.row.examTime}}分钟
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="isIdentify"
                                label="人脸识别"
                                width="80">
                            <template slot-scope="scope">
                                <el-tag type="warning" size="mini" v-if="scope.row.isIdentify">是</el-tag>
                                <el-tag type="success" size="mini" v-if="!scope.row.isIdentify">否</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="state"
                                align="right">
                                <template slot-scope="scope">
                                    <div v-if="dateTime>=scope.row.startTime">
                                        <el-button
                                                icon="el-icon-edit"
                                                size="mini"
                                                type="text"
                                                @click="examStart(scope.$index, scope.row)">去考试</el-button>
                                    </div>
                                    <div v-if="dateTime<scope.row.startTime">
                                        <el-tag type="warning" size="small">未开启</el-tag>
                                    </div>

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
        <div class="dialog">
            <el-dialog
                    :visible.sync="dialogVisible"
                    width="40%"
                    :show-close="false">
                <FaceIdentify></FaceIdentify>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import StuHeader from "../../components/StuHeader";
    import {dateFunction, getLocalDate} from "../../utils/dateUtil";
    import FaceIdentify from "./FaceIdentify";
    export default {
        name: "MyExam",
        components: {FaceIdentify, StuHeader},
        data() {
            return {
                tableData: [],
                search: '',
                dateTime:null,
                dialogVisible:false,
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                sort:{
                    prop:"endTime",
                    order:"ascending"
                },
                issearch:false
            }
        },
        mounted() {
            this.getData()
            this.dateTime=getLocalDate()
        },
        methods: {
            async examStart(index, row) {
                const res=await this.$http.get('/paper/paperInfo?examId='+row.examId)
                if(res.data.code==='200') {
                    let paper=res.data.result
                    this.$store.commit("SET_EXAM",row)
                    this.$store.commit("SET_PAPER",paper)
                    if(row.isIdentify){
                        this.$store.commit("SET_ISLOGIN",false)
                        this.dialogVisible=true
                    }else {
                        this.$router.push('/examination')
                    }
                }
            },
            async getData() {
                const res = await this.$http.get('/showStuExam',{
                    params:{
                        prop:this.sort.prop,
                        order:this.sort.order
                    }
                })
                if(res.data.code==='200'){
                    if(res.data.result && res.data.result.list.length>0){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].startTime=dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime=dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData=res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let res=null
                if(!this.issearch) {
                    res = await this.$http.get('/showStuExam',{
                        params:{
                            currentPage:val,
                            prop:this.sort.prop,
                            order:this.sort.order
                        }
                    })
                }
                if(this.issearch){
                    res = await this.$http.get('/stuSearchExam',{
                        params:{
                            content:this.search,
                            currentPage:val
                        }
                    })
                }
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].startTime = dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime = dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            async searchExam() {
                this.issearch=true
                const res = await this.$http.get('/stuSearchExam?content='+this.search)
                if(res.data.code==='200'){
                    if(res.data.result){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].startTime=dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime=dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData=res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async sortChange(val) {
                this.issearch = false
                this.search = ''
                this.sort.prop = val.prop
                this.sort.order = val.order

                const res = await this.$http.get('/showStuExam', {
                    params: {
                        prop: this.sort.prop,
                        order: this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].startTime = dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime = dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .container{
        height: 100%;
    }
    .el-header {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        line-height: 60px;
    }


    .el-main {
        background-color: #ffffff;
        color: #333;
        text-align: center;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-main{
        margin:20px 200px 0 200px;
        padding: 0;
    }
    .filter{
        float: right;
    }

    .Page{
        float: right;
        margin-top: 20px;
    }

</style>
