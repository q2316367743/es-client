package main

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

func main() {

	r := gin.Default()

	// 创建一个HTTP客户端
	client := &http.Client{}

	// 执行一个http请求
	r.POST("/api/preload/fetch", func(context *gin.Context) {
		// 读取请求体
		// 读取请求体并解析为map格式
		var requestBody map[string]interface{}
		if err := context.ShouldBindJSON(&requestBody); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"msg":     err.Error(),
			})
			return
		}

		// 将JSON字节数组转换为字符串并返回给客户端
		request, err := http.NewRequest(
			requestBody["method"].(string),
			buildUrl(requestBody["baseURL"].(string), requestBody["url"].(string)),
			bytes.NewBufferString(requestBody["data"].(string)))
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"msg":     err.Error(),
			})
			return
		}

		request.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(request)

		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"msg":     err.Error(),
			})
			return
		}

		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {
				fmt.Println("关闭响应流失败:", err)
			}
		}(resp.Body)

		// 读取响应的内容
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("读取响应失败:", err)
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"success": false,
			"msg":     "",
			"data":    string(body),
		})
	})

	// 处理静态资源
	r.Static("/", "./dist")

	// 监听并在 0.0.0.0:8080 上启动服务
	e := r.Run(":8888")
	if e != nil {
		return
	}
}

func buildUrl(baseUrl string, url string) string {
	if strings.HasSuffix(baseUrl, "/") {
		baseUrl = baseUrl[0 : len(baseUrl)-1]
	}
	if strings.HasPrefix(url, "/") {
		return baseUrl + url
	} else {
		return baseUrl + "/" + url
	}
}
