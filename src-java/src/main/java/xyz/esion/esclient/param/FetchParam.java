package xyz.esion.esclient.param;

import java.io.Serializable;
import java.util.Map;

import cn.hutool.json.JSONObject;
import lombok.Data;

/**
 * @author Esion
 * @since 2023/1/19
 */
@Data
public class FetchParam implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 请求地址
     */
    private String url;

    /**
     * 请求方式
     */
    private String method;

    /**
     * 超时时间
     */
    private Integer timeout;

    /**
     * 请求头
     */
    private Map<String, String> headers;

    /**
     * get请求参数
     */
    private Map<String, String> params;

    /**
     * basic认证信息
     */
    private Auth auth;

    /**
     * 请求体
     */
    private JSONObject body;

    /**
     * 认证信息
     */
    @Data
    public static class Auth implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 用户名
         */
        private String username;

        /**
         * 密码
         */
        private String password;

    }

}
