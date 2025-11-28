<p align="center">
<a href="./README.md">简体中文</a> | <a href="./README.en.md">English</a>
</p>

<p align="center">
<img src="./public/logo.png" alt="ES-Client Logo" width="120">
</p>

<h1 align="center">ES-Client</h1>

<p align="center"><strong>Lightweight, Efficient, and Secure Elasticsearch Desktop Client</strong></p>

<p align="center">
<a href="https://gitee.com/qiaoshengda/es-client">
<img src="https://gitee.com/qiaoshengda/es-client/badge/star.svg?theme=white" alt="Gitee Stars">
</a>
<a href="https://github.com/q2316367743/es-client">
<img src="https://img.shields.io/github/stars/q2316367743/es-client?style=social" alt="GitHub Stars">
</a>
</p>

<p align="center">
<a href="https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo">
<img src="https://img.shields.io/badge/Edge-v3.1.9-%23242624" alt="Edge Extension">
</a>
<a href="https://chromewebstore.google.com/detail/es-client/pkhmgepniefdigphghbolofjgbnhnhfd">
<img src="https://img.shields.io/badge/Chrome-v3.1.9-%23ff3847" alt="Chrome Extension">
</a>
</p>

<p align="center">
👉
<a href="https://es-client.esion.xyz" target="_blank">Official Website</a> •
<a href="https://es-client.esion.xyz/docs/app/es-client-open" target="_blank">Documentation</a> •
<a href="https://es-client.esion.xyz/feedback/app/es-client-open" target="_blank">Feedback</a> 👈
</p>

## 💡 Why ES-Client?

Official Elasticsearch tools like Kibana are powerful but heavy, while veteran plugins like elasticsearch-head have been discontinued with outdated user experiences.

ES-Client emerges as a solution - designed specifically for individual developers and operations personnel, focusing on high-frequency daily scenarios, providing lightweight, fast, secure, and standalone management experience.

* ✅ No server deployment required
* ✅ No team collaboration dependencies
* ✅ Ready to use out-of-the-box with zero configuration

## 🚀 Core Features

### 🔍 Intelligent Index Management

* Auto Grouping: Intelligently categorize indices by prefix, date, or regex pattern - say goodbye to chaotic lists of thousands of log indices
* Collapse Operations: Expand/collapse index groups with one click for more efficient batch operations

### 🎨 Visual Configuration Wizard

* Index Creation: Graphical mapping & settings configuration
* ILM Policies: Visually define lifecycle management rules
* Index Templates: WYSIWYG template configuration, reducing DSL learning curve

### ⚠️ Safe Batch Operations

Supports _update_by_query / _delete_by_query
Triple protection: Operation preview + Real-time progress bar + Anytime cancellation, completely eliminating accidental deletion risks

### 📊 In-depth Performance Diagnostics

* Slow Query Analysis Panel: Automatically capture high-latency requests

* Integrated explain & profile visualization for quick identification of:
  * Non-indexed fields
  * Excessive shards
  * Script performance bottlenecks

### 📤 Streaming Big Data Export (Pro)

* Support exporting 100,000+ rows to CSV / Excel / JSON
* Real-time progress display + Resume capability, no lag or data loss for large tasks

### 🩺 Cluster Health Overview (Pro)

Dashboard displays at a glance:
* Node count
* Shard status (unassigned/recovering)
* Disk watermark & read-only warnings
* Automatic highlighting of exceptions for peace of mind in operations

### 🔒 High-risk Operation Audit (Pro)

* Automatically record context of sensitive operations like deletion and modification
* Support rapid retrospection and problem location

## 📥 Installation & Usage
- [Edge Store](https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo)
- Chrome (VPN required): [Chrome Web Store](https://chromewebstore.google.com/detail/es-client/pkhmgepniefdigphghbolofjgbnhnhfd)

## 🖼️ Screenshots

| Home                | Data Browser                | Basic Query                |
|-------------------|---------------------|---------------------|
| ![Home](/img/1.png) | ![Data Browser](/img/2.png) | ![Basic Query](/img/3.png) |

| Advanced Query                | Settings                | About                |
|---------------------|-------------------|-------------------|
| ![Advanced Query](/img/4.png) | ![Settings](/img/5.png) | ![About](/img/6.png) |

## 🛠 Tech Stack
Frontend: Vue 3 + TypeScript + Vite 5 + Arco Design
Plugin System: Chrome / Edge

## ❤️ Open Source & Support

Gitee: [https://gitee.com/qiaoshengda/es-client](https://gitee.com/qiaoshengda/es-client) (Main repository, recommended for Issues)

GitHub: [https://github.com/q2316367743/es-client](https://github.com/q2316367743/es-client)

Documentation: [Documentation Center](https://es-client.esion.xyz/docs/app/es-client-open)

Feedback: [Feedback Center](https://es-client.esion.xyz/feedback/app/es-client-open)

Experience ES-Client now and make Elasticsearch management simple, secure, and efficient! 🚀
