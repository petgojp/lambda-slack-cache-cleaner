AWS Lambda Function 
=============

Slackのbotとして利用するLambda Functionです。OpsWorks上のnginx::purge_cacheレシピを実行しNginxのキャッシュファイルを削除します。

AWSのAPI GatewayとLambda Functionを組み合わせてサーバーレスでbotを配備します。

設定ファイル
--

`.env`として下記の内容を保存しておきます。シークレット等を含むためgitでは管理しません。

```
SLACK_INCOMING_WEBHOOK_URL='https://hooks.slack.com/services/xxxxx' <- slackで設定したIncoming Webhook URL
SLACK_CHANNEL_NAME='bot' <- #なしのchannel名
SLACK_USER_NAME='cache-ken' <- botの名前
SLACK_ICON_EMOJI=':dog:' <- botのアイコンにしたい絵文字コード
CACHE_CLEANER_AWS_ACCESS_KEY_ID='xxxxx'
CACHE_CLEANER_AWS_SECRET_ACCESS_KEY='xxxxx'
STACK_ID_NEWS='xxxxx'
STACK_ID_CORP='xxxxx'
STACK_ID_MATCH='xxxxx'
```

開発方法
--

下記のようにnpm installしてからZIPでアーカイブし、AWSマネジメント・コンソールにて手動でアップロードします。

```
$ npm install
$ zip -r dist.zip .env index.js node_modules
```
