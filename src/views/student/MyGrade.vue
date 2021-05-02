<template>
    <el-container>
        <el-header><StuHeader></StuHeader></el-header>
        <el-main>
            <div class="filter">
                <el-input
                        style="width: 260px"
                        v-model="search"
                        size="mini"
                        placeholder="输入关键字搜索"/>
                <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 5px" @click="searchGrade"></el-button>
            </div>
            <div class="table">
                <el-table
                        @sort-change="sortChange"
                        :data="tableData"
                        style="width: 100%"
                        stripe
                        size="medium"
                        highlight-current-row
                        :default-sort = "{prop: 'finishTime', order: 'descending'}">
                    <el-table-column
                            prop="examId"
                            v-if="false">
                    </el-table-column>
                    <el-table-column
                            prop="recordId"
                            v-if="false">
                    </el-table-column>
                    <el-table-column
                            prop="finishTime"
                            label="完成时间"
                            sortable="custom"
                            width="240">
                    </el-table-column>
                    <el-table-column
                            prop="examName"
                            label="考试名称"
                            width="240">
                    </el-table-column>
                    <el-table-column
                            prop="examScore"
                            label="分数"
                            sortable="custom"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="examFullmarks"
                            label="满分"
                            sortable="custom"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="examResult"
                            label="考试结果"
                            sortable="custom"
                            width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.examResult">
                                <el-tag type="success" size="small">已通过</el-tag>
                            </div>
                            <div v-if="!scope.row.examResult">
                                <el-tag type="danger" size="small">未通过</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="view"
                            align="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="viewDetails(scope.row)">查看详情</el-button>
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
</template>

<script>
    import StuHeader from "../../components/StuHeader";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "MyGrade",
        components: {StuHeader},
        data() {
            return {
                tableData: [],
                search: '',
                page: {
                    total: 0,
                    pageSize: 0,
                    currentPage: 1
                },
                sort:{
                    prop:"finishTime",
                    order:"descending"
                },
                issearch: false
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            async getData() {
                const res = await this.$http.get('/myGrade',{
                    params:{
                        prop:this.sort.prop,
                        order:this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result && res.data.result.list.length > 0) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].finishTime = dateFunction(res.data.result.list[i].finishTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let res=null
                if (!this.issearch) {
                    res = await this.$http.get('/myGrade',{
                        params:{
                            currentPage:val,
                            prop:this.sort.prop,
                            order:this.sort.order
                        }
                    })
                }
                if (this.issearch) {
                    res = await this.$http.get('/stuSearchGrade', {
                        params: {
                            content: this.search,
                            currentPage: val
                        }
                    })
                }
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].finishTime = dateFunction(res.data.result.list[i].finishTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            viewDetails(row) {
                this.$router.push({path: '/examination', query: {recordId: row.recordId, isPractice: true}})
            },
            async searchGrade() {
                this.issearch = true
                const res = await this.$http.get('/stuSearchGrade?content=' + this.search)
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].finishTime = dateFunction(res.data.result.list[i].finishTime)
                        }
                        this.tableData = res.data.result.list
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

                const res = await this.$http.get('/myGrade', {
                    params: {
                        prop: this.sort.prop,
                        order: this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].finishTime = dateFunction(res.data.result.list[i].finishTime)
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
