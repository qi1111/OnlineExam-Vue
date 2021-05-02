<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{path:'/classManage'}">班级管理</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{path:'/classInfo?classId='+this.classId+'&isAuto=false'}">班级信息</el-breadcrumb-item>
                        <el-breadcrumb-item>申请名单</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="table">
                        <el-table
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                size="mini"
                                highlight-current-row
                                @selection-change="handleSelectionChange">
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
                                    width="180">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    prop="stuName"
                                    label="学生姓名"
                                    show-overflow-tooltip
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="stuSex"
                                    label="性别"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="majorName"
                                    label="专业名称"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="stuMobile"
                                    label="联系电话"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="stuEmail"
                                    label="邮箱"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="agree(scope.row)" size="mini">通过</el-button>
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
    export default {
        name: "ApplyList",
        components: {TchAside, TchHeader},
        inject:['reload'],
        data(){
            return{
                classId:'',
                tableData: [],
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                multipleSelection: [],
            }
        },
        created() {
            this.getParams()
            this.getData()
        },
        methods:{
            getParams(){
                this.classId=this.$route.query.classId
            },
            async getData() {
                const res = await this.$http.get('/applyList?classId='+this.classId)
                if (res.data.code === '200'){
                    if (res.data.result && res.data.result.list.length > 0){
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange() {
                const res = await this.$http.get('/applyList', {
                    params: {
                        classId: this.classId,
                        currentPage: val
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
                        this.tableData = res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            async agree(row) {
                const res = await this.$http.get('/agreeApply',{
                    params:{
                        classId:this.classId,
                        stuId:row.stuId
                    }
                })
                if(res.data.code==='200'){
                    this.$message({
                        message: '已同意'+row.stuName+'加入班级! ',
                        type: 'success'
                    })
                    this.reload()
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
