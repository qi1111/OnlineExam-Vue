<template>
    <div class="container">
        <el-container>
            <el-header style="height: 55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>我的消息</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
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
                                    width="240">
                            </el-table-column>
                            <el-table-column
                                    show-overflow-tooltip
                                    prop="msgContent"
                                    width="700">
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
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "MessageManage",
        components: {TchAside, TchHeader},
        inject:['reload'],
        data(){
            return{
                search:'',
                msgInfo:{
                    total:'',
                    notRead:''
                },
                tableData:[],
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                read:true, //是否为查询未读消息 true为所有 false为未读
                issearch:false, //是否为查询状态
                multipleSelection:[]
            }
        },
        mounted() {
            this.getInfo()
            this.getData()
        },
        methods:{
            async getInfo(){
                const res=await this.$http.get('/tchNotReadNum')
                if(res.data.code==='200'){
                    this.msgInfo.notRead=res.data.result
                }
            },
            async getData() {
                this.read = true
                this.issearch = false
                const res = await this.$http.get('/tchMsg')
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].msgTime = dateFunction(res.data.result.list[i].msgTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                        this.msgInfo.total = res.data.result.total
                    }
                }
            },
            async handleCurrentChange() {
                let res = null
                if (this.read && !this.issearch) {
                    res = await this.$http.get('/tchMsg?currentPage=' + val)
                }
                if (!this.read) {
                    res = await this.$http.get('/getTchNotReadMsg?currentPage=' + val)
                }
                if (this.read && this.issearch) {
                    const res = await this.$http.get('/searchTchMsg', {
                        params: {
                            currentPage: val,
                            content: this.search
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
                this.read = false
                const res = await this.$http.get('/getTchNotReadMsg')
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].msgTime = dateFunction(res.data.result.list[i].msgTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async changeRead() {
                const res = await this.$http.get('/changeTchMsgRead')
                if(res.data.code==='200'){
                    this.reload()
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            async changOne(row) {
                const res = await this.$http.get('/changTchOneMsg?msgId=' + row.tchMsgId)
                if (res.data.code === '200') {
                    this.reload()
                }
            },
            async deleteSelect() {
                if(this.multipleSelection.length>0) {
                    let list = []
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        list[i] = this.multipleSelection[i].tchMsgId
                    }
                    const res = await this.$http.get('/deleteTchSelectMsg', {
                        params: {
                            msgIdList: list.toString()
                        }
                    })
                    if (res.data.code === '200') {
                        this.reload()
                    }
                }
            },
            async searchMsg() {
                this.read = true
                this.issearch = true
                const res = await this.$http.get('/searchTchMsg', {
                    params: {
                        content: this.search
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].msgTime = dateFunction(res.data.result.list[i].msgTime)
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

    .operation{
        margin-top: -20px;
        margin-left: 20px;
        font-size: 13px;
        span{
            margin-left: 5px;
            margin-right: 50px;
        }
    }
    .table{
        margin-left: 40px;
    }
</style>
