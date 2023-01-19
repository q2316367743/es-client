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
@TableName("base_search_history")
@Table(value = "base_search_name", charset = MySqlCharsetConstant.UTF8MB4, comment = "基础搜索历史", excludeFields = "serialVersionUID")
public class BaseSearchHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @Column(value = "id", type = MySqlTypeConstant.INT, comment = "id", isNull = false, isKey = true)
    private Integer id;

    @Column(value = "url_id", type = MySqlTypeConstant.INT, comment = "链接ID", isNull = false, defaultValue = "0")
    private Integer urlId;

    @TableField(value = "create_time")
    @Column(value = "create_time", type = MySqlTypeConstant.DATETIME, comment = "创建时间", defaultValue = "1972-01-01 00:00:00", isNull = false)
    private Date createTime;
    @TableField(value = "update_time")
    @Column(value = "update_time", type = MySqlTypeConstant.DATETIME, comment = "更新时间", defaultValue = "1972-01-01 00:00:00", isNull = false)
    private Date updateTime;

    @TableField(value = "name")
    @Column(value = "name", type = MySqlTypeConstant.VARCHAR, comment = "名字", defaultValue = "", isNull = false)
    private String name;

    @TableField(value = "index")
    @Column(value = "index", type = MySqlTypeConstant.VARCHAR, comment = "索引", defaultValue = "", isNull = false)
    private String index;

}
