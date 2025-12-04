<template>
  <div class="about">
    <div class="header-section">
      <h1 class="main-title">Hi，感谢使用 es-client ！</h1>
      <div class="version-info">
        <a-tag color="blue">版本：{{ data.version }}</a-tag>
        <a-tag color="green" class="build-tag">构建于 {{ data.build }}</a-tag>
      </div>
    </div>

    <!-- 专业版推广卡片 -->
    <div class="feature-card professional-card">
      <div class="card-content">
        <h2 class="card-title">🚀 桌面专业版</h2>
        <p class="card-description">
          开发者自用工具，效率翻倍
        </p>
        <ul class="feature-list">
          <li>📊 高级可视化图表分析</li>
          <li>💾 全量数据导出功能</li>
          <li>📥 批量数据导入支持</li>
          <li>⚡ 更多高级特性</li>
        </ul>
        <a-button type="primary" @click="open(data.url.price)" class="download-btn">
          立即体验专业版
        </a-button>
      </div>
    </div>

    <!-- 功能介绍卡片 -->
    <div class="info-cards">
      <div class="feature-card">
        <div class="card-content">
          <h2 class="card-title">📚 使用帮助</h2>
          <p class="card-description">
            使用中遇到任何问题，你可以先访问用户手册，在里面可以查看功能说明及常见问题解答。
          </p>
          <a-button @click="open(data.doc.index)" type="outline" class="action-btn">
            查看用户手册
          </a-button>
        </div>
      </div>

      <div class="feature-card">
        <div class="card-content">
          <h2 class="card-title">💬 建议反馈</h2>
          <p class="card-description">
            如果用户手册没有解决你的问题，或者对项目有什么建议，欢迎随时反馈。
          </p>
          <div class="feedback-actions">
            <a-button @click="open(data.url.feedback)" type="outline" class="action-btn">
              问题反馈
            </a-button>
            <a-button @click="open('mailto:' + data.email)" type="outline" class="action-btn">
              联系邮箱
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 社区互动 -->
    <div class="feature-card community-card">
      <div class="card-content">
        <h2 class="card-title">❤️ 开源社区</h2>
        <p class="card-description">
          如果这个项目对你有所帮助，欢迎 Star 关注、点赞支持，这对我们是极大的鼓励！
        </p>
        <div class="community-links">
          <template v-for="(repository, index) in data.repositories" :key="index">
            <a-link target="_blank" @click="open(repository.url)">{{ repository.name }}</a-link>
            <span v-if="index < data.repositories.length - 1" class="separator">|</span>
          </template>
        </div>
        <div class="community-links">
          <template v-for="(url, name, index) in data.distributes" :key="name">
            <a-link target="_blank" @click="open(url)">{{ name }}</a-link>
            <span v-if="index < Object.keys(data.distributes).length - 1" class="separator">|</span>
          </template>
        </div>
        <a-button @click="licenseDialog = true" type="outline" size="small" class="license-btn">
          查看开源许可证
        </a-button>
      </div>
    </div>

    <!-- 相关资源 -->
    <div class="resources-section">
      <h2 class="section-title">🔗 相关资源</h2>
      <div class="resource-list">
        <span>仓库：</span>
        <template v-for="(repository, index) in data.repositories" :key="index">
          <a-link target="_blank" @click="open(repository.url)">{{ repository.name }}</a-link>
          <span v-if="index < data.repositories.length - 1" class="separator">|</span>
        </template>
      </div>
    </div>

    <!-- 建议反馈模块 -->
    <div class="feedback-section">
      <h2 class="section-title">📝 建议反馈</h2>
      <feedback-module />
    </div>

    <a-modal title="Apache 2.0 开源许可证" v-model:visible="licenseDialog" render-to-body 
             :mask-closable="false" draggable unmount-on-close width="750px" :footer="false">
      <div class="license-content">
        <license-apache2_0 />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Constant from "@/global/Constant";
import LicenseApache2_0 from "@/components/License/Apache2_0.vue";
import FeedbackModule from '@/module/Feedback/index.vue';
import { openUrl } from "@/utils/BrowserUtil";

export default defineComponent({
  name: "setting-about",
  components: { LicenseApache2_0, FeedbackModule },
  data: () => ({
    data: Constant,
    licenseDialog: false,
  }),
  methods: {
    open(url: string) {
      openUrl(url);
    }
  }
});
</script>

<style lang="less" scoped>
.about {
  margin: 20px auto;
  max-width: 800px;
  padding: 0 20px;

  .header-section {
    text-align: center;
    margin-bottom: 30px;
    
    .main-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1d2129;
    }
    
    .version-info {
      display: flex;
      justify-content: center;
      gap: 15px;
      
      .build-tag {
        margin-left: 0;
      }
    }
  }

  .feature-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 24px;
    margin-bottom: 20px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
    
    .card-content {
      .card-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #1d2129;
      }
      
      .card-description {
        color: #86909c;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 16px;
      }
      
      .feature-list {
        list-style: none;
        padding: 0;
        margin: 20px 0;
        
        li {
          padding: 6px 0;
          padding-left: 20px;
          position: relative;
          color: #4e5969;
          
          &::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #00b42a;
            font-weight: bold;
          }
        }
      }
      
      .download-btn, .action-btn {
        margin-top: 10px;
      }
      
      .feedback-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        
        .action-btn {
          flex: 1;
          min-width: 120px;
        }
      }
      
      .community-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin: 10px 0;
        
        .separator {
          color: #c9cdd4;
        }
      }
      
      .license-btn {
        margin-top: 15px;
      }
    }
  }
  
  .professional-card {
    border: 1px solid #00b42a;
    background: linear-gradient(120deg, #f6ffed 0%, #ffffff 100%);
    
    .card-title {
      color: #00b42a;
    }
  }
  
  .community-card {
    .card-title {
      color: #ff7d00;
    }
  }
  
  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .resources-section, .feedback-section {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 24px;
    margin-bottom: 20px;
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #1d2129;
    }
    
    .resource-list {
      color: #4e5969;
      line-height: 1.6;
      
      .separator {
        margin: 0 8px;
        color: #c9cdd4;
      }
    }
  }
  
  .license-content {
    height: calc(80vh - 60px - 54px);
  }
}
</style>