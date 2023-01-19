package xyz.esion.esclient;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import xyz.esion.esclient.property.EsClientProperty;

/**
 * @author Esion
 * @since 2023/1/19
 */
@SpringBootApplication
@EnableConfigurationProperties(EsClientProperty.class)
@ComponentScan(basePackages = {"com.gitee.sunchenbin.mybatis.actable.manager.*", "xyz.esion.esclient"})
@EnableTransactionManagement
public class EsClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(EsClientApplication.class, args);
    }

}
