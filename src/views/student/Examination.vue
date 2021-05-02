<template>
    <div class="container">
        <el-container>
            <el-header><StuHeader v-if="isPractice"></StuHeader></el-header>
            <div class="item">
                <p class="examName">
                    {{exam.examName}}
                    <span><i class="el-icon-time"></i> {{ `${hour}: ${minute}: ${second}` }}</span>
                </p>
            </div>
            <el-container>
                <el-aside>
                    <div class="examTime" v-if="!isPractice">
                        满分: {{exam.examFullmarks}}分，
                        <i class="iconfont icon-time"></i>考试时间：<b>{{exam.examTime}}分钟</b></div>
                    <div class="aside">
                        <ul class="l-top">
                            <li>
                                <a href="javascript:;"></a>
                                <span>当前</span>
                            </li>
                            <li>
                                <a href="javascript:;"></a>
                                <span>未答</span>
                            </li>
                            <li>
                                <a href="javascript:;"></a>
                                <span>已答</span>
                            </li>
                            <li>
                                <a href="javascript:;"></a>
                                <span>标记</span>
                            </li>
                        </ul>
                        <div class="l-bottom">
                            <template v-if="this.singleQuestions && this.singleQuestions !== 0">
                                <div class="item">
                                    <p>单选题部分</p>
                                    <ul>
                                        <li v-for="(list, index1) in singleQuestions" :key="index1">
                                            <a href="javascript:;"
                                               @click="single(index1)"
                                               :class="{'border': index === index1 && currentType === 0,'bg': bg_flag && singleQuestions[index1].isClick === true}">
                                                <span :class="{'mark': singleQuestions[index1].isMark === true}"></span>
                                                {{index1+1}}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                            <template v-if="this.fillQuestions && this.fillQuestions.length !== 0">
                                <div class="item">
                                    <p>填空题部分</p>
                                    <ul>
                                        <li v-for="(item, index2) in fillQuestions" :key="index2">
                                            <a href="javascript:;" @click="fill(index2)" :class="{'border': index === index2 && currentType === 1,'bg': bg_flag &&fillQuestions[index2].isClick===true}"><span :class="{'mark': fillQuestions[index2].isMark === true}"></span>{{topicCount[0]+index2+1}}</a>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                            <template v-if="this.judgeQuestions && this.judgeQuestions.length !== 0">
                                <div class="item">
                                    <p>判断题部分</p>
                                    <ul>
                                        <li v-for="(list, index3) in judgeQuestions" :key="index3">
                                            <a href="javascript:;" @click="judge(index3)" :class="{'border': index === index3 && currentType === 2,'bg': bg_flag && judgeQuestions[index3].isClick === true}"><span :class="{'mark': judgeQuestions[index3].isMark === true}"></span>{{topicCount[0]+topicCount[1]+index3+1}}</a>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                            <div class="final" @click="close" v-if="isPractice">关闭</div>
                            <div class="final" @click="commit" v-else>结束考试</div>
                        </div>
                    </div>
                </el-aside>
                <el-main>
                    <div class="right">
                        <div class="content">
                            <p class="title">
                                <span v-if="currentType===0&&index===0">一、以下有{{paper.singleNumber}}道单选题，{{title}}，共{{score[0]}}分</span>
                                <span v-if="currentType===1&&index===0">二、以下有{{paper.fillNumber}}道填空题，{{title}}，共{{score[1]}}分</span>
                                <span v-if="currentType===2&&index===0">三、以下有{{paper.judgeNumber}}道判断题，{{title}}，共{{score[2]}}分</span>
                            </p>
                            <p class="topic"><span class="number">{{number}}、</span><span>{{showQuestion}} ({{showScore}}分)</span></p>
                            <template v-if="this.singleQuestions && this.singleQuestions.length !== 0">
                                <div v-if="currentType === 0">
                                    <el-radio-group v-model="radio[index]" @change="getChangeLabel" >
                                        <el-radio :label="answerA" :disabled="isDisable">A. {{showAnswer.choiceA}}</el-radio>
                                        <el-radio :label="answerB" :disabled="isDisable">B. {{showAnswer.choiceB}}</el-radio>
                                        <el-radio :label="answerC" :disabled="isDisable">C. {{showAnswer.choiceC}}</el-radio>
                                        <el-radio :label="answerD" :disabled="isDisable">D. {{showAnswer.choiceD}}</el-radio>
                                    </el-radio-group>
                                    <div class="analysis" v-if="isPractice">
                                        <ul>
                                            <li v-if="radio[index]" class="userAnswer"> <el-tag type="success">你的答案：</el-tag><span class="right">{{radio[index] === '?' ? '未作答':radio[index]}}</span></li>
                                            <li class="trueAnswer"> <el-tag type="success">正确答案：</el-tag><span class="right">{{singleQuestions[index].questionAnswer}}</span></li>
                                            <li class="Explain"><el-tag>题目解析：</el-tag>{{singleQuestions[index].questionExplain == null ? '暂无解析': singleQuestions[index].questionExplain}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                            <template v-if="this.fillQuestions && this.fillQuestions.length !== 0">
                                <div class="fill" v-if="currentType === 1">
                                    <el-input placeholder="请填在此处" :disabled="isDisable"
                                              v-model="fillAnswer[index]"
                                              clearable
                                              @clear="clearFillAnswer"
                                              @blur="fillBG">
                                    </el-input>
                                    <div class="analysis" v-if="isPractice">
                                        <ul>
                                            <li v-if="fillAnswer[index]" class="userAnswer"> <el-tag type="success">你的答案：</el-tag><span class="right">{{fillAnswer[index]==='?' ? '未作答':fillAnswer[index]}}</span></li>
                                            <li class="trueAnswer"> <el-tag type="success">正确答案：</el-tag><span class="right">{{fillQuestions[index].questionAnswer}}</span></li>
                                            <li class="Explain"><el-tag>题目解析：</el-tag>{{fillQuestions[index].questionExplain == null ? '暂无解析': fillQuestions[index].questionExplain}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                            <template v-if="this.judgeQuestions && this.judgeQuestions.length !== 0">
                                <div class="judge" v-if="currentType === 2">
                                    <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel">
                                        <el-radio :label="answerT" :disabled="isDisable">T</el-radio>
                                        <el-radio :label="answerF" :disabled="isDisable">F</el-radio>
                                    </el-radio-group>
                                    <div class="analysis" v-if="isPractice">
                                        <ul>
                                            <li v-if="judgeAnswer[index]" class="userAnswer"> <el-tag type="success">你的答案：</el-tag><span class="right">{{judgeAnswer[index] === '?' ? '未作答' : judgeAnswer[index]}}</span></li>
                                            <li class="trueAnswer"> <el-tag type="success">正确答案：</el-tag><span class="right">{{judgeQuestions[index].questionAnswer}}</span></li>
                                            <li class="Explain"><el-tag>题目解析：</el-tag>{{judgeQuestions[index].questionExplain == null ? '暂无解析': judgeQuestions[index].questionExplain}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="operation">
                            <ul class="end">
                                <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
                                <li @click="marks()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
                                <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
                            </ul>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <div class="cinema" v-if="!isPractice">
            <video
                    id="video"
                    :width="videoWidth"
                    :height="videoHeight"
                    preload
                    autoplay
                    loop
                    muted
            ></video>
            <canvas id="canvas" :width="videoWidth" :height="videoHeight" style="display: none"></canvas>
        </div>
    </div>
</template>

<script>
    import StuHeader from "../../components/StuHeader";
    import screenfull from 'screenfull'
    export default {
        name: "Examination",
        components: {StuHeader},
        inject:['reload'],
        data(){
            return{
                exam:{},//考试信息
                paper:{},//试卷信息
                isPractice:false,
                isDisable:false,
                endTime:null,
                startTime:null,
                index: 0, //全局index
                currentType: 0, //当前题型类型   0--单选题  1--填空题  2--判断题
                radio: [], //保存考生所有选择题的选项
                topicCount: [],//每种类型题目的总数
                score: [],  //每种类型分数的总数
                number: 1, //题号
                title: "请选择正确的选项",

                msec:0,//考试剩余时间毫秒
                time:null,//考试时间毫秒
                hour:0,
                minute:0,
                second:0,

                singleQuestions:{},
                fillQuestions:{},
                judgeQuestions:{},
                singleScore: [],  //单选题每题分数
                judgeScore: [],  //判断题每题分数
                fillScore: [],  //填空题每题分数
                singleList: [],  //单选题答题记录
                judgeList: [],  //判断题答题记录
                fillList: [],  //填空题答题记录
                fillAnswer: [], //保存所有填空题答案
                judgeAnswer: [], //保存所有判断题答案
                topic1Answer: [],  //学生选择题作答编号
                reduceAnswer:[],  //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。

                bg_flag: true, //已答标识符,已答改变背景色
                isFillClick: false, //选择题是否点击标识符
                answerA: 'A',
                answerB: 'B',
                answerC: 'C',
                answerD: 'D',
                answerT: 'T',
                answerF: 'F',
                showQuestion: [], //当前显示题目信息
                showScore:[],
                showAnswer: {}, //当前题目对应的答案选项

                isFullscreen: false,
                over:false,
                videoWidth:120,
                videoHeight:150,
                video:'',
                canvas:'',
                context:'',
                timer:null//定时器
            }
        },
        created() {
            this.isPractice = this.$route.query.isPractice
            if(this.isPractice){
                this.isDisable = true
                this.getViewData()
                //查看考试记录
            }else{
                clearInterval(this.timer)
                this.getData()
                this.getScore()
                //考试
                this.getPaperData()
                this.begin()
                this.screenFull()
                this.getCompetence()
                window.onresize = ()=> {
                    if(!this.over) {
                        this.checkFull()
                    }
                }
            }
        },
        methods: {
            screenFull(){
                if (!screenfull.isEnabled) {
                    this.$message({
                        message: '不支持全屏',
                        type: 'warning'
                    })
                    return false
                }
                screenfull.toggle().catch((e) => {})
                this.isFullscreen = true
            },
            checkFull(){
                //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
                //火狐浏览器
                let isFull = document.mozFullScreen ||
                    document.fullScreen ||
                    //谷歌浏览器及Webkit内核浏览器
                    document.webkitIsFullScreen ||
                    document.webkitRequestFullScreen ||
                    document.mozRequestFullScreen ||
                    document.msFullscreenEnabled;
                if(!isFull) {
                    this.$confirm('是否要退出全屏模式，退出后将无法继续考试?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.isFullscreen=false
                        this.store()
                        this.closeCompetence()
                    }).catch(() => {
                        screenfull.toggle()
                    });
                }
            },

            getData(){
                let _this = this
                _this.exam=this.$store.getters.getExamInfo
                _this.startTime=new Date().getTime()
                _this.paper=this.$store.getters.getPaperInfo
                _this.singleQuestions=this.paper.singleQuestions
                _this.fillQuestions=this.paper.fillQuestions
                _this.judgeQuestions=this.paper.judgeQuestions
                _this.topicCount[0]=this.paper.singleNumber
                _this.topicCount[1]=this.paper.fillNumber
                _this.topicCount[2]=this.paper.judgeNumber
            },
            getScore(){
                let singles=0
                let fills=0
                let judges=0
                for(let i=0;i<this.singleQuestions.length;i++){
                    this.singleScore[i]=this.singleQuestions[i].questionScore
                    singles+=this.singleQuestions[i].questionScore
                }
                this.score.push(singles)
                for(let i=0;i<this.fillQuestions.length;i++){
                    this.fillScore[i]=this.fillQuestions[i].questionScore
                    fills+=this.fillQuestions[i].questionScore
                }
                this.score.push(fills)
                for(let i=0;i<this.judgeQuestions.length;i++){
                    this.judgeScore[i]=this.judgeQuestions[i].questionScore
                    judges+=this.judgeQuestions[i].questionScore
                }
                this.score.push(judges)
            },
            async getViewData() {
                let recordId = this.$route.query.recordId; //考试记录id
                const res = await this.$http.get('/examRecord?recordId='+recordId)

                this.fillList = res.data.result.examinationRecord.fillAnswer
                this.judgeList = res.data.result.examinationRecord.judgeAnswer
                this.singleList = res.data.result.examinationRecord.singleAnswer

                this.exam=res.data.result.examination

                //问题详情
                this.singleQuestions=res.data.result.singleQuestions
                this.fillQuestions=res.data.result.fillQuestions
                this.judgeQuestions=res.data.result.judgeQuestions

                //把每种题型数量及其分数
                this.topicCount.push(this.singleQuestions.length)
                this.topicCount.push(this.fillQuestions.length)
                this.topicCount.push(this.judgeQuestions.length)

                this.getScore()

                //单选题答题记录
                for (let i = 0; i < this.singleList.length;i+=2 ) {
                    this.radio.push(this.singleList[i])
                }
                //判断题答题记录
                for(let i=0;i<this.judgeList.length;i+=2){
                    this.judgeAnswer.push(this.judgeList[i])
                }
                //填充填空题答题记录
                let fills=''
                for(let i=0;i<this.fillList.length;i++){

                    if(this.fillList[i]==='*'){
                        this.fillAnswer.push(fills)
                        fills=''
                        continue
                    }
                    if(this.fillList[i]!=='*'){
                        fills+=this.fillList[i]
                    }
                    if(i===this.fillList.length-1){
                        this.fillAnswer.push(fills)
                    }
                }
                //初始化
                let dataInit = this.singleQuestions
                this.number = 1
                if(this.topicCount[0] !== 0){
                    // 有选择题，就跳到选择题的第一题
                    this.single(0)
                    this.currentType = 0
                }else if(this.topicCount[1] !== 0){
                    dataInit = this.fillQuestions
                    this.fill(0)
                    this.currentType = 1
                }else if(this.topicCount[2] !== 0){
                    dataInit=this.judgeQuestions
                    this.judge(0)
                    this.currentType = 2
                }
                this.showQuestion = dataInit[0].questionContent
                this.showAnswer = dataInit[0]
            },
            getPaperData(){

                //记录单选题答案
                for(let i=0;i<this.singleQuestions.length;i++){
                    this.topic1Answer[i] = null
                }
                //记录判断题答案
                for(let i=0; i<this.judgeQuestions.length;i++){
                    this.judgeAnswer[i] = null
                }
                //记录填空题答案
                for(let i=0;i<this.fillQuestions.length;i++){
                    this.fillAnswer[i]=null
                }

                let dataInit = this.singleQuestions
                this.number = 1
                if(this.topicCount[0] !== 0){
                    // 有选择题，就跳到选择题的第一题
                    this.single(0)
                    this.currentType = 0
                }else if(this.topicCount[1] !== 0){
                    dataInit = this.fillQuestions
                    this.fill(0)
                    this.currentType = 1
                }else if(this.topicCount[2] !== 0){
                    dataInit=this.judgeQuestions
                    this.judge(0)
                    this.currentType = 2
                }
                this.showQuestion = dataInit[0].questionContent
                this.showAnswer = dataInit[0]
            },
            begin(){
                this.time = (Date.parse(new Date()) + ((this.exam.examTime * 60)) * 1000)
                // 开始执行倒计时
                this.countdown()
                this.$message({
                    type: 'success',
                    message: '开始答题'
                })
            },
            countdown(){
                const end = this.time; // 定义结束时间
                const now = Date.parse(new Date()); // 获取本地时间
                const msec = end - now; // 定义总共所需的时间
                this.msec=msec
                // 将时间戳进行格式化
                let hr = parseInt(msec / 1000 / 60 / 60 % 24);
                let min = parseInt(msec / 1000 / 60 % 60);
                let sec = parseInt(msec / 1000 % 60);
                this.hour=hr
                this.minute=min
                this.second=sec
                // 倒计时结束时的操作
                const that = this;
                if (this.hour === 0 && this.minute === 0 && this.second === 0) {
                    this.commit()
                    this.hour = 0;
                    this.minute = 0;
                    this.second = 0;
                } else {
                    // 如时间未归零则继续在一秒后执行
                    this.hour = hr > 9 ? hr : '0' + hr;
                    this.minute = min > 9 ? min : '0' + min;
                    this.second = sec > 9 ? sec : '0' + sec;
                    setTimeout(that.countdown, 1000)
                }
            },

            single(index){
                this.index = index
                this.currentType = 0
                this.title = "请选择正确的选项"
                let Data = this.singleQuestions
                this.showQuestion = Data[this.index].questionContent //获取题目信息
                this.showScore=Data[this.index].questionScore
                this.showAnswer = Data[this.index]
                this.number = this.index + 1
            },
            fill(index){
                this.index = index
                this.currentType = 1
                this.title = "请在横线处填写答案，多个空用,分隔"
                let Data = this.fillQuestions
                this.showQuestion = Data[index].questionContent //获取题目信息
                this.number = this.topicCount[0] + index + 1
            },
            judge(index) {
                this.index = index
                this.currentType = 2
                this.title = "请作出正确判断"
                let Data = this.judgeQuestions
                this.showQuestion = Data[index].questionContent //获取题目信息
                this.number = this.topicCount[0]+ this.topicCount[1] + index + 1
            },
            getChangeLabel(val) { //获取选择题作答选项
                this.radio[this.index] = val //当前选择的序号
                if(val) {
                    let data = this.singleQuestions
                    this.bg_flag = true
                    data[this.index]["isClick"] = true
                }else{
                    this.bg_flag = false
                }
                /* 保存学生答题选项 */
                this.topic1Answer[this.index] = val
            },
            getJudgeLabel(val) {  //获取判断题作答选项
                this.judgeAnswer[this.index] = val
                if(val) {
                    let data = this.judgeQuestions
                    this.bg_flag = true
                    data[this.index]["isClick"] = true
                }else{
                    this.bg_flag = false
                }
            },
            // 填空题，清空答案时校验，主要是标记该题是否已答
            clearFillAnswer(){
                // 校验逻辑和失去焦点事件是一样的
                this.fillBG()
            },
            fillBG() { //填空题已答题目 如果已答该题目,设置第四个元素为需要填空的个数
                //只要填了一个空，就是答题了，没有作答，就是null或者空串
                if(this.fillAnswer[this.index]) {
                    this.bg_flag=true
                    let data=this.fillQuestions
                    data[this.index]["isClick"]=true
                }else{
                    //没有作答
                    this.bg_flag=false
                }

            },
            previous() { //上一题
                this.index --
                // 当前题号，从1开始
                this.number --
                // 判断点了上一题之后，处于何种题型
                if(this.number >= 1 && this.number <= this.topicCount[0]){
                    // 如果是填空题的第一题，点了上一题
                    if(this.currentType === 1){
                        // 更新为单选题的最后一题
                        this.index = this.topicCount[0] - 1
                    }
                    // 更新题型，为单选题
                    this.currentType = 0
                    console.log(this.index)
                }else if(this.number > this.topicCount[0] && this.number <= (this.topicCount[0] + this.topicCount[1])){
                    // 如果是判断题的第一题，点了上一题
                    if(this.currentType === 2){
                        // 更新为填空题的最后一题
                        this.index = this.topicCount[1] - 1
                    }
                    // 判断题
                    this.currentType = 1
                }else{
                    // 如果是在单选题的第一题，点了上一题，则会进入判断题的最后一题
                    if(this.number < 1){
                        //则到了判断题的最后1题
                        this.index = this.topicCount[2] - 1
                        // 更新题号
                        this.number = this.topicCount[0] + this.topicCount[1] + this.topicCount[2]
                    }
                    //判断
                    this.currentType = 2
                }
                switch(this.currentType) {
                    case 0:
                        this.single(this.index)
                        break
                    case 1:
                        this.fill(this.index)
                        break
                    case 2:
                        this.judge(this.index)
                        break
                }
            },
            next() { //下一题
                this.index ++
                // 当前题号，从1开始
                this.number ++
                //如果是判断题的最后一题，点了下一题
                if(this.number > (this.topicCount[0] + this.topicCount[1] + this.topicCount[2])){
                    //则到了单选题的第1题
                    this.index = 0
                    // 更新题号
                    this.number = 1
                }
                // 判断点了下一题之后，处于何种题型
                if(this.number >= 1 && this.number <= this.topicCount[0]){
                    // 单选
                    this.currentType = 0
                }else if(this.number > this.topicCount[0] && this.number <= (this.topicCount[0] + this.topicCount[1])){
                    // 如果是单选的最后一题，点了下一题
                    if(this.currentType === 0){
                        // 更新为填空题的第一题
                        this.index = 0
                    }
                    // 填空
                    this.currentType = 1
                }else if(this.number > (this.topicCount[0] + this.topicCount[1]) && this.number <= (this.topicCount[0] + this.topicCount[1] + this.topicCount[2])){
                    // 如果是填空题的最后一题，点了下一题
                    if(this.currentType === 1){
                        // 更新为判断题的第一题
                        this.index = 0
                    }
                    // 判断题
                    this.currentType = 2
                }
                switch(this.currentType) {
                    case 0:
                        this.single(this.index)
                        break
                    case 1:
                        this.fill(this.index)
                        break
                    case 2:
                        this.judge(this.index)
                        break
                }
            },
            marks() { //标记功能
                switch(this.currentType) {
                    case 0:
                        this.singleQuestions[this.index]["isMark"] = this.singleQuestions[this.index]["isMark"] !== true;
                        break
                    case 1:
                        this.fillQuestions[this.index]["isMark"] = this.fillQuestions[this.index]["isMark"] !== true //填空题标记
                        break
                    case 2:
                        this.judgeQuestions[this.index]["isMark"] = this.judgeQuestions[this.index]["isMark"] !== true //判断题标记
                        break
                }
            },
            commit() {
                let _this=this;
                if(this.isFullscreen && this.msec !== 0) {
                    this.$confirm("考试结束时间未到,是否提前交卷","友情提示",{
                        confirmButtonText: '立即交卷',
                        cancelButtonText: '再检查一下',
                        type: 'warning'
                    }).then(() => {
                        this.over=true
                        screenfull.toggle()
                        this.isFullscreen=false
                        _this.store()
                        this.closeCompetence()
                    }).catch(() => {
                        this.$message.warning('请继续作答!');
                    })
                }else{
                    this.store()
                    this.closeCompetence()
                }
            },
            store(){
                let that=this
                //计算考试用了多长时间
                this.endTime = new Date().getTime()
                //相差的毫秒数
                let ms = this.endTime - this.startTime
                //相差的分钟数
                let joinTimeCost = Math.round(ms/1000.0/60)
                //最终得分
                let finalScore = 0
                /* 计算单选题总分 */
                let topic1Answer = this.topic1Answer
                let singleAnswer = "";
                topic1Answer.forEach((element,index) => {
                    let right = element
                    if(!element){
                        right = '?'
                    }
                    // 题与题之间用*号分隔
                    singleAnswer += right +"*";
                    if(right === this.singleQuestions[index].questionAnswer) { // 当前选项与正确答案对比
                        finalScore += (this.singleScore[index] - 0)  // 计算总分数
                    }
                })
                //去掉最后一个星号
                singleAnswer=(singleAnswer.substring(singleAnswer.length-1)==='*')?singleAnswer.substring(0,singleAnswer.length-1):singleAnswer
                /*计算填空题总分*/
                let topic2Answer=this.fillAnswer
                let fillAnswers=""
                topic2Answer.forEach((element,index)=>{
                    let right=element
                    if(!element){
                        right='?'
                    }
                    fillAnswers+=right+"*"
                    if(right===this.fillQuestions[index].questionAnswer){
                        finalScore+=(this.fillScore[index]-0)
                    }
                })
                fillAnswers=(fillAnswers.substring(fillAnswers.length-1)==='*')?fillAnswers.substring(0,fillAnswers.length-1):fillAnswers
                /** 计算判断题总分 */
                let topic3Answer = this.judgeAnswer
                let joinAnswerJudge = ""
                topic3Answer.forEach((element,index) => {
                    let right = element
                    if(!element){
                        right = '?'
                    }
                    joinAnswerJudge += right + "*"
                    if(right === this.judgeQuestions[index].questionAnswer) { // 当前选项与正确答案对比
                        finalScore += (this.judgeScore[index] - 0) // 计算总分数
                    }
                })

                joinAnswerJudge=(joinAnswerJudge.substring(joinAnswerJudge.length-1)==='*')?joinAnswerJudge.substring(0,joinAnswerJudge.length-1):joinAnswerJudge

                let examResult=0
                if(finalScore>=this.exam.examPassmarks){
                    examResult=1
                }
                let data={
                    examId:this.exam.examId,
                    costTime: joinTimeCost,
                    finalScore: finalScore,
                    fillAnswer:  fillAnswers,   //考生填空题答案
                    judgeAnswer: joinAnswerJudge,   //考生判断题答案
                    singleAnswer: singleAnswer,  //考生单选题答案
                    examResult:examResult
                }
                that.addExamRecord(data)

            },
            async addExamRecord(data) {
                const res = await this.$http.get('/addExamRecord',{
                    params:{
                        examId:data.examId,
                        costTime:data.costTime,
                        examScore:data.finalScore,
                        singleAnswer:data.singleAnswer,
                        fillAnswer:data.fillAnswer,
                        judgeAnswer:data.judgeAnswer,
                        examResult:data.examResult
                    }
                })
                if(res.data.code==='200'){
                    this.$store.commit("REMOVE_EXAM")
                    this.$router.push('/myGrade')
                }else{
                    this.$message.error('交卷失败!');
                }
            },
            close(){
                this.$router.push('/myGrade')
            },
            //初始化摄像头 获取摄像头权限
            getCompetence() {
                let self = this;
                navigator.getUserMedia  = navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia;
                if (navigator.getUserMedia) {
                    //调用用户媒体设备, 访问摄像头
                    navigator.getUserMedia({video : {width: this.videoWidth, height: this.videoHeight}},function(stream) {
                        var video = document.querySelector('video');
                        video.srcObject = stream;
                        self.streamPicture = stream; //关闭摄像头需要用
                        video.onloadedmetadata = function(e) {
                            video.play();
                        };
                    }, function(err) {
                        console.log("访问用户媒体设备失败: " + err.name);
                    })
                    let count=0
                    this.timer = setInterval( () => {
                        count+=1
                        this.takePhoto(count)
                    }, 1000*60*5)
                } else {
                    self.$message.error('不支持访问用户媒体');
                }
            },
            takePhoto(count) {
                this.canvas = document.getElementById('canvas');
                this.context = this.canvas.getContext('2d');
                this.video = document.getElementById('video')
                this.context.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

                this.canvas.toBlob(async (blob)=>{
                    var formData = new FormData();
                    formData.append('file', blob);
                    formData.append('count',count)
                    formData.append('examId',this.exam.examId)
                    const res=await this.$http.post('/uploadStuExamProcess',formData)
                })
            },
            closeCompetence(){
                this.video.srcObject.getTracks()[0].stop()
            }
        },
        destroyed() {
            clearInterval(this.timer)
            this.timer=null
        }
    }
</script>

<style scoped lang="less">

    .el-header {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        width: 320px;
        height: 560px;
        margin: 10px 10px 0px 10px;
    }

    .el-main {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .mark {
        position: absolute;
        width: 4px;
        height: 4px;
        content: "";
        background-color: red;
        border-radius: 50%;
        top: 0px;
        left: 22px;
    }
    .bg {
        background-color: #5188b8 !important;
    }
    .border {
        position: relative;
        border: 1px solid #FF90AA !important;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .item{
        margin-top: 10px;
        background-color: #d9d9d9;
        line-height: 30px;
    }
    .examName{
        margin-left: 200px;
        line-height: 8px;
        font-size: 14px;
        span{
            margin-left: 900px;
        }
    }
    .examTime{
        font-size: 14px;
        margin-left: 30px;
    }

    .aside .l-top {
        display: flex;
        justify-content: space-around;
        padding: 16px 0;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 10px;
        background-color: #ffffff;
        width: 290px;
    }
    .aside .l-top li:nth-child(2) a {
        border: 1px solid #eee;
    }
    .aside .l-top li:nth-child(3) a {
        background-color: #5188b8;
        border: none;
    }
    .aside .l-top li:nth-child(4) a {
        position: relative;
        border: 1px solid #eee;
    }
    .aside .l-top li:nth-child(4) a::before {
        width: 4px;
        height: 4px;
        content: " ";
        position: absolute;
        background-color: red;
        border-radius: 50%;
        top: 0px;
        left: 16px;
    }
    .aside .l-top li {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .aside .l-top li a {
        display: inline-block;
        padding: 10px;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid #FF90AA;
    }
    .aside .l-top span{
        font-size: 13px;
    }

    .l-bottom .final {
        cursor: pointer;
        display: inline-block;
        text-align: center;
        background-color: rgb(39, 118, 223);
        width: 240px;
        margin: 20px 0px 20px 10px;
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        margin-top: 22px;
    }
    .l-bottom {
        border-radius: 4px;
        background-color: #fff;
        width:290px
    }
    .l-bottom .item p {
        margin-bottom: 15px;
        margin-top: 10px;
        color: #000;
        margin-left: 10px;
        letter-spacing: 2px;
        font-size: 13px;
    }
    .l-bottom .item li {
        display: flex;
        width: 15%;
        margin-left: 5px;
        margin-bottom: -8px;
    }
    .l-bottom .item {
        display: flex;
        flex-direction: column;
    }
    .l-bottom .item ul {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        /*justify-content: space-around;*/
        float: left;
        flex-wrap: wrap;
        margin-left: -30px;
    }
    .l-bottom .item ul li a {
        position: relative;
        justify-content: center;
        display: inline-flex;
        align-items: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid #eee;
        color: #000;
        font-size: 16px;
    }

    .content {
        padding: 0px 20px;
    }
    .content .title{
        position: absolute;
        top:50px;
        left: 380px;
        span{
            font-weight: bold;
        }
    }
    .content .topic {
        position: absolute;
        top:100px;
        left: 400px;
    }
    .right .content {
        background-color: #fff;
        margin: 10px;
        height: 470px;
    }
    .content .el-radio-group label {
        color: #000;
        margin: 10px 0px;
    }
    .content .el-radio-group {
        display: flex;
        flex-direction:column;
        margin-top: 110px;
        margin-left: -10px;
    }

    .fill .el-input {
        display: inline-flex;
        width: 150px;
        margin-top: 90px;
        margin-left: -800px;
    }
    /deep/
    .el-input__inner {
        height: 30px;
        border: none;
        border-bottom: 1px solid #000000;
        border-radius: 0;
        width: 600px;
        line-height: 30px;
    }

    /deep/
    .el-radio__input{
        margin-left: 36px;
        float: left;
    }
    /deep/
    .el-radio__label{
        margin-left: 5px;
        float: left;
    }

    .operation .end li:nth-child(2) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgb(39, 118, 223);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: #fff;
        font-size: 10px;
    }
    .operation .end li {
        cursor: pointer;
        margin: 0 70px;
        list-style:none;
    }
    .operation {
        background-color: #fff;
        border-radius: 4px;
        padding: 10px 0px;
        margin-right: 10px;
    }
    .operation .end {
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(39, 118, 223);
        position: absolute;
        top:490px;
        left: 290px;
    }

    .analysis li{
        font-size: 12px;
        list-style: none;
    }

    .analysis .userAnswer{
        position: absolute;
        top: 320px;
        left: 380px;
    }
    .analysis .trueAnswer{
        position: absolute;
        top: 360px;
        left: 380px;
    }
    .analysis .Explain{
        position: absolute;
        top: 400px;
        left: 380px;
    }

    .cinema{
        width: 120px;
        height: 150px;
        top: 130px;
        right: 100px;
        position: absolute;
    }

</style>
