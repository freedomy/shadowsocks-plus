# 功能

- 原版 shadowsocks-go 所有功能
- Web 管理面板

# 使用

对于 64 位 Debian / Ubuntu , 本项目提供了[一键部署脚本](https://raw.githubusercontent.com/shadowsocks-plus/shadowsocks-plus/master/scripts/deploy.sh)。

在 64 位 Debian / Ubuntu 下，以下命令即可完成安装:

    wget https://raw.githubusercontent.com/shadowsocks-plus/shadowsocks-plus/master/scripts/deploy.sh && chmod +x deploy.sh && ./deploy.sh

当提示 `Please input your HyperIdentity user id:` 时，请输入你的 HyperIdentity 用户 ID ( 形如 `3d01da49-adf9-4c38-bbeb-cda9e9746ff6` ) 。**此步骤可直接按 Enter 键跳过，但为安全起见，Web 管理面板将无法登录。**如果你没有 HyperIdentity 账户，可以在 [HyperIdentity 用户中心](https://hyperidentity.ifxor.com/web/) 注册。登录后，即可看到用户 ID。

看到以下消息时，表示安装完成:

```
Done.
Please change the "domain" value in /etc/ssplus_config.json to your publicly-accessible domain name or IP address and port.
Run "ssplus" to start the server.
```

然后，请编辑 `/etc/ssplus_config.json` 配置文件，将 `domain` 的值改为 `8.8.8.8:7791` 的形式。其中 `8.8.8.8` 请替换为你的服务器的公网 IP 地址，如果有反向代理，请把 `7791` 改成代理后的端口。如果你不需要使用 Web 管理面板，此步骤可跳过。

配置完成后，执行命令 `nohup ssplus &` 即可在后台启动服务端。如果需要随服务器启动自动运行，可以将此命令加入 `/etc/rc.local`。

对于其他系统，可以从 npm 获取 `shadowsocks-plus` 包来使用:

    npm install -g shadowsocks-plus

配置方式请参考一键脚本。

# TODO

- 集成 kcptun 加速

# Copyright

本项目采用 LGPL License.

引用了 shadowsocks-go 的二进制文件。感谢相关项目的作者 :-)

a test a line
a line again ssh test.

line change test.  
two space 

