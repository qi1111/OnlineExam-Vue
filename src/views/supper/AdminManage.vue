<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><SupperHeader></SupperHeader></el-header>
            <el-container>
                <el-aside width="241px"><SupperAside></SupperAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>管理员信息管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="addAdmin">
                        <el-button type="primary" icon="el-icon-plus" @click="addAdminDialog=true" size="mini">新建管理员</el-button>
                    </div>
                    <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="searchAdminInfo"></el-button>
                    </div>
                    <div class="table">
                        <el-table
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                size="mini"
                                highlight-current-row
                                :default-sort = "{prop: 'adminUsername', order: 'ascending'}">
                            <el-table-column
                                    prop="adminId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="adminUsername"
                                    label="教师号"
                                    width="180">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    prop="adminName"
                                    label="教师姓名"
                                    show-overflow-tooltip
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="adminSex"
                                    label="性别"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="adminMobile"
                                    label="联系电话"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="adminEmail"
                                    label="邮箱"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="adminLastLogin"
                                    label="最后登录时间"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="adminEdit(scope.row)" size="mini"></el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="adminDelete(scope.row)" size="mini"></el-button>
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
                    title="新增管理员"
                    :visible.sync="addAdminDialog"
                    width="35%"
                    :before-close="handleClose">
                <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="管理员账号" prop="userName">
                        <el-input v-model="infoForm.userName" :disabled="isDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员姓名" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员性别">
                        <el-radio v-model="infoForm.sex" label="男">男</el-radio>
                        <el-radio v-model="infoForm.sex" label="女">女</el-radio>
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
                    <el-button type="primary" @click="updateAdminInfo" v-if="isSetting">修 改</el-button>
                    <el-button type="primary" @click="submitNewAdmin" v-if="!isSetting">添 加</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import SupperHeader from "../../components/SupperHeader";
    import SupperAside from "../../components/SupperAside";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "AdminManage",
        components: {SupperAside, SupperHeader},
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
                addAdminDialog:false,
                infoForm:{
                    userName:'',
                    name:'',
                    phone:'',
                    email:'',
                    sex:'男',
                    adminId:''
                },
                rules:{
                    userName:[
                        { required: true, message: '请输入学生学号', trigger: 'blur' },
                        { max: 20, message: '请保证长度在20个字符之内', trigger: 'blur' },
                        { pattern: /^[0-9]*$/, message: '学号只能为数字',trigger: 'blur'}
                    ],
                    name:[
                        { required: true, message: '请输入学生姓名', trigger: 'blur' }
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
                const res = await this.$http.get('/getAdminInfoList')
                if(res.data.code==='200'){
                    if (res.data.result && res.data.result.list.length > 0){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].adminLastLogin=dateFunction(res.data.result.list[i].adminLastLogin)
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
                    res = await this.$http.get('/getAdminInfoList', {
                        params: {
                            currentPage: val
                        }
                    })
                }
                if(this.issearch) {
                    res = await this.$http.get('/getAdminSearchInfo', {
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
            async searchAdminInfo() {
                this.issearch = true
                const res = await this.$http.get('/getAdminSearchInfo',{
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
                this.addAdminDialog=false
            },
            async adminEdit(row){
                this.isSetting = true
                this.isDisable = true
                this.addAdminDialog = true
                const res = await this.$http.get('/getAdminInfoByTchId', {
                    params: {
                        adminId: row.adminId
                    }
                })
                if (res.data.code === '200') {
                    this.infoForm.userName = res.data.result.adminUsername
                    this.infoForm.name = res.data.result.adminName
                    this.infoForm.sex = res.data.result.adminSex
                    this.infoForm.phone = res.data.result.adminMobile
                    this.infoForm.email = res.data.result.adminEmail
                    this.infoForm.adminId=row.adminId
                }
            },
            adminDelete(row){
                this.$confirm("是否删除"+row.adminName+"?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async ()=> {
                    const res = await this.$http.get('/adminInfoDelete', {
                        params: {
                            adminId: row.adminId
                        }
                    })
                    if (res.data.code === '200') {
                        this.reload()
                    }
                })
            },
            async submitNewAdmin() {
                let formData = new FormData()
                formData.append('userName', this.infoForm.userName)
                formData.append('name', this.infoForm.name)
                formData.append('phone', this.infoForm.phone)
                formData.append('email', this.infoForm.email)
                formData.append('sex', this.infoForm.sex)
                const res = await this.$http.post('/addAdminInfo', formData)
                if (res.data.code === '200') {
                    this.reload()
                }
            },
            async updateAdminInfo() {
                let formData = new FormData()
                formData.append('userName', this.infoForm.userName)
                formData.append('name', this.infoForm.name)
                formData.append('phone', this.infoForm.phone)
                formData.append('email', this.infoForm.email)
                formData.append('sex', this.infoForm.sex)
                formData.append('adminId', this.infoForm.adminId)
                const res = await this.$http.post('/updateAdminInfo', formData)
                if (res.data.code === '200') {
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

    .addAdmin{
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
            margin-left: 30px;
        }
        .dialog-footer{
            margin-top: -80px;
        }
    }
</style>
