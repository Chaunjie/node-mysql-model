# node-mysql-model
nodejs mysql model

## 安装

使用npm安装

```bash
npm install nodejs-mysql-model -S
```

## 如何引用

先保证先安装了该模块
```javascript
import { model, db } from 'nodejs-mysql-model'
```

## API

### 初始化连接池

在项目入口文件创建一个数据库连接池
```javascript
db.createPool({
  host: 'localhost', // localhost
  user: 'root',
  password: 'qwer123456', // qwer123456
  database: 'apidoc',
  port: 3306
})
```

### 配置model

#### 根据每个表配置model

```javascript
// User.js

import { model } from 'nodejs-mysql-model'

export default new model({
  tableName: 'user',
  attributes: {
    id: {
      type: String
    },
    username: {
      type: String
    },
    password: {
      type: String
    },
    created_at: {
      type: String,
      default: '0'
    },
    updated_at: {
      type: String,
      default: '0'
    },
    user_state: {
      type: Number,
      default: 1
    }
  }
})

// tableName
tableName和数据库表名一致

// attributes
attributes必须和相应表键值一致，type是数据类型(和javascript几种数据类型一致)会在删除或者新增的时候触发检测, default只有在用户触发save方法的时候触发
``` 

### 方法

**使用之前必须先引入相应的model**

```javascript
import User from 'xxx/xxx/User'
```  

**所有的方法都是返回promise对象**

```javascript
User.find().then(res => {}).catch(res => {})
```  

#### find

```javascript
User.find();
User.find(method);
User.find(method, conditions);
```   
参数:

- *string* **method**: 方法名有(all, count, first, field)
- *object* **conditions**: 查询条件有(fields, where, group, having, order, limit)

例子:

```javascript
User.find('all', {where: "year > 2001"}).then(res => {
  // 成功回调
}).catch(res => {
  // 错误回调
})
``` 

##### find各种方式使用 
- **all** 
***获取相应条件所有的记录***
- *return*

```json
{
  qerr: qerr, 
  vals: vals, 
  fields: fields
}
```
例子：
```javascript
User.find('all', {where: "id > '1'", limit: [0, 30]}).then(res => {}).catch(res => {})
```

- **count** 
***获取相应条件记录的条数***
- *return*

```json
{
  qerr: qerr, 
  vals: vals, 
  fields: fields
}
```
例子：
```javascript
User.find('count', {where: "id > '1'", limit: [0, 30]}).then(res => {}).catch(res => {})
```

- **first** 
***获取相应条件的数据第一条***
- *return*

```json
{
  qerr: qerr, 
  vals: vals, 
  fields: fields
}
```
例子：
```javascript
User.find('first', {where: "id > '1'", limit: [0, 30]}).then(res => {}).catch(res => {})
```


- **field** 
***自定义返回数据的字段***
- *return*

```json
{
  qerr: qerr, 
  vals: vals, 
  fields: fields
}
```
例子：
```javascript
User.find('field', {fields: ['username', 'user_state'], where: "id = 3"}).then(res => {}).catch(res => {})
```

##### find方法conditions使用
- **fields** 
***获取相应条件记录并且返回指定字段***
例子：
```javascript
User.find('all', {fields: ['id', 'username', 'password']}).then(res => {}).catch(res => {})
// 等同于 select id, username, password from user
```
- **where** 
***查询条件***
例子：
```javascript
User.find('all', {where: `username="xxx"`}).then(res => {}).catch(res => {})
// 等同于 select * from user where username="xxx"
```
- **group** 
***以分组的方式进行查询***
例子：
```javascript
User.find('all', {group: ['id', 'username']}).then(res => {}).catch(res => {})
// 等同于 select * from user group by id, username
User.find('all', {group: 'id'}).then(res => {}).catch(res => {})
// 等同于 select * from user group by id
```
- **groupDESC** 
***查询条件group 并且desc排序***
例子：
```javascript
User.find('all', {group: ['id', 'username'], groupDESC:true}).then(res => {}).catch(res => {})
// 等同于 select * from user group by id, username desc
```
- **having** 
***查询条件havaing运算***
例子：
```javascript
User.find('all', {fields: ['name', 'COUNT(name)'], group: "name", having: "COUNT(name) = 1"}).then(res => {}).catch(res => {})
// 等同于 select name, count(name) from user group by name having count(name) = 1
```
- **order** 
***order排序***
例子：
```javascript
User.find('all', {order: ['id', 'username']}).then(res => {}).catch(res => {})
// 等同于 select * from user order by id, username
User.find('all', {order: 'id'}).then(res => {}).catch(res => {})
// 等同于 select * from user order by id
```
- **orderDESC** 
***order排序***
例子：
```javascript
User.find('all', {order: ['id', 'username'], orderDESC:true}).then(res => {}).catch(res => {})
// 等同于 select * from user order by id, username desc
User.find('all', {order: 'id', orderDESC:true}).then(res => {}).catch(res => {})
// 等同于 select * from user order by id desc
```
- **limit** 
***查询限制条数***
例子：
```javascript
User.find('all', {limit: [0, 30]}).then(res => {}).catch(res => {})
// 等同于 select * from user limit 0, 30
User.find('all', {limit: '0, 30'}).then(res => {}).catch(res => {})
// 等同于 select * from user limit 0, 30
```


#### save

```javascript
User.save();
User.save(where);
``` 
参数:

- *string* **where**: 设置保存的条件（传了该参数会触发数据库的update）

例子:

```javascript
User.set({
  username: "xxx",
  password: "xxx",
  user_state: "xxx"
})
User.save()
// 新增一条记录

User.set({
  username: "xxx",
  password: "xxx",
  user_state: "xxx"
})
User.save(`id="12"`)
// 修改记录
```   

#### remove

```javascript
User.remove();
User.remove(where);
``` 
参数:

- *string* **where**: 删除条件

案例:

```javascript
User.set({
   id: 1
})
User.remove()
User.remove('id = 1');
// 等同于delete from user where id=1
``` 


#### query

```javascript
User.query(query);
``` 
参数:

- *string* **query**: 需要运行的sql语句

案例:

```javascript
User.query("select * from user").then(res => {}).catch(res => {});
// 等同于 select * from user
``` 

#### saveAll

```javascript
User.saveAll(list);
``` 
参数:

- *array* **list**: 需要一次性添加的数据

案例:

```javascript
const list = [
      {
        id: "1",
        username: "xxx"
      },
      {
        user_id: "2",
        username: "xxxx"
      }
    ]
User.saveAll(list).then(res => {}).catch(res => {});
// 等同于 insert into user (id, username) values ('1', 'xxx'), ('2', 'xxxx')
``` 
