package xyz.esion.esclient.property;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2023/1/19
 */
@Data
@ConfigurationProperties(prefix = "es-client")
public class EsClientProperty implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * token
     */
    private String token;

}
