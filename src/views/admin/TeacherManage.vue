<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><AdminHeader></AdminHeader></el-header>
            <el-container>
                <el-aside width="241px"><AdminAside></AdminAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>教师信息管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="addTeacher">
                        <el-button type="primary" icon="el-icon-plus" @click="addTch" size="mini">添加教师</el-button>
                    </div>
                    <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="searchClassInfo"></el-button>
                    </div>
                    <div class="table">
                        <el-table
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                size="mini"
                                highlight-current-row
                                :default-sort = "{prop: 'tchUsername', order: 'ascending'}">
                            <el-table-column
                                    prop="tchId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="tchUsername"
                                    label="教师号"
                                    width="180">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    prop="tchName"
                                    label="教师姓名"
                                    show-overflow-tooltip
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="tchSex"
                                    label="性别"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="tchMobile"
                                    label="联系电话"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="tchEmail"
                                    label="邮箱"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="tchLastLogin"
                                    label="最后登录时间"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="tchEdit(scope.row)" size="mini"></el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="tchDelete(scope.row)" size="mini"></el-button>
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
                    title="添加教师信息"
                    :visible.sync="addTeacherDialog"
                    width="35%"
                    :before-close="handleClose">
                <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="教师号" prop="userName">
                        <el-input v-model="infoForm.userName" :disabled="isDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="教师姓名" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="教师性别">
                        <el-radio v-model="infoForm.sex" label="男">男</el-radio>
                        <el-radio v-model="infoForm.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="学院名称" prop="academy">
                        <el-select v-model="infoForm.academy" placeholder="请选择学院">
                            <el-option
                                    v-for="item in acaList"
                                    v-bind:key="item.acaId"
                                    :label="item.acaName"
                                    :value="item.acaId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="infoForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="infoForm.email"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="updateTchInfo" v-if="isSetting">修 改</el-button>
                    <el-button type="primary" @click="submitNewTch" v-if="!isSetting">添 加</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import AdminAside from "../../components/AdminAside";
    import AdminHeader from "../../components/AdminHeader";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "TeacherManage",
        components: {AdminHeader, AdminAside},
        inject:['reload'],
        data(){
            return{
                search:'',
                tableData:[],
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                issearch:false,
                isSetting:false,
                isDisable:false,
                infoForm:{
                    userName:'',
                    name:'',
                    academy:'',
                    phone:'',
                    email:'',
                    sex:'男',
                    tchId:''
                },
                acaList:[],
                addTeacherDialog:false,
                rules:{
                    userName:[
                        { required: true, message: '请输入学生学号', trigger: 'blur' },
                        { max: 20, message: '请保证长度在20个字符之内', trigger: 'blur' },
                        { pattern: /^[0-9]*$/, message: '学号只能为数字',trigger: 'blur'}
                    ],
                    name:[
                        { required: true, message: '请输入学生姓名', trigger: 'blur' }
                    ],
                    academy:[
                        { required: true, message: '请选择学院', trigger: 'blur' }
                    ],
                    phone:[
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { pattern: /^1[1356789]\d{9}$/, message: '请输入正确的手机号',trigger: 'blur'}
                    ],
                    email:[
                        { required: true, message: '请输入电子邮箱', trigger: 'blur' },
                        { pattern: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, message: '请输入正确的邮箱',trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.getData()
        },
        methods:{
            async getData() {
                const res = await this.$http.get('/getTchInfoList')
                if(res.data.code==='200'){
                    if (res.data.result && res.data.result.list.length > 0){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].tchLastLogin=dateFunction(res.data.result.list[i].tchLastLogin)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let res = null;
                if (!this.issearch) {
                    res = await this.$http.get('/getTchInfoList', {
                        params: {
                            currentPage: val
                        }
                    })
                }
                if(this.issearch) {
                    res = await this.$http.get('/getTchSearchInfo', {
                        params: {
                            content: this.search,
                            currentPage: val
                        }
                    })
                }
                if(res.data.code==='200'){
                    if (res.data.result) {
                        this.tableData = res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            async searchClassInfo() {
                this.issearch = true
                const res = await this.$http.get('/getTchSearchInfo',{
                    params:{
                        content:this.search
                    }
                })
                if(res.data.code==='200'){
                    if (res.data.result){
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            handleClose(){
                this.infoForm=''
                this.addTeacherDialog=false
            },
            async getAcaList(){
                const res = await this.$http.get('/academy/getAcademy')
                if(res.data.code==='200'){
                    this.acaList=res.data.result
                }
            },
            addTch(){
                this.isSetting = false
                this.addTeacherDialog=true
                this.getAcaList()
            },
            async tchEdit(row) {
                this.isSetting = true
                this.isDisable = true
                this.addTeacherDialog = true
                const res = await this.$http.get('/getTeacherInfoByTchId', {
                    params: {
                        tchId: row.tchId
                    }
                })
                if (res.data.code === '200') {
                    this.infoForm.userName = res.data.result.tchUsername
                    this.infoForm.name = res.data.result.tchName
                    this.infoForm.sex = res.data.result.tchSex
                    this.infoForm.phone = res.data.result.tchMobile
                    this.infoForm.email = res.data.result.tchEmail
                    this.infoForm.tchId=row.tchId
                }
                this.getAcaList()
            },
            async tchDelete(row){
                this.$confirm("是否删除"+row.tchName+"?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async ()=> {
                    const res = await this.$http.get('/teacherInfoDelete', {
                        params: {
                            tchId: row.tchId
                        }
                    })
                    if (res.data.code === '200') {
                        this.reload()
                    }
                })
            },
            async submitNewTch() {
                let formData = new FormData()
                formData.append('userName', this.infoForm.userName)
                formData.append('name', this.infoForm.name)
                formData.append('academy', this.infoForm.academy)
                formData.append('phone', this.infoForm.phone)
                formData.append('email', this.infoForm.email)
                formData.append('sex', this.infoForm.sex)
                const res = await this.$http.post('/addTeacherInfo',formData)
                if(res.data.code==='200'){
                    this.reload()
                }
            },
            async updateTchInfo(){
                let formData = new FormData()
                formData.append('userName', this.infoForm.userName)
                formData.append('name', this.infoForm.name)
                formData.append('academy', this.infoForm.academy)
                formData.append('phone', this.infoForm.phone)
                formData.append('email', this.infoForm.email)
                formData.append('sex', this.infoForm.sex)
                formData.append('tchId', this.infoForm.tchId)
                const res=await this.$http.post('/updateTeacherInfo',formData)
                if(res.data.code==='200'){
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

    .addTeacher{
        float: left;
        margin-left: 50px;
        margin-top: -10px;
    }
    .filter{
        float: left;
        margin-left: 300px;
        margin-top: -10px;
    }

    .table{
        margin-top: 30px;
        margin-left: 10px;
    }

    .dialog{
        /deep/
        .el-input__inner{
            width: 300px;
        }
        /deep/
        .el-dialog__footer{
            padding:0 20px 20px;
        }
        /deep/
        .el-dialog__body{
            padding: 10px 20px 10px 20px;
        }
        .dialog-footer{
            margin-top: -80px;
        }
    }
</style>
