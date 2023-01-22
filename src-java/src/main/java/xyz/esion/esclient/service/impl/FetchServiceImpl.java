package xyz.esion.esclient.service.impl;

import org.springframework.stereotype.Service;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.http.Method;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import xyz.esion.esclient.param.FetchParam;
import xyz.esion.esclient.service.FetchService;

/**
 * @author Esion
 * @since 2023/1/19
 */
@Service
public class FetchServiceImpl implements FetchService {

    @Override
    public JSONObject fetch(FetchParam param) {
        HttpRequest request = HttpRequest.of(param.getUrl());
        // 请求参数
        switch (param.getMethod()) {
            case "GET":
                request.setMethod(Method.GET);
                break;
            case "POST":
                request.setMethod(Method.POST);
                break;
            case "PUT":
                request.setMethod(Method.PUT);
                break;
            case "DELETE":
                request.setMethod(Method.DELETE);
                break;
            case "HEAD":
                request.setMethod(Method.HEAD);
                break;
            default:
                throw new IllegalArgumentException("请求参数未知");
        }
        if (param.getHeaders() != null && param.getHeaders().size() > 0) {
            param.getHeaders().forEach((key, value) -> {
                request.header(key, value);
            });
        }
        if (param.getBody() != null  && param.getBody().size() > 0) {
            request.body(param.getBody().toString());
        }
        HttpResponse response =  request.execute();
        JSONObject result = JSONUtil.parseObj(response.body());
        response.close();
        return result;
    }

}
