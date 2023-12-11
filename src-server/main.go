package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path"

	"github.com/gin-gonic/gin"
)

type Record struct {
	_id   string
	_rev  string
	value map[string]string
}

func main() {
	// _id => record
	var db map[string]Record
	path := path.Join(os.Getenv("HOME"), ".es-client", "db.json")
	content, err := os.ReadFile(path)
	if err != nil {
		content = make([]byte, 0)
	}

	// 初始化数据库
	error := json.Unmarshal(content, &db)
	if error != nil {
		fmt.Println("JSON解析失败")
	}

	r := gin.Default()

	// 获取一个字典
	r.GET("/db/get", func(context *gin.Context) {
		id := context.Params.ByName("_id")
		if id == nil {
			context.JSON(500, gin.H{
				"success": false,
				"error":   "id is nil",
			})
			return
		}
		context.JSON(200, gin.H{
			"success": true,
			"data":    db[id],
		})
	})

	// 保存一个字典
	r.POST("/db/put", func(context *gin.Context) {
		var record Record
		context.BindJSON(&record)
		db[record._id] = record

		// 保存数据
		temp, _ := json.Marshal(db)
		os.WriteFile(path, temp, 0644)

		context.JSON(200, gin.H{
			"success": true,
		})
	})

	// 删除一个字典
	r.DELETE("/db/delete", func(context *gin.Context) {
		id := context.Params.ByName("_id")
		if id == nil {
			context.JSON(500, gin.H{
				"success": false,
				"error":   "id is nil",
			})
			return
		}
	})

	// 执行一个http请求
	r.POST("/preload/http", func(context *gin.Context) {

	})

	// 处理静态资源
	r.Static("/", "./static")

	// 监听并在 0.0.0.0:8080 上启动服务
	e := r.Run(":8888")
	if e != nil {
		return
	}
}
