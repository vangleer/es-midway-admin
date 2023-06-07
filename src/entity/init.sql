/*
SQLyog v10.2 
MySQL - 5.7.40-log : Database - db1
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db1` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `db1`;

/*Table structure for table `conf` */

DROP TABLE IF EXISTS `conf`;

CREATE TABLE `conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `cKey` varchar(255) NOT NULL COMMENT '配置键',
  `cValue` varchar(255) NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `conf` */

insert  into `conf`(`id`,`createTime`,`updateTime`,`cKey`,`cValue`) values (1,'2023-06-07 14:24:50.000000','2023-06-07 14:24:52.000000','logKeep','31');

/*Table structure for table `log` */

DROP TABLE IF EXISTS `log`;

CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` bigint(20) DEFAULT NULL COMMENT '用户ID',
  `action` varchar(100) NOT NULL COMMENT '行为',
  `ip` varchar(50) DEFAULT NULL COMMENT 'ip',
  `ipAddr` varchar(50) DEFAULT NULL COMMENT 'ip地址',
  `params` text COMMENT '参数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

/*Data for the table `log` */

insert  into `log`(`id`,`createTime`,`updateTime`,`userId`,`action`,`ip`,`ipAddr`,`params`) values (1,'2023-06-07 14:30:00.624001','2023-06-07 14:30:00.624001',NULL,'/v1/open/captcha','127.0.0.1','本机地址',NULL),(2,'2023-06-07 14:53:42.578275','2023-06-07 14:53:42.578275',NULL,'/v1/open/captcha','127.0.0.1','本机地址',NULL),(3,'2023-06-07 14:58:43.937330','2023-06-07 14:58:43.937330',NULL,'/v1/open/captcha','127.0.0.1','本机地址',NULL),(4,'2023-06-07 14:58:50.031453','2023-06-07 14:58:50.031453',NULL,'/v1/open/login','127.0.0.1','本机地址','{\"username\":\"lisi\",\"password\":\"123456\",\"code\":\"0rxk\",\"captchaId\":\"injGbUxzNlmZq0J_z8dkv\"}'),(5,'2023-06-07 14:58:55.637627','2023-06-07 14:58:55.637627',3,'/v1/menu/list/tree','127.0.0.1','本机地址',NULL),(6,'2023-06-07 15:07:18.690101','2023-06-07 15:07:18.690101',3,'/v1/menu/list/tree','127.0.0.1','本机地址',NULL),(7,'2023-06-07 15:09:49.451343','2023-06-07 15:09:49.451343',3,'/v1/menu/list/tree','127.0.0.1','本机地址',NULL);

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '菜单名称',
  `router` varchar(255) DEFAULT NULL COMMENT '菜单地址',
  `perms` varchar(255) DEFAULT NULL COMMENT '权限标识',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '类型 0:目录 1:菜单 2:按钮',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `orderNum` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `viewPath` varchar(255) DEFAULT NULL COMMENT '视图地址',
  `keepAlive` tinyint(4) NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `isShow` tinyint(4) NOT NULL DEFAULT '1' COMMENT '是否显示',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `parentId` int(11) DEFAULT NULL COMMENT '父菜单ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

/*Data for the table `menu` */

insert  into `menu`(`id`,`name`,`router`,`perms`,`type`,`icon`,`orderNum`,`viewPath`,`keepAlive`,`isShow`,`createTime`,`updateTime`,`parentId`) values (5,'系统管理',NULL,NULL,0,'',0,NULL,1,1,'2023-04-06 17:37:31.124419','2023-04-06 17:51:24.000000',NULL),(6,'用户列表','/system/user',NULL,1,'',0,'views/system/User.vue',1,1,'2023-04-06 17:38:03.245365','2023-04-13 13:52:17.000000',5),(10,'新增',NULL,'/system/user/add',2,'',0,NULL,1,1,'2023-04-10 11:23:57.090205','2023-04-10 11:23:57.090205',6),(11,'编辑',NULL,'/system/user/update',2,'',0,NULL,1,1,'2023-04-10 11:31:29.286849','2023-04-10 11:31:29.286849',6),(13,'表格','/table',NULL,1,'',1,'views/data/Table.vue',1,1,'2023-04-11 15:19:23.846998','2023-04-13 13:57:46.000000',14),(14,'数据展示','',NULL,0,'',0,'',1,1,'2023-04-11 15:19:58.088574','2023-04-12 15:51:33.000000',NULL),(15,'表单','/form',NULL,1,'',0,'views/data/Form.vue',1,1,'2023-04-11 15:21:47.185871','2023-04-13 13:57:54.000000',14),(18,'菜单管理','/system/menu',NULL,1,'',0,'views/system/Menu.vue',1,1,'2023-04-13 11:07:03.694504','2023-04-13 13:57:32.000000',5),(19,'角色列表','/system/role',NULL,1,'',0,'views/system/Role.vue',1,1,'2023-04-13 11:07:36.721904','2023-04-13 13:53:37.000000',5),(20,'错误页面','/error/404',NULL,1,'',0,'views/error-page/ErrorPage.vue',1,1,'2023-04-13 11:09:59.431497','2023-04-13 13:58:03.000000',NULL),(21,'菜单','',NULL,0,'',0,'',1,1,'2023-04-13 11:10:13.800494','2023-04-13 11:10:13.800494',NULL),(22,'Menu1','/menu/menu1',NULL,1,'',0,'views/menus/Menu1.vue',1,1,'2023-04-13 11:10:51.003193','2023-04-13 13:58:12.000000',21),(23,'嵌套菜单','',NULL,0,'',0,'',1,1,'2023-04-13 11:11:27.482533','2023-04-13 11:11:27.482533',21),(24,'Nested1','/menu/nested/1',NULL,1,'',0,'views/menus/nested/Nested1.vue',1,1,'2023-04-13 11:11:47.082155','2023-04-13 13:58:25.000000',23),(25,'Nested2','/menu/nested/2',NULL,1,'',0,'views/menus/nested/Nested2.vue',1,1,'2023-04-13 11:12:10.029746','2023-04-13 13:58:31.000000',23),(26,'文件上传','/system/upload',NULL,1,'',0,'views/system/Upload.vue',1,1,'2023-05-18 14:38:50.895877','2023-05-18 14:38:50.895877',5);

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `menuId` varchar(255) DEFAULT NULL COMMENT '名称: 1,2,3',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `role` */

insert  into `role`(`id`,`createTime`,`updateTime`,`name`,`menuId`,`remark`) values (1,'2023-04-10 14:52:36.830227','2023-04-10 14:52:36.830227','测试','6,10,11','测试'),(2,'2023-04-10 14:52:48.785197','2023-04-13 15:22:31.000000','开发','14,13,15,20','22'),(3,'2023-04-13 11:12:59.183775','2023-05-18 14:40:37.000000','系统管理员','5,6,10,11,18,19,26,14,13,15,20,21,22,23,24,25','拥有所有权限');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `realname` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  `nickname` varchar(255) DEFAULT NULL COMMENT '昵称',
  `password` varchar(255) NOT NULL COMMENT '密码(md5加密)',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id(1,2,3)',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`realname`,`nickname`,`password`,`roleId`,`createTime`,`updateTime`) values (1,'zhangsan','张三','小张','e10adc3949ba59abbe56e057f20f883e','2','2023-03-29 18:19:38.000000','2023-04-13 14:40:05.327348'),(3,'lisi','李四',NULL,'e10adc3949ba59abbe56e057f20f883e','3','2023-03-30 14:09:18.137217','2023-04-13 11:13:48.000000'),(5,'Administrator','超级管理员',NULL,'e10adc3949ba59abbe56e057f20f883e','3','2023-04-04 15:38:01.000000','2023-04-13 11:13:55.000000'),(7,'测试','123456',NULL,'e10adc3949ba59abbe56e057f20f883e','1','2023-04-06 15:17:56.898496','2023-04-12 16:05:06.000000'),(8,'wangwu','王五1',NULL,'e10adc3949ba59abbe56e057f20f883e','2','2023-04-06 15:24:29.144577','2023-04-12 16:05:18.000000');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
