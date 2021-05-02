<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><AdminHeader></AdminHeader></el-header>
            <el-container>
                <el-aside width="241px"><AdminAside></AdminAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>学生信息管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="addStudent">
                        <el-button type="primary" icon="el-icon-plus" @click="addStu" size="mini">添加学生</el-button>
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
                                :default-sort = "{prop: 'stuUsername', order: 'ascending'}">
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
                                    prop="imageUrl"
                                    label="图片"
                                    width="200">
                                <template slot-scope="scope">
                                    <div class="img">
                                       <el-image :src="scope.row.imageUrl"></el-image>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="stuLastLogin"
                                    label="最后登录时间"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    prop="state"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="stuEdit(scope.row)" size="mini"></el-button>
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
                    title="添加学生"
                    :visible.sync="addStudentDialog"
                    width="35%"
                    :before-close="handleClose">
                <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-ruleForm">
                   <el-form-item label="学生学号" prop="userName">
                        <el-input v-model="infoForm.userName" :disabled="isDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="学生性别">
                        <el-radio v-model="infoForm.sex" label="男">男</el-radio>
                        <el-radio v-model="infoForm.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="学院名称" prop="academy">
                        <el-select v-model="infoForm.academy" placeholder="请选择学院" @change="acaSelect">
                            <el-option
                                    v-for="item in acaList"
                                    v-bind:key="item.acaId"
                                    :label="item.acaName"
                                    :value="item.acaId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业名称" prop="major">
                        <el-select v-model="infoForm.major" placeholder="请选择专业">
                            <el-option
                                    v-for="item in majorList"
                                    v-bind:key="item.majorId"
                                    :label="item.majorName"
                                    :value="item.majorId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="infoForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="infoForm.email"></el-input>
                    </el-form-item>
                    <el-form-item prop="image">
                        <el-upload
                                class="upload-demo"
                                action="string"
                                :http-request="uploadFile"
                                :before-upload="handleBeforeUnload"
                                accept=".jpg,.jpeg,.png"
                                :limit="1"
                                :file-list="fileList"
                                :show-file-list="false">
                            <el-button icon="el-icon-upload" type="primary">上传图片</el-button>
                            <span v-if="isSetting" style="font-size: 10px">(如果不需要修改证件照，可不上传)</span>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="updateStuInfo" v-if="isSetting">修 改</el-button>
                    <el-button type="primary" @click="submitNewStu" v-if="!isSetting">添 加</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import AdminHeader from "../../components/AdminHeader";
    import AdminAside from "../../components/AdminAside";
    import {dateFunction} from "../../utils/dateUtil";
    export default {
        name: "StudentManage",
        components: {AdminAside, AdminHeader},
        inject:['reload'],
        data(){
            return{
                search:'',
                tableData: [],
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                issearch:false,
                isSetting:false,
                isDisable:false,
                fileList:[],
                addStudentDialog:false,
                infoForm:{
                    userName:'',
                    name:'',
                    academy:'',
                    major:'',
                    phone:'',
                    email:'',
                    sex:'男'
                },
                acaList:[],
                majorList:[],
                formData:'',
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
                    major:[
                        { required: true, message: '请选择专业', trigger: 'blur' }
                    ],
                    phone:[
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { pattern: /^1[1356789]\d{9}$/, message: '请输入正确的手机号',trigger: 'blur'}
                    ],
                    email:[
                        { required: true, message: '请输入电子邮箱', trigger: 'blur' },
                        { pattern: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, message: '请输入正确的邮箱',trigger: 'blur'}
                    ],
                    image:[
                        { required: true, message: '请上传证件照', trigger: 'blur' },
                    ]
                }
            }
        },
        mounted() {
            this.formData=new FormData()
            this.getData()
        },
        methods:{
            async getData() {
                const res = await this.$http.get('/getStuInfoList')
                if(res.data.code==='200'){
                    if (res.data.result && res.data.result.list.length > 0){
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].stuLastLogin=dateFunction(res.data.result.list[i].stuLastLogin)
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
                    res = await this.$http.get('/getStuInfoList',{
                        params:{
                            currentPage: val
                        }
                    })
                }
                if(this.issearch){
                    res=await this.$http.get('/getStuSearchInfo',{
                        params:{
                            content:this.search,
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
                const res = await this.$http.get('/getStuSearchInfo',{
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
                this.addStudentDialog=false
            },
            async addStu() {
                this.isSetting = false
                this.addStudentDialog = true
                this.getAcaList()
            },
            async getAcaList(){
                const res = await this.$http.get('/academy/getAcademy')
                if(res.data.code==='200'){
                    this.acaList=res.data.result
                }
            },
            async acaSelect(val) {
                const res = await this.$http.get('/major/getMajor',{
                    params:{
                        acaId:val
                    }
                })
                if(res.data.code==='200'){
                    this.majorList=res.data.result
                }
            },
            handleBeforeUnload(file){
                if (this.fileList.length > 1) {
                    this.$message.warning("只能上传一张照片");
                    return false;
                }
                let size = 0
                size = file.size//byte
                size = size / 1024;//kb
                size = (size / 1024).toFixed(3);//mb
                if (size > 10) {
                    this.message.warning("文件大小不能超过10M")
                }
                let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
                if (fileType === 'jpg' || fileType === 'jpeg'|| fileType === 'png') {
                    this.fileList.push(file);
                } else {
                    this.$message.warning("只能上传.jpg.jpeg.png格式的文件");
                    return false;
                }
            },
            async uploadFile(params) {
                this.formData.append('file', params.file)
            },
            async stuEdit(row) {
                this.isSetting = true
                this.isDisable=true
                this.addStudentDialog = true
                const res = await this.$http.get('/getStudentInfoByStuId',{
                    params:{
                        stuId:row.stuId
                    }
                })
                if(res.data.code==='200'){
                    this.infoForm.userName=res.data.result.stuUsername
                    this.infoForm.name=res.data.result.stuName
                    this.infoForm.sex=res.data.result.stuSex
                    this.infoForm.phone=res.data.result.stuMobile
                    this.infoForm.email=res.data.result.stuEmail
                }
                this.getAcaList()
            },
            stuDelete(row) {
                this.$confirm("是否删除"+row.stuName+"?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async ()=> {
                    const res = await this.$http.get('/studentInfoDelete', {
                        params: {
                            stuId: row.stuId,
                            userName: row.stuUsername
                        }
                    })
                    if (res.data.code === '200') {
                        this.reload()
                    }
                })
            },
            async submitNewStu() {
                this.formData.append('userName',this.infoForm.userName)
                this.formData.append('name',this.infoForm.name)
                this.formData.append('major',this.infoForm.major)
                this.formData.append('phone',this.infoForm.phone)
                this.formData.append('email',this.infoForm.email)
                this.formData.append('sex',this.infoForm.sex)
                const res=await this.$http.post('/addStudentInfo',this.formData)
                if(res.data.code==='200'){
                    this.reload()
                }
            },
            async updateStuInfo() {
                this.formData.append('userName',this.infoForm.userName)
                this.formData.append('name',this.infoForm.name)
                this.formData.append('major',this.infoForm.major)
                this.formData.append('phone',this.infoForm.phone)
                this.formData.append('email',this.infoForm.email)
                this.formData.append('sex',this.infoForm.sex)
                const res = await this.$http.post('/updateStudentInfo',this.formData)
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

    .addStudent{
        float: left;
        margin-left: 50px;
        margin-top: -10px;
    }
    .filter{
        float: left;
        margin-left: 300px;
        margin-top: -10px;
    }

    .img{
        width: 40px;
        height: 60px;
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
