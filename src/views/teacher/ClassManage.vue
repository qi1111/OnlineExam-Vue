<template>
    <div class="container">
        <el-container>
            <el-header style="height: 55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>班级管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="create">
                        <el-button type="primary" icon="el-icon-plus" @click="createClass">创建班级</el-button>
                    </div>
                    <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="searchClass">搜索</el-button>
                    </div>
                    <div class="table">
                        <el-table
                                @sort-change="sortChange"
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                highlight-current-row
                                :default-sort = "{prop: 'majorName', order: 'ascending'}">
                            <el-table-column
                                    prop="classId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="className"
                                    label="班级名称"
                                    sortable
                                    width="200">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    prop="majorName"
                                    label="专业名称"
                                    sortable
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="classSize"
                                    label="班级人数"
                                    sortable
                                    width="140">
                            </el-table-column>
                            <el-table-column
                                    prop="isAuto"
                                    label="自动通过"
                                    width="200">
                                <template slot-scope="scope">
                                    <el-switch
                                            v-model="scope.row.isAuto"
                                            :width="width"
                                            active-color="#13ce66"
                                            inactive-color="#C0CCDA"
                                            @change="switchChange(scope.row)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="classInfo(scope.row)"></el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="classDelete(scope.row)"></el-button>
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
                    title="创建班级"
                    :visible.sync="createClassDialog"
                    :before-close="handleDialogClose"
                    width="33%">
                <el-form :model="classForm" ref="classForm" size="medium" :rules="classRules" :label-position="labelPosition">
                    <el-form-item label="学院名称：">
                        <el-input v-model="classForm.acaName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="班级名称：" prop="className">
                        <el-input v-model="classForm.className" placeholder="请输入班级名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属专业：">
                        <el-select v-model="classForm.region" placeholder="请选择班级所属专业">
                            <el-option
                                    v-for="item in classForm.majorList"
                                    v-bind:key="item.majorId"
                                    :label="item.majorName"
                                    :value="item.majorId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自动通过：" prop="delivery">
                        <el-switch v-model="classForm.delivery" :width="width"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('classForm')" class="submit">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    export default {
        name: "ClassManage",
        components: {TchAside, TchHeader},
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
                sort:{
                    prop:"majorName",
                    order:"ascending"
                },
                issearch:false,
                width:50,//开关宽度
                createClassDialog: false,
                labelPosition:'right',
                classForm:{
                    acaName:'',
                    className:'',
                    region:'',
                    delivery:false,
                    majorList:[]
                },
                classRules:{
                    className:[
                        { min:2, max: 20, message: '班级名称长度为2-20个中文或字符', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.getData()
        },
        methods:{
            async getData() {
                const res = await this.$http.get('/showTchClasses',{
                    params:{
                        params:{
                            prop:this.sort.prop,
                            order:this.sort.order
                        }
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
                    res = await this.$http.get('/showTchClasses',{
                        params:{
                            currentPage:val,
                            prop:this.sort.prop,
                            order:this.sort.order
                        }
                    })
                }
                if(this.issearch){
                    res = await this.$http.get('/tchSearchClass',{
                        params:{
                            content:this.search,
                            currentPage:val
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
            classDelete(row){
                this.$confirm("是否解散"+row.className+"?","提示",{
                    confirmButtonText: '解散',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then( async ()=>{
                    const res=await this.$http.get('/classDelete?classId='+row.classId)
                    if(res.data.code==='200'){
                        this.$message({
                            message: '班级解散成功! ',
                            type: 'success'
                        })
                    }
                    this.reload()
                })
            },
            async switchChange(row) {
                const res = await this.$http.get("/updateAuto",{
                    params:{
                        classId:row.classId,
                        auto:row.isAuto
                    }
                })
            },
            handleDialogClose(){
                this.classForm.className=''
                this.createClassDialog=false
            },
            cancel(){
                this.classForm.className=''
                this.createClassDialog=false
            },
            async createClass() {

                const res = await this.$http.get('/teacher/getTchAca')
                if(res.data.code==='200'){
                    this.classForm.acaName=res.data.result.acaName
                    this.classForm.majorList=res.data.result.majorList
                }

                this.createClassDialog = true
            },
            submitForm(formName){
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        console.log(this.classForm)
                        const res=await this.$http.get('/addTchClass',{
                           params:{
                               className:this.classForm.className,
                               majorId:this.classForm.region,
                               isAuto:this.classForm.delivery
                           }
                        })
                        if(res.data.code==='200'){
                            this.$message({
                                message: '创建班级成功! ',
                                type: 'success'
                            })
                            this.reload()
                        }else {
                            this.$message.error("创建班级失败")
                        }
                    }
                })
            },
            classInfo(row){
                this.$router.push({
                    path:'/classInfo',
                    query:{
                        classId:row.classId,
                        isAuto:row.isAuto
                    }
                })
            },
            async searchClass() {
                this.issearch=true
                const res = await this.$http.get('/tchSearchClass?content='+this.search)
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

                const res = await this.$http.get('/showTchClasses', {
                    params: {
                        params: {
                            prop: this.sort.prop,
                            order: this.sort.order
                        }
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

    .create{
        float: left;
        margin-left: 30px;
        margin-top: -10px;
    }

    .el-input{
        width: 300px;
    }

    .filter{
        float: left;
        margin-left: 80px;
        margin-top: -10px;
    }

    .table{
        margin-top: 70px;
        margin-left: 20px;
        margin-right: 30px;
    }
    .Page{
        float: right;
        margin-top: 20px;
    }

    .submit{
        margin-left: 150px;
        margin-top: 10px;
    }

    .el-select-dropdown__item.selected{
        color: #606266;
        font-weight: 100;
    }
</style>
