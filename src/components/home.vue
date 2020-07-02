<template>
  <div>
    <el-button type="info" round @click="logout">退出登陆</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$message.success('退出登陆成功')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
