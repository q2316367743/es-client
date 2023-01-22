package xyz.esion.esclient.service;

import cn.hutool.json.JSONObject;
import xyz.esion.esclient.param.FetchParam;

/**
 * @author Esion
 * @since 2023/1/19
 */
public interface FetchService {

    /**
     * 执行一个请求
     * 
     * @param param 请求参数
     * @return 请求结果
     */
    JSONObject fetch(FetchParam param);

}
