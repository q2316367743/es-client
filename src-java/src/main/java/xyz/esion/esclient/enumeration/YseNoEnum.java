package xyz.esion.esclient.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author Esion
 * @since 2022/10/20
 */
@Getter
@RequiredArgsConstructor
public enum YseNoEnum {

    YSE(1),
    NO(0);

    private final Integer value;

}
