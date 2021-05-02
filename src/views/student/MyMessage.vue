<template>
    <div class="container">
        <el-container>
            <el-header><StuHeader></StuHeader></el-header>
            <el-container>
                <el-aside width="300px" :style="contentHeight">
                    <div class="avatar">
                        <el-image :src="url" class="avatar" fit="fill"></el-image>
                    </div>
                    <div class="info">
                        <p style="margin-left: 60px;font-size: 16px;font-weight: bold">{{info.stuName}}</p>
                        <p>学号：{{info.stuUsername}}</p>
                        <p>专业：{{info.majorName}}</p>
                        <p>学院：{{info.acaName}}</p>
                        <p>电话：{{info.stuMobile}}</p>
                        <p>邮箱：{{info.stuEmail}}</p>
                        <p>班级：</p>
                        <div class="classinfo">
                            <p v-for="item in classList"><el-tag type="success">{{item}}</el-tag></p>
                        </div>
                    </div>
                </el-aside>
                <el-main>
                    <div class="operation">
                        <el-button type="text" @click="getData">所有消息</el-button>
                        <span>（共 {{msgInfo.total}} 条，<el-button type="text" @click="showNotRead"> 未读消息</el-button> {{msgInfo.notRead}} 条）</span>
                        <el-button type="text" @click="changeRead">全部标为已读</el-button>
                        <el-button type="text" @click="deleteSelect" style="margin-left: 100px">删除选中消息</el-button>
                        <el-input
                                style="width: 200px;margin-left: 80px"
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="searchMsg"></el-button>
                    </div>
                    <div class="table">
                        <el-table
                                @selection-change="handleSelectionChange"
                                size="mini"
                                :data="tableData"
                                style="width: 100%"
                                :default-sort = "{prop: 'stuUsername', order: 'ascing'}">
                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>
                            <el-table-column
                                    prop="stuMsgId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="msgTime"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    show-overflow-tooltip
                                    prop="msgContent"
                                    width="400">
                            </el-table-column>
                            <el-table-column
                                    width="120">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.isRead">
                                        <el-tag type="success" size="mini">已读</el-tag>
                                    </div>
                                    <div v-if="!scope.row.isRead">
                                       <el-button size="mini" type="text"  @click="changOne(scope.row)">知道了</el-button>
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
        </el-container>
    </div>
</template>

<script>
    import StuHeader from "../../components/StuHeader";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "MyMessage",
        components: {StuHeader},
        inject:['reload'],
        data(){
            return{
                contentHeight:{
                    height:document.body.clientHeight-110+'px'
                },
                info:{
                    stuUsername:'',
                    stuName:'',
                    stuMobile:'',
                    stuEmail:'',
                    majorName:'',
                    acaName:''
                },
                classList:[],
                tableData:[],
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                search:'',
                msgInfo:{
                    total:'',
                    notRead:''
                },
                read:true, //是否为查询未读消息 true为所有 false为未读
                issearch:false, //是否为查询状态
                multipleSelection:[],
                url:''
            }
        },
        mounted() {
            this.getInfo()
            this.getClass()
            this.getData()
        },
        methods:{
            async getInfo() {
                const res = await this.$http.get('/student/stuInfo')
                if(res.data.code==='200'){
                    this.info=res.data.result
                }
                const res1=await this.$http.get('/notReadNum')
                if(res1.data.code==='200'){
                    this.msgInfo.notRead=res1.data.result
                }
                const res2=await this.$http.get('/student/getImageUrl?userName='+this.info.stuUsername)
                if(res2.data.code==='200'){
                    this.url=res2.data.result
                }
            },
            async getClass() {
                const res = await this.$http.get('/getStuClasses')
                if(res.data.code==='200'){
                    this.classList=res.data.result
                }
            },
            async getData() {
                this.read=true
                this.issearch=false
                const res = await this.$http.get('/stuMsg')
                if(res.data.code==='200'){
                    if (res.data.result){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].msgTime=dateFunction(res.data.result.list[i].msgTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                        this.msgInfo.total=res.data.result.total
                    }
                }
            },
            async handleCurrentChange(val) {
                let res=null
                if(this.read && !this.issearch) {
                    res = await this.$http.get('/stuMsg?currentPage=' + val)
                }
                if(!this.read){
                    res = await this.$http.get('/getNotRead?currentPage=' + val)
                }
                if(this.read && this.issearch){
                    const res = await this.$http.get('/searchMsg',{
                        params:{
                            currentPage:val,
                            content:this.search
                        }
                    })
                }
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].msgTime = dateFunction(res.data.result.list[i].msgTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            async showNotRead() {
                this.read=false
                const res = await this.$http.get('/getNotRead')
                if(res.data.code==='200'){
                    if (res.data.result){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].msgTime=dateFunction(res.data.result.list[i].msgTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async changeRead() {
                const res = await this.$http.get('/changeAllMsg')
                if(res.data.code==='200'){
                    this.reload()
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            async deleteSelect() {
                if(this.multipleSelection.length>0) {
                    let list = []
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        list[i] = this.multipleSelection[i].stuMsgId
                    }
                    const res = await this.$http.get('/deleteSelectMsg', {
                        params: {
                            msgIdList: list.toString()
                        }
                    })
                    if (res.data.code === '200') {
                        this.reload()
                    }
                }
            },
            async changOne(row) {
                const res = await this.$http.get('/changOneMsg?msgId='+row.stuMsgId)
                if(res.data.code==='200'){
                    this.reload()
                }
            },
            async searchMsg() {
                this.read=true
                this.issearch = true
                const res = await this.$http.get('/searchMsg',{
                    params:{
                        content:this.search
                    }
                })
                if(res.data.code==='200'){
                    if (res.data.result){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].msgTime=dateFunction(res.data.result.list[i].msgTime)
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

<style scoped lang="less">

    .container{
        height: 100%;
        background-color: #d3dce6;
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
        margin: 20px 30px 0 20px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }


    .el-aside{
        margin-left: 180px;
        margin-top: 20px;
        background-color: white;
    }
    .avatar{
        height: 120px;
        width: 100px;
        margin-left: 50px;
        margin-top: 10px;
    }

    .info{
        margin-left: 60px;
        margin-top: 40px;
        font-size: 14px;
    }
    .classinfo{
        width: 190px;
        height: 200px;
        margin-left: 45px;
        margin-top: -35px;
        .el-tag{
            height: 20px;
            line-height: 20px;
        }
    }

    .operation{
        margin-top: 10px;
        margin-left: 20px;
        font-size: 13px;
        span{
            margin-left: 5px;
            margin-right: 20px;
        }
    }
    .table{
        margin-left: 60px;
    }

</style>
