<template>
    <div class="container">
        <el-container>
            <el-header style="height: 55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{path:'/classManage'}">班级管理</el-breadcrumb-item>
                        <el-breadcrumb-item>班级信息</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="rename">
                        <el-button type="primary" icon="el-icon-edit" @click="dialogVisible=true" size="mini">修改班级名称</el-button>
                    </div>
                    <div class="applist" v-if="isAuto==='false'">
                        <el-button type="primary" icon="el-icon-user-solid" @click="applyList" size="mini">申请名单</el-button>
                    </div>
                    <div class="select">
                        <el-button type="text" @click="removeSelected">移除选中的学生</el-button>
                    </div>

                    <div class="filter">
                        <el-input
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="searchClassInfo"></el-button>
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
                                    sortable="custom"
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
                                    <el-button type="danger" icon="el-icon-delete" @click="stuDelete(scope.row)" size="mini"></el-button>
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
        <div class="dialog">
            <el-dialog
                    title="修改班级名称"
                    :visible.sync="dialogVisible"
                    width="30%"
                    center
                    :before-close="handleClose">
                新名称：
                <el-input v-model="input" placeholder="请输入新的班级名称"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleRename">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    export default {
        name: "ClassInfo",
        components: {TchAside, TchHeader},
        inject:['reload'],
        data(){
            return{
                classId:'',
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
                isAuto:'',
                dialogVisible:false,
                input:''
            }
        },
        created() {
            this.getParams()
            this.getData()
        },
        methods:{
            getParams(){
                this.classId=this.$route.query.classId
                this.isAuto=this.$route.query.isAuto
            },
            async getData() {
                const res = await this.$http.get('/showStuByClass',{
                    params:{
                        classId:this.classId,
                        prop:this.sort.prop,
                        order:this.sort.order
                    }
                })
                if (res.data.code === '200'){
                    if (res.data.result && res.data.result.list.length > 0){
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let res=null
                if(!this.issearch) {
                    res = await this.$http.get('/showStuByClass', {
                        params: {
                            classId: this.classId,
                            currentPage: val,
                            prop:this.sort.prop,
                            order:this.sort.order
                        }
                    })
                }
                if(this.issearch){
                    res = await this.$http.get('/tchSearchClassInfo', {
                        params: {
                            classId: this.classId,
                            content:this.search,
                            currentPage: val
                        }
                    })
                }
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
            handleClose(){
                this.dialogVisible=false
                this.input=''
            },
            async handleRename() {
                this.$confirm("确定要将班级名称修改为"+this.input+"吗?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then( async ()=> {
                    const res = await this.$http.get('/classRename', {
                        params: {
                            classId: this.classId,
                            newName: this.input
                        }
                    })
                    if (res.data.code === '200') {
                        this.$message({
                            message: '班级名称修改为'+this.input,
                            type: 'success'
                        })
                    }
                    this.reload()
                })
            },
            stuDelete(row) {
                this.$confirm("是否将"+row.stuName+"移出班级?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then( async ()=> {
                    const res = await this.$http.get('/outOfClass', {
                        params: {
                            classId: this.classId,
                            stuId: row.stuId
                        }
                    })
                    if(res.data.code==='200'){
                        this.$message({
                            message: '学生移出班级成功! ',
                            type: 'success'
                        })
                    }
                    this.reload()
                })
            },
            async removeSelected() {
                if(this.multipleSelection.length>0){
                    let list = []
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        list[i] = this.multipleSelection[i].stuId
                    }
                    const res = await this.$http.get('/removeSelectStu',{
                        params:{
                            stuIdList:list.toString(),
                            classId:this.classId
                        }
                    })
                    if(res.data.code==='200'){
                        this.reload()
                    }
                }
            },
            applyList(){
                this.$router.push({
                    path:'/applyList',
                    query:{
                        classId:this.classId
                    }
                })
            },
           async searchClassInfo() {
                this.issearch=true
                const res = await this.$http.get('/tchSearchClassInfo',{
                    params:{
                        classId:this.classId,
                        content:this.search
                    }
                })
                if (res.data.code === '200'){
                    if (res.data.result){
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

                const res = await this.$http.get('/showStuByClass', {
                    params: {
                        classId: this.classId,
                        prop: this.sort.prop,
                        order: this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
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

    .rename{
        float: left;
        margin-left: 30px;
        margin-top: -10px;
    }
    .applist{
        float: left;
        margin-left: 20px;
        margin-top: -10px;
    }

    .filter{
        float: left;
        margin-left: 80px;
        margin-top: -10px;
    }
    .select{
        float: left;
        margin-left: 80px;
        margin-top: -15px;
    }
    .table{
        margin-top: 70px;
    }

    .el-input{
        width: 300px;
    }
</style>
