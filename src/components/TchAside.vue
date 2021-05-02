<template>
    <div class="menu">
        <el-menu
                :style="contentHeight"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#000033"
                text-color="#fff"
                active-text-color="#FFCC00"
                :default-active="this.$route.path"
                router>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-user-solid"></i>
                    <span>信息管理</span>
                </template>
                <el-menu-item>
                    <el-button type="text" @click="ResetPassword = true" style="color: white">修改密码</el-button>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="/statistical">
                <i class="el-icon-s-platform"></i>
                <span slot="title">统计管理</span>
            </el-menu-item>
            <el-menu-item index="/classManage">
                <i class="el-icon-s-home"></i>
                <span slot="title">班级管理</span>
            </el-menu-item>
            <el-menu-item index="/paperManage">
                <i class="el-icon-document"></i>
                <span slot="title">试卷管理</span>
            </el-menu-item>
            <el-menu-item index="/examMange">
                <i class="el-icon-document-copy"></i>
                <span slot="title">考试管理</span>
            </el-menu-item>
            <el-menu-item index="/messageManage">
                <i class="el-icon-s-comment"></i>
                <span slot="title">消息中心</span>
            </el-menu-item>
        </el-menu>
        <div class="dialog">
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
                    <el-button @click="handlePassClose" size="middle">取 消</el-button>
                    <el-button type="primary" @click="submitPassword" size="middle">修改</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TchAside",
        data(){
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
          return{
              contentHeight:{
                  height:document.body.clientHeight-65+'px'
              },
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
          }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handlePassClose(){
                this.ruleForm.oldPass=''
                this.ruleForm.newPass=''
                this.ruleForm.checkPass=''
                this.ResetPassword=false
            },
            async submitPassword() {
                const res = await this.$http.get('/teacher/tchPasswordModify',{
                    params:{
                        oldPassword:this.ruleForm.oldPass,
                        newPassword:this.ruleForm.newPass
                    }
                })
                if(res.data.code==='200'){
                    this.$message({
                        message: '密码修改成功! ',
                        type: 'success'
                    })
                    this.handleClose()
                }
            }
        }
    }
</script>

<style scoped lang="less">

    .el-menu{
        padding-top: 10px;
        width: 240px
    }

    /deep/
    .el-submenu__icon-arrow{
        display: none;
    }

</style>
