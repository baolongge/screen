## 一、大屏

- 这里一个基于 Vue3+vite、ECharts + element-plus 框架的 " **数据大屏项目** ".


友情链接：

1.  [Vue3 官方文档](https://composition-api.vuejs.org/zh/api.html#setup)
2.  [element-plus官方文档](https://element-plus.gitee.io/zh-CN/)
3.  [echarts 实例](https://echarts.apache.org/examples/zh/index.html)，[echarts API 文档](https://echarts.apache.org/zh/api.html#echarts)
4.  [vite官方文档](https://cn.vitejs.dev/)


### 项目依赖安装
npm install

### 项目启动
npm run dev                                     

### 目录结构

```bash
.
├── package.json                     # 依赖
├── public                           # html文件及favicon
│── index.html                   # html文件
├── src                              #
│   ├── api                          # 接口目录
│   │   ├── request.js                  # 请求方法
│   │   └── index.js                 # 定义业务接口方法
│   ├── assets                       # 资源目录（图片，css
│   │   ├── element                  # element UI组件的css
│   │   ├── image                    # 图片
│   │   ├── scss                     # 全局样式
│   ├── components                   # 公共组件目录
│   ├── App.vue                  # 根组件
│   └── main.js                  # 入口文件
│   ├── model                        # 数据模型/配置目录
│   ├── router                       # 公共路由目录
│   │   ├── index.js                 # 路由配置项
│   ├── store                        # 公共数据仓库目录
│   ├── util                         # 公共工具目录
│   │   ├── index.js                 # 公共函数集合
│   │   ├── useDraw.js               # 屏幕适配合
│   │   └── storage.js               # 本地存储方法
│   └── views                        # 视图目录
│       ├── home                     # 首页 （待开发）
├── tests                            # 自动化测试框架
└── vite.config.js                   # vue配置文件

```
### 视图路由目录结构建议

```bash
.
├── view-page                               # 功能入口页面（列表或其他）
│   ├── components                          # 页面组件或子页面
│   │   ├── child-page                      # 子页面
│   │   │   ├── components                  # 子页面的组件或者子页面
│   │   │   └── index.vue
│   └── index.vue

```



### 屏幕适配

屏幕适配方案放弃了  rem 方案，使用更流程通用的 `css3：scale` 缩放方案，项目的基准尺寸是 `1920px*1080px`，所以支持用比例屏幕 100% 填充，如果非同比例则会自动计算比例居中填充，不足的部分则留白。实现代码在 `src/utils/userDraw.js` 中，通过 `ref` 指向 `views/index` （待补充）

