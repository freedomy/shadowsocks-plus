#!/bin/bash

echo "[*] Installing dependencies"
apt-get update
apt-get install -y wget
apt-get install -y xz-utils gzip
pushd .
cd /tmp/
wget https://nodejs.org/dist/v6.9.5/node-v6.9.5-linux-x64.tar.xz
xz -d < node-v6.9.5-linux-x64.tar.xz | tar x
rm node-v6.9.5-linux-x64.tar.xz
mv node-v6.9.5-linux-x64 /usr/local/
popd

echo ""

echo "[*] Installing shadowsocks-plus"
/usr/local/node-v6.9.5-linux-x64/bin/node /usr/local/node-v6.9.5-linux-x64/bin/npm install -g shadowsocks-plus

echo ""
echo "----------"

echo ""
echo "Please input your HyperIdentity user id:"
read ADMIN_USER_ID

cat > /etc/ssplus_config.json << EOF
{
    "ss_binary_path": "/usr/local/bin/ss-server",
    "admin_users": [
        "$ADMIN_USER_ID"
    ],
    "domain": "127.0.0.1:7791",
    "instance_list_path": "/etc/ssplus_instances.json"
}
EOF

rm /usr/local/bin/ssplus

cat > /usr/local/bin/ssplus << EOF
#!/bin/sh
echo "Server started"
/usr/local/node-v6.9.5-linux-x64/bin/node /usr/local/node-v6.9.5-linux-x64/lib/node_modules/shadowsocks-plus/scripts/run.js /etc/ssplus_config.json
EOF

chmod +x /usr/local/bin/ssplus

pushd .
cd /tmp/
wget https://github.com/shadowsocks/shadowsocks-go/releases/download/1.2.1/shadowsocks-server.tar.gz
gzip -d < shadowsocks-server.tar.gz | tar x
rm shadowsocks-server.tar.gz
mv shadowsocks-server /usr/local/bin/ss-server
popd

chmod +x /usr/local/bin/ss-server

echo ""
echo "----------"
echo "Done."
echo "Please change the \"domain\" value in /etc/ssplus_config.json to your publicly-accessible domain name or IP address and port."
echo "Run \"ssplus\" to start the server.";
