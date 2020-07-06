<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 -->

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @change="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 搜索添加区域 -->
      <!-- 表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="removeUser(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
      <!-- 分页区域 -->
    </el-card>
    <!-- 卡片视图区域 -->

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile" style="width:90%"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile" style="width:90%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
    >
      <p>用户名称：{{userInfo.username}}</p>
      <p>角色名称：{{userInfo.role_name}}</p>
      <p>
        分配角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    // 定义验证邮箱规则
    var checkEamil = (rule, value, callback) => {
      var regEamil = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEamil.test(value)) {
        return callback()
      }
      return callback(new Error('请填写合法邮箱'))
    }
    // 定义验证手机规则
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error('请填写正确手机号码'))
    }
    return {
      // 获取用户列表的数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      totalPage: 0,
      // 控制添加用户对话框显示隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEamil, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框显示隐藏
      editDialogVisible: false,
      // 用户修改用户的数据
      editForm: {},
      // 用户修改表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEamil, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框
      setRoleDialogVisible: false,
      // 当前分配角色的用户数据
      userInfo: {},
      // 所有角色列表数据
      rolesList: [],
      // 分配角色被选中的id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
    // 按下回车搜索 可改为在input上添加change事件
    // document.onkeydown = event => {
    //   if (event.keyCode === 13) {
    //     this.getUserList()
    //   }
    // }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.userList = res.data.users
      this.totalPage = res.data.total
    },
    // 监听当前页个数pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async userStateChange(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败')
      }
      this.$message.success('用户状态修改成功')
    },
    // 添加用户对话框关闭时回调函数
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success(res.meta.msg)
        // 关闭对话框
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 显示修改用户对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改用户对话框关闭时回调函数
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起网络请求
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 删除用户
    async removeUser(id) {
      const confirmResult = await this.$confirm('是否永久删除此用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除操作已取消')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('用户删除失败')
      }
      this.$message.success(res.meta.msg)
      // 判断当前页是否为最后一个数据 如果是重新记载数据页时跳转为上一页
      if (this.userList.length === 1) {
        this.queryInfo.pagenum--
      }
      this.getUserList()
    },
    // 分配角色对话框显示隐藏
    showSetRoleDialog(userInfo) {
      this.userInfo = userInfo
      // 获取角色列表数据
      this.getRolesList()
      this.setRoleDialogVisible = true
    },
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    // 分配角色
    async setRole() {
      if (!this.selectedRoleId) {
        return this.$message.error('请填写分配角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style>
</style>
