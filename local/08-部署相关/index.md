# es-midway-admin

midwayjs基础后台管理系统(八)-部署相关

这篇文章将会介绍 3 种部署方式

1. 使用 pm2 部署
2. 使用 Docker 部署
3. docker-compose 集成

### 部署的流程

整个部署分为几个部分，由于 Midway 是 TypeScript 编写，比传统 JavaScript 代码增加了一个构建的步骤，整个部署的过程如下。

![01](./images/01.png)

由于部署和平台、环境非常相关，下面我们都将以 ubuntu 来演示，其他平台可以视情况参考。

### 准备工作

由于项目依赖mysql和redis，我们需要提前安装好

这里为了方便就直接使用docker了，如果还没安装docker的可以先安装以下，后面也会用到的

- 启动 mysql，这里密码设置的和我们代码一样 root

```sh
sudo docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

mysql 运行起来后我们还需要创建项目中所连的数据库 db1，将初始化数据导入(如果需要的话) `src/entity/init.sql`。

- 命令行导入，使用客户端导入可跳过此步骤

```sh
# 查看mysql运行容器id 2f36c80b04b5
sudo docker ps

# 将sql文件复制到容器种
sudo docker cp /home/escope/app/es-midway-admin/src/entity/init.sql 2f36c80b04b5:/home/init.sql

# 进入mysql容器种
sudo docker exec -it  2f36c80b04b5 /bin/bash

# 登录mysql，这里密码输入root
mysql -u root -p

# 执行sql文件

source /home/init.sql
```

- 启动 redis

```sh
sudo docker run -itd --name redis -p 6379:6379 redis
```

- `sudo docker ps` 查看运行状态

![02](./images/02.png)

## 使用 pm2 部署

### 安装

```sh
npm install pm2 -g
```

### 常用命令

```sh
pm2 start     # 启动一个服务
pm2 list      # 列出当前的服务
pm2 stop          # 停止某个服务
pm2 restart       # 重启某个服务
pm2 delete        # 删除某个服务
pm2 logs          # 查看服务的输出日志
```

### 启动项目

服务器部署后，会直接使用 node 来启动项目，而不是 ts-node，这意味着不再读取 *.ts 文件。

因此第一步需要将ts代码编译成js

运行 `npm run build` 后会在根目录生成dist文件夹

构建完成后，你可以简单的打包压缩，上传到待发布的环境。

> 注意: 一般来说服务器运行必须包含的文件或者目录有 package.json，bootstrap.js，dist，node_modules。

- 安装项目依赖

```sh
sudo npm install
```

- 运行server，`--name server` 为服务的名称

```sh
sudo pm2 start bootstrap.js --name server
```

- `pm2 list` 查看运行状态

![03](./images/03.png)

访问 http://192.168.134.128:7001 有返回结果说明部署成功了

- 开机自启

```sh
sudo pm2 start server  #启动服务

sudo pm2 save # 保存服务

sudo pm2 startup # 把已启动服务加到systemd中

sudo pm2 unstartup systemd # 删除自动启动服务
```

## 使用 Docker 部署

### 编写 Dockerfile，构建镜像

步骤一：在当前目录下新增Dockerfile


```sh
FROM node::16-alpine

WORKDIR /app

ENV TZ="Asia/Shanghai"

COPY . .

# 如果各公司有自己的私有源，可以替换registry地址
RUN npm install --registry=https://registry.npm.taobao.org

RUN npm run build

# 如果端口更换，这边可以更新一下
EXPOSE 7001

CMD ["npm", "run", "start"]
```

步骤二: 新增 .dockerignore 文件（类似 git 的 ignore 文件），可以把 .gitignore 的内容拷贝到 .dockerignore 里面

步骤三：构建 docker 镜像，构建完成后使用 `sudo docker images` 查看

```sh
sudo docker build -t server .
```
![04](./images/04.png)

步骤五：运行 docker 镜像

```sh
sudo docker run -itd --name server -p 7001:7001 server
```
