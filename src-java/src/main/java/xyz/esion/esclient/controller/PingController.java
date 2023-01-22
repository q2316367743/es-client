package xyz.esion.esclient.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import xyz.esion.esclient.global.Result;

/**
 * @author Esion
 * @since 2023/1/20
 */
@RestController
@RequestMapping("api/ping")
public class PingController {
    
    @GetMapping
    public Result<String> ping() {
        return Result.success("pong");
    }
    
}
