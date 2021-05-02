<template>
    <div class="container" v-loading="loading">
        <el-container>
            <el-header style="height: 55px"><TchHeader></TchHeader></el-header>
            <el-container>
                <el-aside width="241px"><TchAside></TchAside></el-aside>
                <el-main>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider></el-divider>
                    <div class="upload">
                        <el-upload
                                class="upload-demo"
                                action="string"
                                :http-request="uploadFile"
                                :before-upload="handleBeforeUnload"
                                accept=".xls,.xlsx"
                                :limit="1"
                                :file-list="fileList"
                                :show-file-list="false">
                            <el-button icon="el-icon-upload" type="primary" >上传试卷</el-button>
                        </el-upload>
                    </div>
                    <div class="filter">
                        <el-input
                                style="width: 300px"
                                v-model="search"
                                placeholder="输入关键字搜索"/>
                        <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="searchPaper">搜索</el-button>
                    </div>
                    <div class="table">
                        <el-table
                                @sort-change="sortChange"
                                :data="tableData"
                                style="width: 100%"
                                stripe
                                size="medium"
                                highlight-current-row
                                :default-sort = "{prop: 'createTime', order: 'descending'}">
                            <el-table-column
                                    prop="paperId"
                                    v-if="false">
                            </el-table-column>
                            <el-table-column
                                    prop="createTime"
                                    label="上传时间"
                                    sortable="custom"
                                    width="210">
                            </el-table-column>
                            <!--当内容过长被隐藏时显示 tooltip-->
                            <el-table-column
                                    :show-overflow-tooltip="true"
                                    prop="paperName"
                                    label="试卷名称"
                                    sortable="custom"
                                    width="280">
                            </el-table-column>
                            <el-table-column
                                    :show-overflow-tooltip="true"
                                    prop="singleNumber"
                                    label="选择题"
                                    width="100">
                                <template slot-scope="scope">
                                     {{scope.row.singleNumber}} 道
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="fillNumber"
                                    label="填空题"
                                    width="100">
                                <template slot-scope="scope">
                                    {{scope.row.fillNumber}} 道
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="judgeNumber"
                                    label="判断题"
                                    width="100">
                                <template slot-scope="scope">
                                     {{scope.row.judgeNumber}} 道
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    align="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-download" @click="download(scope.$index, scope.row)"></el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="deletePaper(scope.$index, scope.row)"></el-button>
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
        name: "PaperManage",
        components: {TchAside, TchHeader},
        inject:['reload'],
        data(){
            return{
                tableData: [],
                fileList:[],
                loading:false,
                search:'',
                page:{
                    total:0,
                    pageSize:0,
                    currentPage:1
                },
                sort:{
                    prop:"createTime",
                    order:"descending"
                },
                issearch:false
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            async getData() {
                const res = await this.$http.get('/tchPaper',{
                    params:{
                        prop:this.sort.prop,
                        order:this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result && res.data.result.list.length > 0) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].createTime = dateFunction(res.data.result.list[i].createTime)
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
                if(!this.issearch) {
                    res = await this.$http.get('/tchPaper',{
                        params:{
                            currentPage:val,
                            prop:this.prop,
                            order:this.order
                        }
                    })
                }
                if(this.issearch){
                    res = await this.$http.get('/tchSearchPaper',{
                        params:{
                            content:this.search,
                            currentPage:val
                        }
                    })
                }
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].createTime = dateFunction(res.data.result.list[i].createTime)
                        }
                        this.tableData = res.data.result.list
                        this.page.currentPage = val
                    }
                }
            },
            handleBeforeUnload(file) {
                if (this.fileList.length > 1) {
                    this.$message.warning("只能上传一个文件");
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
                if (fileType === 'xls' || fileType === 'xlsx') {
                    this.fileList.push(file);
                } else {
                    this.$message.warning("只能上传.xls和.xlsx格式的文件");
                    return false;
                }
            },
            async uploadFile(params) {
                this.loading = true
                var formData = new FormData();
                formData.append('file', params.file);
                const res = await this.$http.post(
                    '/import',
                    formData,
                    {
                        headers: {
                            "content-type": "multipart/form-data",
                            "Authorization": this.$store.state.token
                        }
                    }
                );
                this.loading = false
                if (res.data.code === '200') {
                    this.$message({
                        message: '上传文件成功! ',
                        type: 'success'
                    })
                } else {
                    this.message.error('上传文件失败');
                }
            },
            async download(index, row) {
                const res = await this.$http.get("/export?paperId="+row.paperId)

               /* const link = document.createElement('a')
                link.style.display = 'none'
                link.href = "/exportExcel?paperId="+row.paperId
                link.setAttribute('download',row.paperName+'.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)*/
            },
            async deletePaper(index, row) {

                const res = await this.$http.get('/paperDelete?paperId='+row.paperId)

                if(res.data.code==='200'){
                    this.reload()
                    this.$message({
                        message: '试卷删除成功! ',
                        type: 'success'
                    })
                }
            },
            async searchPaper() {
                this.issearch=true
                const res = await this.$http.get('/tchSearchPaper?content=' + this.search)
                if (res.data.result) {
                    for (var i = 0; i < res.data.result.list.length; i++) {
                        res.data.result.list[i].createTime = dateFunction(res.data.result.list[i].createTime)
                    }
                    this.tableData = res.data.result.list
                    this.page.pageSize = res.data.result.list.length
                    this.page.total = res.data.result.total
                    this.page.currentPage = 1
                }
            },
            async sortChange(val) {
                this.issearch = false
                this.search = ''
                this.sort.prop = val.prop
                this.sort.order = val.order

                const res = await this.$http.get('/tchPaper',{
                    params:{
                        prop:this.sort.prop,
                        order:this.sort.order
                    }
                })
                if (res.data.code === '200') {
                    if (res.data.result) {
                        for (var i = 0; i < res.data.result.list.length; i++) {
                            res.data.result.list[i].createTime = dateFunction(res.data.result.list[i].createTime)
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
    .upload{
        float: left;
        margin-left: 30px;
        margin-top: -10px;
    }

    .filter{
        float: left;
        margin-left: 80px;
        margin-top: -10px;
    }
    .table{
        margin-top: 70px;
        margin-left: 20px;
    }
    .Page{
        float: right;
        margin-top: 20px;
    }
</style>
