package xyz.esion.esclient.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author Esion
 * @since 2022/10/20
 */
@Getter
@RequiredArgsConstructor
public enum ResultCodeEnum {

    SUCCESS(200, "成功"),
    ERROR(500, "失败"),
    AUTH_ERROR(401, "认证失败"),
    AUTH_OVERDUE(403, "认证过期");

    private final Integer code;

    private final String message;

}
