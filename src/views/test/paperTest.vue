<template>
    <div>
        <el-upload class="upload-demo" action="string" :http-request="uploadFile" :limit="1" :show-file-list="false">
            <el-button size="small" type="primary">上传头像</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "paperTest",
        data() {
            return {
                /* headers:{
                    'Authorization': this.$store.state.token,
                    'Content-Type': 'application/json'
                }*/
            }
        },
        methods: {
           /* handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            async onChangeFile(file) {
                let uploadForm = new FormData()
                uploadForm.append('file', file)

                const res = await this.$http.post('/import',uploadForm)

                console.log(res)
            }*/
            async uploadFile(params) {
                // 可以在上传之前就行文件类型和大小处理
                var formData = new FormData();
                formData.append('file', params.file);
                console.log(params.file);
                const res = await this.$http.post(
                    '/import',
                    formData,
                    {
                        headers: { "content-type": "multipart/form-data",
                            "Authorization": this.$store.state.token}
                    }
                );
                if (res.code !== 0) {
                    return this.message.error('上传头像失败');
                }
                console.log(res);
            },

        }
    }
</script>

<style scoped>

</style>
