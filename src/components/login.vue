<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="head_box">
        <img src="../assets/images/logo1.png" />
      </div>
      <!-- 头像区域 -->

      <!-- 登陆表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="form_box"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" class="demo-ruleForm"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resentLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 登陆表单区域 -->
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登陆用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resentLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败，请检查您的用户名与密码')
        this.$message.success('登陆成功')
        // 把res中的token保存到sessionStorage中用于储存登陆状态
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2b4b6b url("../assets/images/bg1.jpg") no-repeat;
  background-size: 100% 100%;
}

.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  .head_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 120px;
    width: 120px;
    border: 2px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 5px #ddd;
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
