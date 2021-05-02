<template>
    <div class="container">
        <el-container>
            <el-header height="55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>考试管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="create">
                        <el-button type="primary" icon="el-icon-plus" @click="createExam">创建考试</el-button>
                    </div>
                    <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="searchExam">搜索</el-button>
                    </div>
                    <div class="table">
                        <el-table
                                @sort-change="sortChange"
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                highlight-current-row
                                :default-sort = "{prop: 'startTime', order: 'descending'}">
                            <el-table-column
                                    prop="examId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="classId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="startTime"
                                    label="开始时间"
                                    sortable="custom"
                                    width="160">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    prop="endTime"
                                    label="结束时间"
                                    sortable="custom"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="examName"
                                    label="考试名称"
                                    show-overflow-tooltip
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="className"
                                    label="班级名称"
                                    sortable="custom"
                                    show-overflow-tooltip
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="isIdentify"
                                    label="人脸识别"
                                    width="90">
                                <template slot-scope="scope">
                                    <el-switch
                                            v-model="scope.row.isIdentify"
                                            :width="width"
                                            active-color="#13ce66"
                                            inactive-color="#C0CCDA"
                                            @change="switchChange(scope.row)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="passMark"
                                    label="及格分数"
                                    width="90">
                                <template slot-scope="scope">
                                    {{scope.row.examPassmarks}}/{{scope.row.examFullmarks}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="examModel"
                                    label="监考模式"
                                    width="90">
                            </el-table-column>
                            <el-table-column
                                    prop="examState"
                                    label="考试状态"
                                    width="100">
                                <template slot-scope="scope">
                                    <div v-if="dateTime>=scope.row.startTime
                                            && scope.row.endTime>dateTime">
                                        <el-tag type="info">进行中</el-tag>
                                    </div>
                                    <div v-if="dateTime<scope.row.startTime">
                                        <el-tag type="warning">未开启</el-tag>
                                    </div>
                                    <div v-if="dateTime>scope.row.endTime">
                                        <el-tag type="danger">已结束</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    prop="state"
                                    width="200px"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-setting" @click="setting(scope.row)" v-if="scope.row.startTime>dateTime">设置</el-button>
                                    <div v-if="scope.row.startTime>dateTime" style="float: left">
                                        <el-button type="danger" @click="examDelete(scope.row)">取消</el-button>
                                    </div>
                                    <div v-if="dateTime>=scope.row.startTime
                                            && scope.row.examModel==='随机抓拍'
                                            && scope.row.endTime>dateTime"
                                            align="center">
                                        <el-button type="text" @click="examResult(scope.row)">查看详情</el-button>
                                    </div>
                                    <div v-if="dateTime>=scope.row.startTime
                                            && scope.row.endTime>dateTime
                                            && scope.row.examModel==='现场监考'"
                                            style="float: left;margin-left: 10px">
                                        <el-button type="text">去监考</el-button>
                                    </div>
                                    <div v-if="scope.row.endTime<dateTime" align="center">
                                        <el-button type="text" @click="examResult(scope.row)">查看考试结果</el-button>
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
        <div class="dialog">
            <el-dialog
                    title="新建考试"
                    :visible.sync="createExamDialog"
                    width="40%"
                    :before-close="handleClose">
                <el-form :model="examForm" :rules="rules" ref="examForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="考试名称" prop="name">
                        <el-input v-model="examForm.examName"></el-input>
                    </el-form-item>
                    <el-form-item label="选择试卷" prop="paper">
                        <el-select v-model="examForm.paper" placeholder="请选择考试使用的试卷" @change="paperSelect">
                            <el-option
                                    v-for="item in paperList"
                                    v-bind:key="item.paperId"
                                    :label="item.paperName"
                                    :value="item.paperId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择班级" prop="class">
                        <el-select v-model="examForm.class" placeholder="请选择考试的班级">
                            <el-option
                                    v-for="item in classList"
                                    v-bind:key="item.classId"
                                    :label="item.className"
                                    :value="item.classId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起止时间" required>
                        <el-date-picker
                                v-model="examForm.value2"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="考试时间" prop="time" class="time" required>
                        <el-input v-model="examForm.time" size="mini" type="number" @change="examTimeCheck"></el-input>分钟
                    </el-form-item>
                    <el-form-item label="监考模式" prop="model" class="model">
                        <el-select v-model="examForm.examModel" @change="modelChange">
                            <el-option label="随机抓拍" value="随机抓拍"></el-option>
                            <el-option label="现场监考" value="现场监考"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试卷分数" prop="full" class="marks" style="float: left">
                        <el-input v-model="examForm.full" size="mini" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="及格分数" prop="pass" class="marks">
                        <el-input v-model="examForm.pass" size="mini" @blur="passCheck"></el-input>
                    </el-form-item>
                    <el-form-item label="人脸检测" prop="identify">
                        <el-switch v-model="examForm.identify" :width="width"></el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="updateExam" v-if="isSetting">修 改</el-button>
                    <el-button type="primary" @click="submitNewExam" v-if="!isSetting">创 建</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import TchHeader from "../../components/TchHeader";
    import TchAside from "../../components/TchAside";
    import {dateFunction, getLocalDate} from "../../utils/dateUtil";
    export default {
        name: "ExamMange",
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
                    prop:"startTime",
                    order:"descending"
                },
                issearch:false,
                width:50,
                dateTime:null,
                createExamDialog:false,
                examForm:{
                    examId:'',
                    examName:'',
                    paper:'',
                    identify:false,
                    examModel:'随机抓拍',
                    pass:'',
                    full:'',
                    time:'',
                    value2:'',
                    class:''
                },
                paperList:[],
                classList:[],
                isSetting:false,
                rules:{
                    examName:[
                        { required: true, message: '请输入考试名称', trigger: 'blur' },
                        { max: 30, message: '请保证长度在30个字符之内', trigger: 'blur' }
                    ],
                    pass:[
                        { required: true, type: 'string', trigger: 'blur', message:'及格分数不能为空'},
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确数字,可保留两位小数',trigger: 'blur'}
                    ]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        mounted() {
            this.dateTime=getLocalDate()
            this.getData()
        },
        methods:{
            async getData(){
                const res=await this.$http.get('/showTchExam',{
                    params:{
                        prop:this.prop,
                        order:this.order
                    }
                })
                if (res.data.code === '200'){
                    if (res.data.result && res.data.result.list.length > 0){
                        for(let i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].startTime=dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime=dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async handleCurrentChange(val) {
                let res=null;
                if(!this.issearch) {
                    res = await this.$http.get('/showTchExam',{
                        params:{
                            currentPage:val,
                            prop:this.prop,
                            order:this.order
                        }
                    })
                }
                if(this.issearch){
                    res = await this.$http.get('/tchSearchExam',{
                        params:{
                            content:this.search,
                            currentPage:val
                        }
                    })
                }
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for(var i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].startTime=dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime=dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            async switchChange(row) {
                const res = await this.$http.get('/updateIdentify',{
                    params:{
                        examId:row.examId,
                        identify:row.isIdentify
                    }
                })
            },
            handleClose(){
                this.reload()
            },
            modelChange(val){
                if(val==='现场监考') {
                    if ((this.examForm.value2[1].toString().substring(0,15))!==(this.examForm.value2[0].toString().substring(0,15))) {
                        this.$alert('请保证考试日期在同一天之内', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.examForm.examModel = '随机抓拍'
                            }
                        });
                    }
                    let time=((this.examForm.value2[1] - this.examForm.value2[0]) / 1000 / 60).toString()
                    if (time!== this.examForm.time) {
                        this.$alert('请保证开始结束时间与考试时间一致', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.examForm.examModel = '随机抓拍'
                            }
                        });
                    }
                }
            },
            examTimeCheck(val){
                if(val<=0){
                    this.$alert('请输入正确的考试时间', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.examForm.time=1
                        }
                    });
                }
                console.log(this.examForm.value2)
            },
            passCheck(val){
                if(this.examForm.pass>this.examForm.full){
                    this.$alert('及格分数不能大于满分', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.examForm.pass=''
                        }
                    });
                }
                if(this.examForm.pass<0){
                    this.$alert('及格分数不能为负数', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.examForm.pass=''
                        }
                    });
                }
            },
            async createExam() {
                this.isSetting=false
                this.createExamDialog = true
                const res = await this.$http.get('/paper/getTchPaper')
                if(res.data.code==='200'){
                    this.paperList=res.data.result
                }
                const res1=await this.$http.get('/getTchClass')
                if(res1.data.code==='200'){
                    this.classList=res1.data.result
                }

            },
            async paperSelect(val) {
                const res = await this.$http.get('/paper/computeScore?paperId='+val)
                if(res.data.code==='200'){
                    this.examForm.full=res.data.result
                }
            },
            examDelete(row){
                this.$confirm("是否取消考试"+row.examName+"?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async ()=>{
                    const res=await this.$http.get('/deleteExam',{
                        params:{
                            examId:row.examId,
                            classId:row.classId
                        }
                    })
                    if(res.data.code==='200'){
                        this.$message({
                            message: '考试取消成功! ',
                            type: 'success'
                        })
                    }
                    this.reload()
                })
            },
            async submitNewExam() {
                const res = await this.$http.get('/createExam',{
                    params:{
                        examName: this.examForm.examName,
                        paperId: this.examForm.paper,
                        classId:this.examForm.class,
                        startTime: this.examForm.value2[0],
                        endTime: this.examForm.value2[1],
                        examTime: this.examForm.time,
                        examModel: this.examForm.examModel,
                        examFullmarks: this.examForm.full,
                        examPassmarks: this.examForm.pass,
                        isIdentify: this.examForm.identify
                    }
                })
                if(res.data.code==='200'){
                    this.$message({
                        message: '考试创建成功! ',
                        type: 'success'
                    })
                    this.reload()
                }
            },
            async setting(row) {
                await this.createExam()
                this.examForm.examId=row.examId
                this.isSetting=true
                const res = await this.$http.get('/examination/examInfo?examId='+row.examId)
                if(res.data.code==='200'){
                    this.examForm.examName=res.data.result.examName
                    this.examForm.paper=res.data.result.paperId
                    this.examForm.class=res.data.result.classId
                    this.examForm.time=res.data.result.examTime
                    this.examForm.examModel=res.data.result.examModel
                    this.examForm.full=res.data.result.examFullmarks
                    this.examForm.pass=res.data.result.examPassmarks
                    this.examForm.identify=res.data.result.isIdentify
                }
            },
            async updateExam() {
                this.$confirm("确定要修改考试信息吗?","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async ()=> {
                    const res = await this.$http.get('/updateExam', {
                        params: {
                            examId: this.examForm.examId,
                            examName: this.examForm.examName,
                            paperId: this.examForm.paper,
                            classId: this.examForm.class,
                            startTime: this.examForm.value2[0],
                            endTime: this.examForm.value2[1],
                            examTime: this.examForm.time,
                            examModel: this.examForm.examModel,
                            examFullmarks: this.examForm.full,
                            examPassmarks: this.examForm.pass,
                            isIdentify: this.examForm.identify
                        }
                    })
                    if (res.data.code === '200') {
                        this.$message({
                            message: '更新考试信息成功 ',
                            type: 'success'
                        })
                        this.reload()
                    }
                })
            },
            examResult(row){
                this.$router.push({
                    path:'/examResult',
                    query:{
                        examId:row.examId
                    }
                })
            },
            async sortChange(val) {
                this.issearch=false
                this.search=''
                this.sort.prop=val.prop
                this.sort.order=val.order
                const res = await this.$http.get('showTchExam',{
                    params:{
                        prop:val.prop,
                        order:val.order
                    }
                })
                if (res.data.code === '200'){
                    if (res.data.result){
                        for(let i=0;i<res.data.result.list.length;i++){
                            res.data.result.list[i].startTime=dateFunction(res.data.result.list[i].startTime)
                            res.data.result.list[i].endTime=dateFunction(res.data.result.list[i].endTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.pageSize = res.data.result.list.length
                        this.page.total = res.data.result.total
                        this.page.currentPage = 1
                    }
                }
            },
            async searchExam() {
                this.issearch=true
                const res = await this.$http.get('/tchSearchExam?content='+this.search)
                if (res.data.result){
                    for(let i=0;i<res.data.result.list.length;i++){
                        res.data.result.list[i].startTime=dateFunction(res.data.result.list[i].startTime)
                        res.data.result.list[i].endTime=dateFunction(res.data.result.list[i].endTime)
                    }
                    this.tableData = res.data.result.list
                    this.page.pageSize = res.data.result.list.length
                    this.page.total = res.data.result.total
                    this.page.currentPage = 1
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
    }
    .Page{
        float: right;
        margin-top: 20px;
    }

    .btn{
        float: left;
    }

    .dialog{
        .el-input{
            width:320px;
        }
    }
    /deep/
    .el-select .el-input__inner{
        width: 320px;
    }

    .model{
        /deep/
        .el-select .el-input__inner{
            width: 160px;
        }
    }

    .marks{
        height: 30px;
        .el-input{
            width: 60px;
        }
    }
    .time{
        height: 30px;
        .el-input{
            width: 80px;
        }
    }

    .el-select-dropdown__item.selected{
        color: #606266;
        font-weight: 100;
    }

    .el-range-editor.el-input__inner{
        width: 320px;
    }
</style>
