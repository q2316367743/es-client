package xyz.esion.esclient.global;

import lombok.Data;
import xyz.esion.esclient.enumeration.ResultCodeEnum;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2022/9/25
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 响应码
     */
    private Integer code;

    /**
     * 响应消息
     */
    private String msg;

    /**
     * 数据
     */
    private T data;

    public static Result<Void> success() {
        Result<Void> result = new Result<>();
        result.setCode(ResultCodeEnum.SUCCESS.getCode());
        result.setMsg(ResultCodeEnum.SUCCESS.getMessage());
        return result;
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(ResultCodeEnum.SUCCESS.getCode());
        result.setMsg(ResultCodeEnum.SUCCESS.getMessage());
        result.setData(data);
        return result;
    }

    public static Result<Void> error() {
        Result<Void> result = new Result<>();
        result.setCode(ResultCodeEnum.ERROR.getCode());
        result.setMsg(ResultCodeEnum.ERROR.getMessage());
        return result;
    }

    public static Result<Void> error(String msg) {
        Result<Void> result = new Result<>();
        result.setCode(ResultCodeEnum.ERROR.getCode());
        result.setMsg(msg);
        return result;
    }

    public static Result<Void> error(ResultCodeEnum codeEnum) {
        Result<Void> result = new Result<>();
        result.setCode(codeEnum.getCode());
        result.setMsg(codeEnum.getMessage());
        return result;
    }

}
