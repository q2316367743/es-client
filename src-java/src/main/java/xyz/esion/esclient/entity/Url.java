package xyz.esion.esclient.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gitee.sunchenbin.mybatis.actable.annotation.Column;
import com.gitee.sunchenbin.mybatis.actable.annotation.Table;
import com.gitee.sunchenbin.mybatis.actable.constants.MySqlCharsetConstant;
import com.gitee.sunchenbin.mybatis.actable.constants.MySqlTypeConstant;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Esion
 * @since 2023/1/19
 */
@Data
@TableName("url")
@Table(name = "url", charset = MySqlCharsetConstant.UTF8MB4, excludeFields = "serialVersionUID")
public class Url implements Serializable {

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @Column(value = "id", isKey = true, type = MySqlTypeConstant.INT, comment = "id")
    private Integer id;

    @Column(value = "name", isNull = false, type = MySqlTypeConstant.VARCHAR, comment = "链接名", defaultValue = "")
    private String name;

    @Column(value = "value", isNull = false, type = MySqlTypeConstant.VARCHAR, comment = "链接", defaultValue = "")
    private String value;

    @Column(value = "sequence", isNull = false, type = MySqlTypeConstant.INT, comment = "排序", defaultValue = "0")
    private Integer sequence;

    @Column(value = "update_time", isNull = false, type = MySqlTypeConstant.DATETIME, comment = "更新时间", defaultValue = "1972-01-01 00:00:00")
    private Date updateTime;

    @Column(value = "is_auth", isNull = false, type = MySqlTypeConstant.INT, comment = "是否认证", defaultValue = "0")
    private Boolean isAuth;

    @Column(value = "auth_user", isNull = false, type = MySqlTypeConstant.VARCHAR, comment = "认证用户名", defaultValue = "")
    private String authUser;

    @Column(value = "auth_password", isNull = false, type = MySqlTypeConstant.VARCHAR, comment = "认证密码", defaultValue = "")
    private String authPassword;

}
