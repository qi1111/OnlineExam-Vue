<template>
    <div class="header">
        <div class="sign">
            <div class="logo"></div>
            <span class="name">在线考试系统</span>
        </div>
        <div class="menu">
            <el-menu :default-active="this.$route.path" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="/myExam">我的考试</el-menu-item>
                <el-submenu index="2">
                    <template slot="title">我的班级</template>
                    <el-menu-item index="/myClass">我的班级</el-menu-item>
                    <el-menu-item><el-button type="text" @click="dialogVisible = true"><span class="join">加入班级</span></el-button></el-menu-item>
                </el-submenu>
                <el-menu-item index="/myGrade">查看成绩</el-menu-item>
                <el-menu-item index="/myMessage">我的信息</el-menu-item>
                <el-submenu index="5">
                    <template slot="title">成绩分析</template>
                    <el-menu-item index="5-1">变化趋势</el-menu-item>
                    <el-menu-item index="5-2">薄弱项分析</el-menu-item>
                    <el-menu-item index="5-3">错题集</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="user">
            <div class="message">
                <el-button class="btn" circle @click="showMessage"></el-button>
            </div>
            <div class="userInfo">
                <img src="../assets/images/avatar.png" class="avatar">
                <el-dropdown @command="handleCommand">
                     <span class="el-dropdown-link">
                         {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
                     </span>
                     <el-dropdown-menu slot="dropdown">
                         <el-dropdown-item command="modifyPassword"><el-button type="text" @click="ResetPassword = true"><span class="password">修改密码</span></el-button></el-dropdown-item>
                         <el-dropdown-item command="exit"><el-button type="text" class="logout" @click="logout">退出登录</el-button></el-dropdown-item>
                     </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="dialog">
            <el-dialog title="选择要加入的班级" :visible.sync="dialogVisible" width="30%" center :before-close="handleClose">
                <div class="cascader">
                    <el-cascader ref="cascaderAddr" :props="props" clearable :show-all-levels="false" @change="handleMallCatergoryChange"></el-cascader>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="submitClass">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="ResetPassword" width="30%" center :before-close="handlePassClose">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码 :" prop="oldPass">
                        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" size="mini" placeholder="输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码 :" prop="newPass">
                        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off" size="mini" placeholder="输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码 :" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" size="mini"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="passwordCancel" size="middle">取 消</el-button>
                    <el-button type="primary" @click="submitPassword" size="middle">修改</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    let id = 0;// 声明在外面 如果在data里面声明，props会拿不到值
    export default {
        name: "StuHeader",
        inject:['reload'],
        data() {
            let that = this
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.newPass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                activeIndex: '1',
                name: sessionStorage.getItem("name"),
                value:0,
                dialogVisible:false,
                ResetPassword:false,
                ruleForm: {
                    oldPass: '',
                    newPass:'',
                    checkPass: '',
                },
                rules: {
                    oldPass: [
                        { min: 6, max: 16, message: '请保证长度在 6 到 16 个字符', trigger: 'blur' }
                    ],
                    newPass: [
                        { validator: validatePass, trigger: 'blur' },
                        { min: 6, max: 16, message: '请保证长度在 6 到 16 个字符', trigger: 'blur' },
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' },
                        { min: 6, max: 16, message: '请保证长度在 6 到 16 个字符', trigger: 'blur' }
                    ]
                },
                props: {
                    lazy: true,
                    async lazyLoad(node, resolve) {
                        const {level} = node;

                        if (level === 0) {//一级选择器的生成
                            that.getAcadeMy((list1) => {
                                let arr = list1.map((e) => ({ value: e.acaId, label: e.acaName }))
                                resolve(arr); // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                            })
                        }
                        if(level===1){
                            let { value } = node
                            that.getTeacher({acaId:value}).then(list2=>{
                                let arr = list2.map((e) => ({ value: e.tchId, label: e.tchName }))
                                resolve(arr)
                            })
                        }
                        if(level===2){
                            let { value } = node
                            that.getClass({tchId:value}).then(list3=>{
                                let arr = list3.map((e) => ({ value: e.classId, label: e.className,leaf:true }))
                                resolve(arr)
                            })
                        }
                    }
                }
            };
        },
        methods: {
            handleSelect(key, keyPath) {
            },
            handleCommand(command) {

                switch (command) {
                    case "exit":
                        this.$store.commit("REMOVE_INFO")
                        this.$router.push('/login')
                        break
                }

            },
            handleClose(done) {
                this.$refs.cascaderAddr.checkedValue=""
                this.dialogVisible=false
            },
            handlePassClose(){
                this.ruleForm.oldPass=''
                this.ruleForm.newPass=''
                this.ruleForm.checkPass=''
                this.ResetPassword=false
            },
            handleMallCatergoryChange(value){
                this.value=value[2]
            },
            async submitClass() {
                const res = await this.$http.get('addStuClass?classId='+this.value)
                if(res.data.code==='200'){
                    this.$message({
                        message: '申请加入班级成功! ',
                        type: 'success'
                    })
                }
                this.handleClose()
                this.reload()
            },
            async submitPassword() {
                const res = await this.$http.get('/student/stuModify?oldPassword='+this.ruleForm.oldPass+'&&newPassword='+this.ruleForm.newPass)
                if(res.data.code==='200'){
                    this.$message({
                        message: '密码修改成功! ',
                        type: 'success'
                    })
                    this.handlePassClose()
                }
            },
            cancel(){
                this.$refs.cascaderAddr.checkedValue=""
                this.dialogVisible=false
            },
            passwordCancel(){
                this.ruleForm.oldPass=''
                this.ruleForm.newPass=''
                this.ruleForm.checkPass=''
                this.ResetPassword=false
            },
            async getAcadeMy(callback) {
                let res = await this.$http.get('/academy/getAcademy')
                if (res.data.code === '200') {
                    callback(res.data.result);
                }
            },
            async getTeacher(params) {
                let res = await this.$http.get('/teacher/getTeacher?acaId='+params.acaId)
                if(res.data.code==='200'){
                    return res.data.result
                }
            },
            async getClass(params) {
                let res = await this.$http.get('/getClassByTchId?tchId='+params.tchId)
                if(res.data.code==='200'){
                    return res.data.result
                }
            },
            showMessage(){
                this.$router.push('/myMessage')
            },
            async logout() {
                let res = await this.$http.get('/logout')
            }
        }
    }
</script>

<style lang="less" scoped>

    .header{
        height: 65px;
    }
    .sign{
        float: left;
        width: 200px;
        margin-left: 160px;
    }

    .logo{
        height: 62px;
        width: 80px;
        background: url("../assets/images/stu_logo.gif");
        background-size: 100% 100%;
        float: left;
    }
    .name{
        float: left;
        line-height: 66px;
        font-size: 20px;
        margin-left: -20px;
        color: lightskyblue;
        font-family: 华文楷体;
        font-weight: bolder;
    }

    .menu{
        float: left;
        height: 100%;
    }
    .el-menu{
        height: 55px;
    }
    .el-menu--horizontal>.el-menu-item{
        height: 55px;
        line-height: 65px;
    }
    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item.is-active{
        color: skyblue;
    }

    .user{
        float: left;
        margin-left: 160px;

        .message{
            float: left;
        }
        .userInfo{
            float: left;
        }
    }

    .bell{
        width: 28px;
        height: 23px;
        margin-top: 24px;
    }

    .avatar{
        width: 35px;
        height: 35px;
        margin-top: 15px;
        margin-left: 40px;
        float: left;
    }

    .logout{
        color: red;
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #000000;
        margin-left: 10px;
    }
    .el-dropdown-menu{
        margin-left: 10px;
    }
    .el-icon-arrow-down {
        font-size: 14px;
        line-height: 65px;
    }
    .el-popper[x-placement^=bottom]{
        margin-top: 0;
    }

    /deep/
    .el-menu--horizontal>.el-submenu .el-submenu__title{
        height: 55px;
        line-height: 65px;
    }
    /deep/
    .el-menu--popup{
        min-width: 80px;
        margin-left:15px;
    }
    /deep/
    .el-menu--horizontal>.el-submenu .el-submenu__title:not(.is-disabled):hover,
    .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
        color: skyblue;
    }

    /deep/
    .el-dialog--center .el-dialog__body{
        padding: 0;
    }
    .el-cascader{
        margin-left: 115px;
    }

    .join{
        color: #909399;
    }

    .el-input{
        width: 280px;
    }

    /deep/
    .el-dialog--center .el-dialog__body{
        margin-top: 20px;
    }

    .password{
        color: #606266;
    }

    .btn{
        width: 28px;
        height: 20px;
        background-image: url("../assets/images/bell.png");
        background-size: 100% 100%;
        border: none;
    }
</style>
