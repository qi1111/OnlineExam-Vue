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
                <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 5px" @click="searchClass"></el-button>
            </div>
            <div class="table">
                <el-table
                        @sort-change="sortChange"
                        :data="tableData"
                        style="width: 100%"
                        stripe
                        size="medium"
                        highlight-current-row
                        :default-sort = "{prop: 'joinTime', order: 'descending'}">
                    <el-table-column
                            prop="classId"
                            v-if="false">
                    </el-table-column>
                    <el-table-column
                            prop="joinTime"
                            label="加入时间"
                            sortable="custom"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="className"
                            label="班级名称"
                            show-overflow-tooltip
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="tchName"
                            label="教师姓名"
                            sortable="custom"
                            show-overflow-tooltip
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="majorName"
                            label="专业名称"
                            sortable="custom"
                            show-overflow-tooltip
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="acaName"
                            label="学院名称"
                            sortable="custom"
                            show-overflow-tooltip
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="classSize"
                            label="班级人数"
                            sortable="custom"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="operation"
                            align="right">
                        <template slot-scope="scope">
                            <div class="ing" v-if="!scope.row.state">
                                申请中
                            </div>
                            <div v-if="scope.row.state">
                            <el-button type="primary" size="mini" @click="deleteClass(scope.$index,scope.row)">退出班级</el-button>
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
</template>

<script>
    import StuHeader from "../../components/StuHeader";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "MyClass",
        components: {StuHeader},
        inject:['reload'],
        data() {
            return {
                tableData: [],
                search: '',
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                sort:{
                    prop:"joinTime",
                    order:"descending"
                },
                issearch:false
            }
        },
        mounted() {
            this.getData()
        },
        methods:{
            async getData() {
                const res = await this.$http.get('/showMyClass',{
                    params:{
                        prop:this.sort.prop,
                        order:this.sort.order
                    }
                })
                if(res.data.code==='200'){
                    if(res.data.result && res.data.result.list.length>0){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].joinTime=dateFunction(res.data.result.list[i].joinTime)
                        }
                        this.tableData=res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let res=null;
                if(!this.issearch) {
                    res = await this.$http.get('/showMyClass',{
                        params:{
                            currentPage:val,
                            prop:this.sort.prop,
                            order:this.sort.order
                        }
                    })
                }
                if(this.issearch){
                    res = await this.$http.get('/stuSearchClass',{
                        params:{
                            content:this.search,
                            currentPage:val
                        }
                    })
                }
                if(res.data.code==='200'){
                    if(res.data.result){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].joinTime=dateFunction(res.data.result.list[i].joinTime)
                        }
                        this.tableData=res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            async deleteClass(index, row) {
                const res = await this.$http.get('/deleteClass?classId='+row.classId)
                if(res.data.code==='200'){
                    this.$message({
                        message: '退出班级成功! ',
                        type: 'success'
                    })
                    this.reload()
                }else{
                    this.$message.error('退出班级失败!');
                }
            },
            async searchClass() {
                this.issearch=true
                const res = await this.$http.get('/stuSearchClass?content=' + this.search)
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].joinTime = dateFunction(res.data.result.list[i].joinTime)
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

                const res = await this.$http.get('/showMyClass', {
                    params: {
                        prop: this.sort.prop,
                        order: this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].joinTime = dateFunction(res.data.result.list[i].joinTime)
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

    .ing{
        color: green;
        font-size: 14px;
    }
</style>
