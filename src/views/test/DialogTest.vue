<template>
    <div class="dialog">
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

        <el-dialog title="选择要加入的班级" :visible.sync="dialogVisible" width="30%">
            <div class="cascader">
                <el-cascader :props="props"></el-cascader>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let id = 0;// 声明在外面 如果在data里面声明，props会拿不到值
    export default {
        name: "DialogTest",
        data() {
            let that = this;
            return {
                dialogVisible:false,
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
                            console.log(value)
                            that.getClass({tchId:value}).then(list3=>{
                                let arr = list3.map((e) => ({ value: e.classId, label: e.className,leaf:true }))
                                console.log(arr)
                                resolve(arr)
                            })
                        }
                    }
                }
            };
        },
        methods:{

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
        }

    }
</script>

<style scoped>

</style>
