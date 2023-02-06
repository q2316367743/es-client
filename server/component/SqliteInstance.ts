import {Database} from "sqlite3";


const instance = new Database('es-client.db', error => {
    if (error) {
        console.error("数据库初始化连接失败");
        console.error(error);
        return;
    }
    // 初始化数据
    console.log("数据库初始化 - 开始");
    instance.all("SELECT * FROM sqlite_master", (error, rows) => {
        let names = rows.map(row => row.tbl_name) as string[];
        if (names.findIndex(name => name === 'db') === -1) {
            // 不存在db，创建
            console.log("创建数据库：db")
            instance.run("create table db\n" +
                "(\n" +
                "    id    integer not null primary key autoincrement,\n" +
                "    value text    not null default ''\n" +
                ");", error => {
                if (error) {
                    console.error("数据库【db】创建失败");
                    throw error;
                } else {
                    console.log("数据库【db】创建成功")
                }
            });
        }
        if (names.findIndex(name => name === 'dict') === -1) {
            console.log("创建数据库：dict")
            instance.run("create table dict\n" +
                "(\n" +
                "    id    integer not null primary key autoincrement,\n" +
                "    key   text    not null default '',\n" +
                "    value text    not null default ''\n" +
                ");", error => {
                if (error) {
                    console.error("数据库【dict】创建失败");
                    throw error;
                } else {
                    console.log("数据库【dict】创建成功")
                }
            });
        }
        console.log("数据库初始化 - 完成");
    })
});

export default instance;