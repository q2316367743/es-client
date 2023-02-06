package main

import (
	"es-client/router"
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	// 静态资源映射
	r.Static("/", "./public")
	// 注册路由
	router.FetchRouter(r)
	// 服务器启动
	fmt.Println("服务运行在 http://localhost:3000")
	r.Run(":3000") // listen and serve on 0.0.0.0:8080
}
