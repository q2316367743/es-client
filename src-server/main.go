package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()

	// 获取一个字典
	r.GET("/db/get", func(context *gin.Context) {

	})

	// 保存一个字典
	r.POST("/db/put", func(context *gin.Context) {

	})

	// 删除一个字典
	r.DELETE("/db/delete", func(context *gin.Context) {

	})

	// 执行一个http请求
	r.POST("/preload/http", func(context *gin.Context) {

	})

	// 监听并在 0.0.0.0:8080 上启动服务
	err := r.Run(":8888")
	if err != nil {
		return
	}
}
