import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import MyExam from '../views/student/MyExam'
import Examination from "../views/student/Examination";
import paperTest from "../views/test/paperTest";
import MyClass from "../views/student/MyClass";
import MyGrade from "../views/student/MyGrade";
import DialogTest from "../views/test/DialogTest";
import PaperManage from "../views/teacher/PaperManage";
import ClassManage from "../views/teacher/ClassManage";
import ClassInfo from "../views/teacher/ClassInfo";
import ApplyList from "../views/teacher/ApplyList";
import ExamMange from "../views/teacher/ExamMange";
import ExamResult from "../views/teacher/ExamResult";
import StatisticalManage from "../views/teacher/StatisticalManage";
import FaceIdentify from "../views/student/FaceIdentify";
import MyMessage from "../views/student/MyMessage";
import MessageManage from "../views/teacher/MessageManage";
import ScreenFull from "../views/test/ScreenFull";
import StudentManage from "../views/admin/StudentManage";
import TeacherManage from "../views/admin/TeacherManage";
import ViewExamProcess from "../views/teacher/ViewExamProcess";
import AdminManage from "../views/supper/AdminManage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/face',
    name: 'Face',
    component: FaceIdentify
  },
  {
    path: '/myExam',
    name: 'MyExam',
    component: MyExam
  },
  {
    path: '/examination',
    name: 'Examination',
    component: Examination
  },
  {
    path: '/myClass',
    name: 'MyClass',
    component: MyClass
  },
  {
    path: '/myGrade',
    name: 'MyGrade',
    component: MyGrade
  },
  {
    path: '/myMessage',
    name: 'MyMessage',
    component: MyMessage
  },
  {
    path: '/paperManage',
    name: 'PaperManage',
    component: PaperManage
  },
  {
    path: '/classManage',
    name: 'ClassManage',
    component: ClassManage
  },
  {
    path: '/classInfo',
    name: 'ClassInfo',
    component: ClassInfo
  },
  {
    path: '/applyList',
    name: 'ApplyList',
    component: ApplyList
  },
  {
    path: '/examMange',
    name: 'ExamMange',
    component: ExamMange
  },
  {
    path: '/messageManage',
    name: 'MessageManage',
    component: MessageManage
  },
  {
    path: '/examResult',
    name: 'ExamResult',
    component: ExamResult
  },
  {
    path: '/statistical',
    name: 'StatisticalManage',
    component: StatisticalManage
  },
  {
    path: '/viewExamProcess',
    name: 'ViewExamProcess',
    component: ViewExamProcess
  },
  {
    path: '/studentManage',
    name: 'StudentManage',
    component: StudentManage
  },
  {
    path: '/teacherManage',
    name: 'TeacherManage',
    component: TeacherManage
  },
  {
    path: '/adminManage',
    name: 'AdminManage',
    component: AdminManage
  },

  {
    path: '/paper',
    name: 'Paper',
    component: paperTest
  },
  {
    path: '/screen',
    name: 'Screen',
    component: ScreenFull
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: DialogTest
  }
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//全局路由前置守卫

router.beforeEach((to, from, next) => {
  if(to.path === '/login'){//如果登录的是login页面，任何人都可以登录，放行
    return next()
  }
  if(localStorage.token){//如果不是登录页面，判断localStorage中是否有token数据，如果有，放行
    return next()
  }
  return next({path:"/login"})//如果不是登录页面，没有token值，就跳转到登录页
})

export default router
