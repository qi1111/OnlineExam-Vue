<template>
    <div class="container" v-loading="loading">
        <div class="login_box">
            <h3>在线考试系统</h3>
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" show-password autocomplete="off" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <label class="label_role">账号类型 :</label>
                <el-radio-group v-model="loginForm.role">
                    <el-radio label="student">学生</el-radio>
                    <el-radio label="teacher">教师</el-radio>
                    <el-radio label="admin">管理员</el-radio>
                </el-radio-group>
                <el-button type="primary" @click="submitForm('loginForm')" class="login_btn">登录</el-button>
            </el-form>
        </div>
        <div class="dialog">
            <el-dialog
                    :visible.sync="dialogVisible"
                    width="40%"
                    :show-close="false">
                <FaceIdentify></FaceIdentify>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import FaceIdentify from "./student/FaceIdentify";
export default {
    name: 'Login',
    components: {FaceIdentify},
    inject:['reload'],
    data () {
        return {
            dialogVisible:false,
            loginForm: {
                username: '',
                password: '',
                role: 'student'
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 6, max: 16, message: '请保证长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '请保证长度在 6 到 16 个字符', trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
    methods: {
        submitForm (formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    const _this=this
                    _this.loading=true
                    const res = await this.$http.post('/login',this.loginForm)
                    if(res.data.code==="200"){
                        const jwt=res.headers['authorization']
                        const userName=res.data.result.username
                        const name=res.data.result.name
                        //把数据共享出去
                        _this.$store.commit("SET_TOKEN",jwt)
                        _this.$store.commit("SET_USERNAME",userName)
                        _this.$store.commit("SET_NAME",name)

                        switch (this.loginForm.role) {
                            case 'student':
                                this.$store.commit("SET_ISLOGIN",true)
                                this.dialogVisible=true
                                break
                            case 'teacher':
                                _this.$router.push('/statistical')
                                break
                            case 'admin':
                                if(this.loginForm.username==='supper'){
                                    _this.$router.push('/adminManage')
                                }else {
                                    _this.$router.push('/studentManage')
                                }
                                break
                        }
                        this.$message({
                            message: '登录成功! ',
                            type: 'success'
                        })
                    }
                    else{
                        this.$message.error('账号或密码错误!');
                        _this.$router.push("/login")
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            this.loading=false
        },
    }
}
</script>

<style lang="less" scoped>
   .container{
       height: 100%;
       min-width: 1280px;
       background: url("../assets/images/login_bg2.png");
       background-size: 100% 100%;
   }

    .login_box{
        width: 280px;
        height: 270px;
        padding: 15px 25px;
        background-color: white;

        position: fixed;
        right: 700px;
        top: 15%;
    }

    .label_role{
        font-size: 14px;
        margin-right: 10px;
    }

    .login_btn{
        width: 100%;
        height: 30px;
        margin-top: 20px;
        line-height: 0;
    }

   /deep/
   .el-input__inner{
       height: 40px;
       border: none;
       border-bottom: solid 1px #000000;
       border-radius: 0;
   }

   /deep/
       /*角色单选按钮*/
   .el-radio__label{
       padding-left: 5px;
   }
   /deep/
   .el-radio{
       margin-right: 20px;
   }

   /deep/
   .el-dialog__header{
       padding: 0;
   }

</style>
